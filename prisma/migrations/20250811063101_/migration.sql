-- CreateEnum
CREATE TYPE "public"."ROLE" AS ENUM ('CUSTOMER', 'ENDUSER');

-- CreateTable
CREATE TABLE "public"."User"
(
    "id"        TEXT            NOT NULL,
    "name"      TEXT,
    "email"     TEXT            NOT NULL,
    "phone"     TEXT,
    "password"  TEXT            NOT NULL,
    "role"      "public"."ROLE" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3)    NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User" ("email");
