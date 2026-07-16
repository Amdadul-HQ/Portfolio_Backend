-- CreateTable
CREATE TABLE "AiSetting" (
    "id" TEXT NOT NULL,
    "context" TEXT NOT NULL DEFAULT '',
    "persona" TEXT NOT NULL DEFAULT '',
    "greeting" TEXT NOT NULL DEFAULT 'Hi! I''m Amdadul''s AI assistant. Ask me anything about his skills, projects, or experience — or say ''contact'' to reach him directly.',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiSetting_pkey" PRIMARY KEY ("id")
);
