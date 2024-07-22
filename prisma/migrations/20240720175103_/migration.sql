/*
  Warnings:

  - The `channel` column on the `News` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ChannelPublished" AS ENUM ('STUDENT_NEWSLETTER', 'PORTAL_CEFETRJ', 'OTHERS');

-- AlterTable
ALTER TABLE "News" DROP COLUMN "channel",
ADD COLUMN     "channel" "ChannelPublished" NOT NULL DEFAULT 'OTHERS';

-- DropEnum
DROP TYPE "ChannelPublishedNews";

-- CreateTable
CREATE TABLE "Events" (
    "id" SERIAL NOT NULL,
    "guid" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pubDate" TIMESTAMP(3),
    "channel" "ChannelPublished" NOT NULL DEFAULT 'OTHERS',
    "campus" "Campus",
    "isAllCampusEvent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Events_guid_key" ON "Events"("guid");
