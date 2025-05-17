import { getCourtImg } from './getImages';

export const locations = [
  {
    _id: '1',
    name: 'Щасливе',
    image: getCourtImg('Court_01'),
    address: 'вул. Лесі Українки 18',
    mapLink: 'https://maps.app.goo.gl/H1arsaJyAUF1D7AS6',
  },
  {
    _id: '2',
    name: 'Табір',
    image: '',
    address: 'Адреса відсутня',
    mapLink: 'https://maps.app.goo.gl/H1arsaJyAUF1D7AS6',
  },
  {
    _id: '3',
    name: 'Проліски',
    image: '',
    address: 'Адреса відсутня',
    mapLink: 'https://maps.app.goo.gl/H1arsaJyAUF1D7AS6',
  },
];
