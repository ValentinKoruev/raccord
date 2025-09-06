-- AlterTable
ALTER TABLE "DirectChannel" ADD COLUMN     "isGroup" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserOnDirectChannel" ADD COLUMN     "isHidden" BOOLEAN NOT NULL DEFAULT false;
