import axios from "axios";
import { parseStringPromise } from "xml2js";
import Logger from "@/app/api/utils/logger.util";
import { NextRequest, NextResponse } from "next/server";
import { determineCampusFromURL } from "@/app/api/utils/links.util";
import { parseDescription } from "@/app/api/utils/parseDescription.util";

const logger = new Logger();

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

export async function GET(request: NextRequest) {
  let allItemsList: RSSItem[] = [];
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
  const filterCampus = url.searchParams.get("campus") as string | null;

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

        const newItems = data.rss.channel[0].item;
        const { campus, isEveryone } = determineCampusFromURL(RSS_URL);

        const formattedData = newItems.map((item) => ({
          title: String(item.title),
          link: item.link,
          description: parseDescription(item.description),
          guid: item.guid[0]["_"],
          pubDate: item.pubDate,
          campus,
          isEveryone,
        }));

        allItemsList = [...allItemsList, ...formattedData];
      } catch (error: unknown) {
        logger.error(`Error processing RSS feed: ${RSS_URL}`, error);
      }
    });

    await Promise.all(feedPromises);

    allItemsList.sort((a, b) => {
      return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
    });

    if (filterCampus) {
      allItemsList = allItemsList.filter(
        (item) => item.campus === filterCampus
      );
    }

    const totalItems = allItemsList.length;
    const startIndex = (page - 1) * pageSize;
    const paginatedItems = allItemsList.slice(
      startIndex,
      startIndex + pageSize
    );

    return NextResponse.json(
      {
        items: paginatedItems,
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages: Math.ceil(totalItems / pageSize),
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    logger.error("Error fetching or processing RSS feed", error);

    return NextResponse.json(
      { message: "Error fetching or processing RSS feed" },
      { status: 400 }
    );
  }
}

// Interfaces //
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
  campus: string | null;
  imageUrl?: string | null;
  isEveryone: boolean;
}
