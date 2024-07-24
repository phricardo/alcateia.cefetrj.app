import axios from "axios";
import { parseStringPromise } from "xml2js";
import { NextRequest, NextResponse } from "next/server";
import { Campus, ChannelPublished, PrismaClient } from "@prisma/client";
import {
  parseDescription,
  parseImageUrl,
} from "../../../../../utils/parseDescription.util";
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
  imageUrl: string | null;
}

const logger = new Logger();
const prisma = new PrismaClient();

export async function GET(request: NextRequest, response: NextResponse) {
  const feeds = [
    "https://www.cefet-rj.br/index.php/eventos?format=feed&type=rss",
    "https://www.cefet-rj.br/index.php/eventos-campus-maracana?format=feed&type=rss",
    "https://www.cefet-rj.br/index.php/eventos-campus-angra-dos-reis?format=feed&type=rss",
    "https://www.cefet-rj.br/index.php/eventos-campus-itaguai?format=feed&type=rss",
    "https://www.cefet-rj.br/index.php/eventos-campus-maria-da-graca?format=feed&type=rss",
    "https://www.cefet-rj.br/index.php/eventos-campus-nova-friburgo?format=feed&type=rss",
    "https://www.cefet-rj.br/index.php/eventos-campus-nova-iguacu?format=feed&type=rss",
    "https://www.cefet-rj.br/index.php/eventos-campus-petropolis?format=feed&type=rss",
    "https://www.cefet-rj.br/index.php/eventos-campus-valenca?format=feed&type=rss",
  ];

  let shownGuids: string[] = [];

  try {
    const feedPromises = feeds.map(async (RSS_URL) => {
      const response = await axios.get(RSS_URL, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      const data = (await parseStringPromise(response.data)) as RSSFeedRequest;

      const { campus, isAllCampusEvent } = determineCampusFromURL(RSS_URL);

      const newItems = data.rss.channel[0].item.filter(
        (item) => !shownGuids.includes(item.guid[0]["_"])
      );

      const formattedData = newItems.map((item) => ({
        title: String(item.title),
        link: item.link,
        description: parseDescription(item.description),
        guid: item.guid[0]["_"],
        pubDate: item.pubDate,
        imageUrl: parseImageUrl(item.description),
      }));

      shownGuids = [
        ...shownGuids,
        ...newItems.map((item) => item.guid[0]["_"]),
      ];

      await Promise.all(
        formattedData.map(async (data) => {
          const existingItem = await prisma.events.findUnique({
            where: {
              guid: data.guid,
            },
          });

          if (!existingItem) {
            await prisma.events.create({
              data: {
                guid: data.guid,
                title: data.title,
                description: data.description,
                channel: ChannelPublished.PORTAL_CEFETRJ,
                campus: campus,
                isAllCampusEvent: isAllCampusEvent,
                pubDate: new Date(data.pubDate),
                thumbnail: data.imageUrl,
              },
            });
          }
        })
      );
    });

    await Promise.all(feedPromises);

    return NextResponse.json(
      { message: "RSS fetch successful" },
      { status: 200 }
    );
  } catch (error: unknown) {
    logger.error("Events: Error fetching or processing RSS feed", error);
    return NextResponse.json(
      { message: "Error fetching or processing RSS feed" },
      { status: 400 }
    );
  }
}

function determineCampusFromURL(url: string): {
  campus: Campus | null;
  isAllCampusEvent: boolean;
} {
  if (url.includes("eventos-campus-maracana")) {
    return { campus: Campus.MARACANA, isAllCampusEvent: false };
  } else if (url.includes("eventos-campus-angra-dos-reis")) {
    return { campus: Campus.ANGRA_DOS_REIS, isAllCampusEvent: false };
  } else if (url.includes("eventos-campus-itaguai")) {
    return { campus: Campus.ITAGUAI, isAllCampusEvent: false };
  } else if (url.includes("eventos-campus-maria-da-graca")) {
    return { campus: Campus.MARIA_DA_GRACA, isAllCampusEvent: false };
  } else if (url.includes("eventos-campus-nova-friburgo")) {
    return { campus: Campus.NOVA_FRIBURGO, isAllCampusEvent: false };
  } else if (url.includes("eventos-campus-nova-iguacu")) {
    return { campus: Campus.NOVA_IGUACU, isAllCampusEvent: false };
  } else if (url.includes("eventos-campus-petropolis")) {
    return { campus: Campus.PETROPOLIS, isAllCampusEvent: false };
  } else if (url.includes("eventos-campus-valenca")) {
    return { campus: Campus.VALENCA, isAllCampusEvent: false };
  } else if (url.includes("eventos?format=feed&type=rss")) {
    return { campus: null, isAllCampusEvent: true };
  } else {
    throw new Error("Unknown campus in RSS URL");
  }
}
