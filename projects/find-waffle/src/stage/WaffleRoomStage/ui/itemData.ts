export type Bag = {
  id: number;
  name: string;
  imageSrc: string;
};

export const bags: (Bag | null)[][] = [
  [
    {
      id: 0,
      name: '파스텔백팩-블루',
      imageSrc: '/models/WaffleRoom/images/blue.png',
    },
    {
      id: 1,
      name: '파스텔백팩-핑크',
      imageSrc: '/models/WaffleRoom/images/pink.png',
    },
    {
      id: 2,
      name: '파스텔백팩-그린',
      imageSrc: '/models/WaffleRoom/images/green.png',
    },
  ],
  [
    {
      id: 3,
      name: '와플백-블루',
      imageSrc: '/models/WaffleRoom/images/bluebag.png',
    },
    {
      id: 4,
      name: '와플백-핑크',
      imageSrc: '/models/WaffleRoom/images/pinkbag.png',
    },
    {
      id: 5,
      name: '와플백-rotate!',
      imageSrc: '/models/WaffleRoom/images/wafflebag.png',
    },
  ],
  [
    {
      id: 6,
      name: '장바구니-블루',
      imageSrc: '/models/WaffleRoom/images/fake_blue.png',
    },
    {
      id: 7,
      name: '장바구니-하트',
      imageSrc: '/models/WaffleRoom/images/fake_white.png',
    },
    null,
  ],
];

export type Skin = {};

export const skins: (Skin | null)[][] = [[]];
