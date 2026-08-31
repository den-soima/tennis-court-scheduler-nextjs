/**
 * Конфіг інформаційної модалки про перехід на новий застосунок для бронювання.
 * Щоб вимкнути модалку — постав `enabled: false` (або дочекайся `activeUntil`,
 * після якої дати вона перестане показуватись автоматично).
 */
export const newAppAnnouncementConfig = {
  enabled: true,
  appUrl: 'https://courtly-app.vercel.app',
  activeUntil: '2026-09-14',
  storageKey: 'newAppAnnouncementClosed',
  dismissDurationHours: 48,
};

export const isNewAppAnnouncementActive = (): boolean => {
  const { enabled, activeUntil } = newAppAnnouncementConfig;

  if (!enabled) {
    return false;
  }

  return new Date() <= new Date(`${activeUntil}T23:59:59`);
};

export const isNewAppAnnouncementDismissed = (): boolean => {
  const { storageKey, dismissDurationHours } = newAppAnnouncementConfig;
  const dismissedAt = sessionStorage.getItem(storageKey);

  if (!dismissedAt) {
    return false;
  }

  const hoursSinceDismissed = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60);

  return hoursSinceDismissed < dismissDurationHours;
};

export const dismissNewAppAnnouncement = (): void => {
  sessionStorage.setItem(newAppAnnouncementConfig.storageKey, String(Date.now()));
};
