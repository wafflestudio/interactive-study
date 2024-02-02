import { OrnamentLoadProps } from './Ornament';

export const ORNAMENT_DATA: {[key: string]: OrnamentLoadProps} = {
  ball_1: {
    path: new URL(`../assets/ornaments/ball_1.svg`, import.meta.url).href,
    rotation: 'none',
  },
  ball_2: {
    path: new URL(`../assets/ornaments/ball_2.svg`, import.meta.url).href,
    rotation: 'none',
  },
  candy: {
    path: new URL(`../assets/ornaments/candy.svg`, import.meta.url).href,
    rotation: 'pendulum',
  },
  fruit_1: {
    path: new URL(`../assets/ornaments/fruit_1.svg`, import.meta.url).href,
  },
  fruit_2: {
    path: new URL(`../assets/ornaments/fruit_2.svg`, import.meta.url).href,
  },
  pinecone_1: {
    path: new URL(`../assets/ornaments/pinecone_1.svg`, import.meta.url).href,
  },
  pinecone_2: {
    path: new URL(`../assets/ornaments/pinecone_2.svg`, import.meta.url).href,
  },
  poinsettia_1: {
    path: new URL(`../assets/ornaments/poinsettia_1.svg`, import.meta.url).href,
  },
  poinsettia_2: {
    path: new URL(`../assets/ornaments/poinsettia_2.svg`, import.meta.url).href,
  },
  ribbon: {
    path: new URL(`../assets/ornaments/ribbon.svg`, import.meta.url).href,
    rotation: 'pendulum',
  },
  star: {
    path: new URL(`../assets/ornaments/star.svg`, import.meta.url).href,
    rotation: 'none',
    scale: 0.5,
  },
}
