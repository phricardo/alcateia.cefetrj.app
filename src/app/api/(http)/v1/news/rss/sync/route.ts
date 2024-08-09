import axios from "axios";
import { parseStringPromise } from "xml2js";
import { NextRequest, NextResponse } from "next/server";
import { Campus, ChannelPublished, PrismaClient } from "@prisma/client";
import { parseDescription } from "../../../../../utils/parseDescription.util";
import Logger from "../../../../../utils/logger.util";

interface RSSFeedRequest {
  rss: {
    channel: [
      {
        item: RSSItem[];
      }
    ];
  };
}

interface RSSItem {
  title: string;
  link: string;
  description: string;
  guid: any;
  pubDate: string;
}

const logger = new Logger();
const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const feeds = [
    "https://www.cefet-rj.br/index.php/noticias?format=feed&type=rss",
    "https://www.cefet-rj.br/index.php/noticias-campus-maracana?format=feed&type=rss",
    "https://www.cefet-rj.br/index.php/noticias-campus-angra-dos-reis?format=feed&type=rss",
    "https://www.cefet-rj.br/index.php/noticias-campus-itaguai?format=feed&type=rss",
    "https://www.cefet-rj.br/index.php/noticias-campus-maria-da-graca?format=feed&type=rss",
    "https://www.cefet-rj.br/index.php/noticias-campus-nova-friburgo?format=feed&type=rss",
    "https://www.cefet-rj.br/index.php/noticias-campus-nova-iguacu?format=feed&type=rss",
    "https://www.cefet-rj.br/index.php/noticias-campus-petropolis?format=feed&type=rss",
    "https://www.cefet-rj.br/index.php/noticias-campus-valenca?format=feed&type=rss",
  ];

  let shownGuids: string[] = [];
  let newItemsList: RSSItem[] = [];

  try {
    const feedPromises = feeds.map(async (RSS_URL) => {
      try {
        const response = await axios.get(RSS_URL, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        });

        const data = (await parseStringPromise(
          response.data
        )) as RSSFeedRequest;

        const { campus, isAllCampusNews } = determineCampusFromURL(RSS_URL);

        const newItems = data.rss.channel[0].item.filter(
          (item) => !shownGuids.includes(item.guid[0]["_"])
        );

        const formattedData = newItems.map((item) => ({
          title: String(item.title),
          link: item.link,
          description: parseDescription(item.description),
          guid: item.guid[0]["_"],
          pubDate: item.pubDate,
        }));

        shownGuids = [
          ...shownGuids,
          ...newItems.map((item) => item.guid[0]["_"]),
        ];

        await Promise.all(
          formattedData.map(async (data) => {
            const existingItem = await prisma.news.findUnique({
              where: {
                guid: data.guid,
              },
            });

            if (!existingItem) {
              await prisma.news.create({
                data: {
                  guid: data.guid,
                  title: data.title,
                  description: data.description,
                  channel: ChannelPublished.PORTAL_CEFETRJ,
                  campus: campus,
                  isAllCampusNews: isAllCampusNews,
                  pubDate: new Date(data.pubDate),
                },
              });

              newItemsList.push(data);
            }
          })
        );
      } catch (error) {
        logger.error(`Erro ao processar o feed RSS: ${RSS_URL}`, error);
      }
    });

    await Promise.all(feedPromises);

    if (newItemsList.length > 0) {
      return NextResponse.json(
        { message: "New items found", newItems: newItemsList },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No new items found" },
        { status: 200 }
      );
    }
  } catch (error: unknown) {
    logger.error("Error fetching or processing RSS feed", error);

    return NextResponse.json(
      { message: "Error fetching or processing RSS feed" },
      { status: 400 }
    );
  }
}

function determineCampusFromURL(url: string): {
  campus: Campus | null;
  isAllCampusNews: boolean;
} {
  if (url.includes("noticias-campus-maracana")) {
    return { campus: Campus.MARACANA, isAllCampusNews: false };
  } else if (url.includes("noticias-campus-angra-dos-reis")) {
    return { campus: Campus.ANGRA_DOS_REIS, isAllCampusNews: false };
  } else if (url.includes("noticias-campus-itaguai")) {
    return { campus: Campus.ITAGUAI, isAllCampusNews: false };
  } else if (url.includes("noticias-campus-maria-da-graca")) {
    return { campus: Campus.MARIA_DA_GRACA, isAllCampusNews: false };
  } else if (url.includes("noticias-campus-nova-friburgo")) {
    return { campus: Campus.NOVA_FRIBURGO, isAllCampusNews: false };
  } else if (url.includes("noticias-campus-nova-iguacu")) {
    return { campus: Campus.NOVA_IGUACU, isAllCampusNews: false };
  } else if (url.includes("noticias-campus-petropolis")) {
    return { campus: Campus.PETROPOLIS, isAllCampusNews: false };
  } else if (url.includes("noticias-campus-valenca")) {
    return { campus: Campus.VALENCA, isAllCampusNews: false };
  } else if (url.includes("noticias?format=feed&type=rss")) {
    return { campus: null, isAllCampusNews: true };
  } else {
    throw new Error("Unknown campus in RSS URL");
  }
}
