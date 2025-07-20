-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guild" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "banner" TEXT,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "Guild_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOnGuild" (
    "userId" INTEGER NOT NULL,
    "guildId" INTEGER NOT NULL,
    "role" TEXT,

    CONSTRAINT "UserOnGuild_pkey" PRIMARY KEY ("userId","guildId")
);

-- CreateTable
CREATE TABLE "GuildChannel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "guildId" INTEGER NOT NULL,

    CONSTRAINT "GuildChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuildMessage" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" INTEGER NOT NULL,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "GuildMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectChannel" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "DirectChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOnDirectChannel" (
    "userId" INTEGER NOT NULL,
    "directChannelId" INTEGER NOT NULL,

    CONSTRAINT "UserOnDirectChannel_pkey" PRIMARY KEY ("userId","directChannelId")
);

-- CreateTable
CREATE TABLE "DirectMessage" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "senderId" INTEGER NOT NULL,
    "directChannelId" INTEGER NOT NULL,

    CONSTRAINT "DirectMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Guild" ADD CONSTRAINT "Guild_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnGuild" ADD CONSTRAINT "UserOnGuild_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnGuild" ADD CONSTRAINT "UserOnGuild_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildChannel" ADD CONSTRAINT "GuildChannel_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildMessage" ADD CONSTRAINT "GuildMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuildMessage" ADD CONSTRAINT "GuildMessage_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "GuildChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnDirectChannel" ADD CONSTRAINT "UserOnDirectChannel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOnDirectChannel" ADD CONSTRAINT "UserOnDirectChannel_directChannelId_fkey" FOREIGN KEY ("directChannelId") REFERENCES "DirectChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_directChannelId_fkey" FOREIGN KEY ("directChannelId") REFERENCES "DirectChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
