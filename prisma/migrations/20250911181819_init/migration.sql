-- CreateEnum
CREATE TYPE "public"."MethodType" AS ENUM ('POST', 'GET', 'PUT', 'DELETE');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Workflow" (
    "workflowId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "nodes" JSONB NOT NULL,
    "connections" JSONB NOT NULL,

    CONSTRAINT "Workflow_pkey" PRIMARY KEY ("workflowId")
);

-- CreateTable
CREATE TABLE "public"."Webhook" (
    "webhookId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "method" "public"."MethodType" NOT NULL,
    "path" TEXT NOT NULL,
    "header" JSONB NOT NULL,
    "secret" TEXT NOT NULL,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("webhookId")
);

-- CreateTable
CREATE TABLE "public"."Credentials" (
    "credentialId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Credentials_pkey" PRIMARY KEY ("credentialId")
);
