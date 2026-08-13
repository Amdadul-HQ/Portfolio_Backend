import prisma from '../../app/shared/prisma';

const getOrCreateSettings = async () => {
  const existing = await prisma.siteSettings.findFirst();
  if (existing) return existing;
  return prisma.siteSettings.create({ data: {} });
};

const getSettings = async () => getOrCreateSettings();

const updateSettings = async (payload: Partial<{ resumeLink: string }>) => {
  const s = await getOrCreateSettings();
  return prisma.siteSettings.update({ where: { id: s.id }, data: payload });
};

export const SettingsService = {
  getSettings,
  updateSettings,
};
