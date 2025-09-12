/*
  Warnings:

  - A unique constraint covering the columns `[workflowId]` on the table `Webhook` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workflowId` to the `Webhook` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Workflow` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Webhook" ADD COLUMN     "workflowId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Workflow" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Webhook_workflowId_key" ON "public"."Webhook"("workflowId");

-- AddForeignKey
ALTER TABLE "public"."Workflow" ADD CONSTRAINT "Workflow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Webhook" ADD CONSTRAINT "Webhook_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."Workflow"("workflowId") ON DELETE RESTRICT ON UPDATE CASCADE;
