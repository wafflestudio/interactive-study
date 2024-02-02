import { OrnamentLoadProps } from './Ornament';

export const ORNAMENT_DATA: {[key: string]: OrnamentLoadProps} = {
  ball_1: {
    path: `${import.meta.env.BASE_URL}ornaments/ball_1.svg`,
    rotation: 'none',
  },
  ball_2: {
    path: `${import.meta.env.BASE_URL}ornaments/ball_2.svg`,
    rotation: 'none',
  },
  candy: {
    path: `${import.meta.env.BASE_URL}ornaments/candy.svg`,
    rotation: 'pendulum',
  },
  fruit_1: {
    path: `${import.meta.env.BASE_URL}ornaments/fruit_1.svg`,
  },
  fruit_2: {
    path: `${import.meta.env.BASE_URL}ornaments/fruit_2.svg`,
  },
  pinecone_1: {
    path: `${import.meta.env.BASE_URL}ornaments/pinecone_1.svg`,
  },
  pinecone_2: {
    path: `${import.meta.env.BASE_URL}ornaments/pinecone_2.svg`,
  },
  poinsettia_1: {
    path: `${import.meta.env.BASE_URL}ornaments/poinsettia_1.svg`,
  },
  poinsettia_2: {
    path: `${import.meta.env.BASE_URL}ornaments/poinsettia_2.svg`,
  },
  ribbon: {
    path: `${import.meta.env.BASE_URL}ornaments/ribbon.svg`,
    rotation: 'pendulum',
  },
  star: {
    path: `${import.meta.env.BASE_URL}ornaments/star.svg`,
    rotation: 'none',
    scale: 0.5,
  },
}
