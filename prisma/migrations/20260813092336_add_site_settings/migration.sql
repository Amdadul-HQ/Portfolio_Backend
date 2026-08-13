-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL,
    "resumeLink" TEXT NOT NULL DEFAULT 'https://drive.google.com/file/d/11s-a26rikQlVfEZs64oLOAEmC2yyxdc6/view?usp=sharing',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
