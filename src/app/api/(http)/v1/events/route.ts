import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Campus } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const campusParam = searchParams.get("campus");
    const searchQuery = searchParams.get("q") || "";

    const pageSize = 5;
    const offset = (Number(page) - 1) * pageSize;

    let whereClause = {};
    if (campusParam && Object.values(Campus).includes(campusParam as Campus)) {
      whereClause = {
        campus: campusParam as Campus,
      };
    }

    if (searchQuery) {
      whereClause = {
        ...whereClause,
        title: {
          contains: searchQuery,
          mode: "insensitive",
        },
      };
    }

    const totalevents = await prisma.events.count({
      where: whereClause,
    });
    const totalPages = Math.ceil(totalevents / pageSize);

    const events = await prisma.events.findMany({
      where: whereClause,
      select: {
        guid: true,
        title: true,
        description: true,
        pubDate: true,
        channel: true,
        campus: true,
        isAllCampusEvent: true,
        thumbnail: true,
      },
      take: pageSize,
      skip: offset,
      orderBy: {
        pubDate: "desc",
      },
    });

    if (events.length === 0) {
      return NextResponse.json(
        {
          error: "No events found for this page or campus",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        events,
        pagination: {
          page: Number(page),
          totalPages,
          pageSize,
          totalItems: totalevents,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: "Error fetching events",
      },
      { status: 400 }
    );
  }
}
