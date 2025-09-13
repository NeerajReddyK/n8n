/*
  Warnings:

  - You are about to drop the column `connections` on the `Workflow` table. All the data in the column will be lost.
  - Added the required column `edges` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Workflow" DROP COLUMN "connections",
ADD COLUMN     "edges" JSONB NOT NULL;
