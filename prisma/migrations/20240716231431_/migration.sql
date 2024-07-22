-- CreateEnum
CREATE TYPE "ChannelPublishedNews" AS ENUM ('STUDENT_NEWSLETTER', 'PORTAL_CEFETRJ', 'OTHERS');

-- CreateEnum
CREATE TYPE "Campus" AS ENUM ('MARACANA', 'ANGRA_DOS_REIS', 'ITAGUAI', 'MARIA_DA_GRACA', 'NOVA_FRIBURGO', 'NOVA_IGUACU', 'PETROPOLIS', 'VALENCA');

-- CreateTable
CREATE TABLE "News" (
    "id" SERIAL NOT NULL,
    "guid" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "channel" "ChannelPublishedNews" NOT NULL DEFAULT 'OTHERS',
    "campus" "Campus",
    "isAllCampusNews" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "News_guid_key" ON "News"("guid");
