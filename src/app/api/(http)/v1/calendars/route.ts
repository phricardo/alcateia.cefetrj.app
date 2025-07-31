import cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const urlSchema = z.object({
  url: z.string().url().min(1),
});

async function fetchCalendarsLinks(url: string): Promise<{
  campus: string;
  currentYear: Record<string, { title: string; link: string }[]>;
  previousYears: Record<
    string,
    Record<string, { title: string; link: string }[]>
  >;
}> {
  try {
    const response = await fetch(url);
    const htmlText = await response.text();
    const $ = cheerio.load(htmlText);
    const links = $("a");
    const baseUrl = "https://www.cefet-rj.br/";
    const data: {
      currentYear: Record<string, { title: string; link: string }[]>;
      previousYears: Record<
        string,
        Record<string, { title: string; link: string }[]>
      >;
    } = {
      currentYear: {},
      previousYears: {},
    };

    let campusName = "";
    const bodyText = $("body").text();
    const campusIndex = bodyText.toLowerCase().indexOf("campus");
    if (campusIndex !== -1) {
      const campusText = bodyText
        .slice(campusIndex - 30, campusIndex + 30)
        .trim();
      const campusMatch = campusText.match(/Campus\s+([^\-]+)/i);
      if (campusMatch && campusMatch[1]) {
        campusName = campusMatch[1].trim();
      }
    }

    // Usar ano atual dinâmico
    const currentYear = new Date().getFullYear();
    const validYears = [
      currentYear.toString(),
      (currentYear - 1).toString(),
      (currentYear - 2).toString(),
    ];

    const extractYear = (text: string): string | null => {
      const match = text.match(/202[0-9]/);
      return match ? match[0] : null;
    };

    const extractCategory = (title: string): string => {
      if (/graduação|graduacao/i.test(title)) {
        return "undergraduate";
      } else if (/médio técnico|medio tecnico|integrado/i.test(title)) {
        return "integrated_technical";
      } else if (/técnico subsequente|tecnico subsequente/i.test(title)) {
        return "subsequent_technical";
      } else {
        return "others";
      }
    };

    let hasCurrentYearCalendar = false;

    links
      .map((_, link) => ({
        href: $(link).attr("href") ?? "",
        title: $(link).text().trim(),
      }))
      .get()
      .filter(({ href }) => {
        return (
          href.endsWith(".pdf") &&
          /(calendário|calendario|cal|202[0-9])/i.test(href)
        );
      })
      .forEach(({ href, title }) => {
        if (href) {
          const yearFromTitle = extractYear(title);
          const yearFromHref = extractYear(href);
          const year = yearFromTitle || yearFromHref || "outros";
          if (validYears.includes(year)) {
            const category = extractCategory(title);
            const fullUrl = baseUrl + href.replace(/^\//, "");
            if (year === currentYear.toString()) {
              hasCurrentYearCalendar = true;
              if (!data.currentYear[category]) data.currentYear[category] = [];
              data.currentYear[category].push({ title, link: fullUrl });
            } else {
              if (!data.previousYears[year]) data.previousYears[year] = {};
              if (!data.previousYears[year][category])
                data.previousYears[year][category] = [];
              data.previousYears[year][category].push({ title, link: fullUrl });
            }
          }
        }
      });

    if (!hasCurrentYearCalendar) {
      for (const year in data.previousYears) {
        if (data.previousYears.hasOwnProperty(year)) {
          for (const category in data.previousYears[year]) {
            if (data.previousYears[year].hasOwnProperty(category)) {
              if (!data.currentYear[category]) data.currentYear[category] = [];
              data.currentYear[category] = data.currentYear[category].concat(
                data.previousYears[year][category]
              );
            }
          }
        }
      }

      data.previousYears = {};
    }

    return {
      campus: campusName,
      currentYear: data.currentYear,
      previousYears: data.previousYears,
    };
  } catch (error: unknown) {
    console.error("Error fetching or parsing the HTML:", error);
    return {
      campus: "",
      currentYear: {},
      previousYears: {},
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url).searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL parameter is required" },
        { status: 400 }
      );
    }

    const validation = urlSchema.safeParse({ url });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid URL parameter" },
        { status: 400 }
      );
    }

    const calendars = await fetchCalendarsLinks(url);

    return NextResponse.json({ calendars }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error handling the request - calendars api", error);
    return NextResponse.json({ error: "Bad Request" }, { status: 404 });
  }
}
