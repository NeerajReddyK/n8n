/*
  Warnings:

  - You are about to drop the column `userId` on the `Workflow` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Workflow" DROP CONSTRAINT "Workflow_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Workflow" DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Workflow" ADD CONSTRAINT "Workflow_email_fkey" FOREIGN KEY ("email") REFERENCES "public"."User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
