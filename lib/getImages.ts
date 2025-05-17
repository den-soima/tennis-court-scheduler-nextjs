const IMAGE_BASE_PATH = '/images';
const ICONS_BASE_PATH = '/images/icons';

const getImages = (name: string): string => {
  return `${IMAGE_BASE_PATH}/${name}.png`;
};

export const getLocationImg = (): string => getImages('locationImg');
export const getCourtImg = (name: string): string => getImages(name);

const getIcons = (name: string): string => {
  return `${ICONS_BASE_PATH}/${name}.svg`;
};

export const getArrowLeftIcon = (): string => getIcons('arrow-left');
export const getArrowRightIcon = (): string => getIcons('arrow-right');
export const getAvatarIcon = (): string => getIcons('avatar-tennis');
export const getLoginIcon = (): string => getIcons('login');
export const getCloseMenuIcon = (): string => getIcons('close-menu');
export const getDeleteIcon = (): string => getIcons('delete');
