export type MemberData = {
  id: number;
  thumbnailSrc: string;
  name: string;
  email: string;
  github: string;
  githubUrl: string;
  webiste?: string;
};

const developerData: MemberData[] = [
  {
    id: 0,
    thumbnailSrc: `${import.meta.env.BASE_URL}minkyu.png`,
    name: '이민규',
    email: 'whizkyu@snu.ac.kr',
    github: 'minkyu97',
    githubUrl: 'https://github.com/minkyu97',
  },
  {
    id: 1,
    thumbnailSrc: `${import.meta.env.BASE_URL}yeji.jpeg`,
    name: '김예지',
    email: 'kyewl97@snu.ac.kr',
    github: 'lerrybe',
    githubUrl: 'https://github.com/lerrybe',
  },
  {
    id: 2,
    thumbnailSrc: `${import.meta.env.BASE_URL}junyoung.png`,
    name: '박준영',
    email: 'kidbean02@snu.ac.kr',
    github: 'designDefined',
    githubUrl: 'https://github.com/designDefined',
  },
  {
    id: 6,
    thumbnailSrc: `${import.meta.env.BASE_URL}hyeonji.jpeg`,
    name: '신현지',
    email: 'hyeonji.shn@gmail.com',
    github: 'nyanxyz',
    githubUrl: 'https://github.com/nyanxyz',
  },
  {
    id: 7,
    thumbnailSrc: `${import.meta.env.BASE_URL}seongyeol.jpeg`,
    name: '이성열',
    email: 'yeolyi1310@gmail.com',
    github: 'yeolyi',
    githubUrl: 'https://github.com/yeolyi',
  },
  {
    id: 8,
    thumbnailSrc: `${import.meta.env.BASE_URL}changin.png`,
    name: '백창인',
    email: 'nuagenic@gmail.com',
    github: 'nuagenic',
    githubUrl: 'https://github.com/nuagenic',
  },
];

const designerData: MemberData[] = [
  {
    id: 3,
    thumbnailSrc: `${import.meta.env.BASE_URL}chaewon.jpeg`,
    name: '유채원',
    email: 'kidbean02@snu.ac.kr',
    github: 'coco-ball',
    githubUrl: 'https://github.com/coco-ball',
  },
  {
    id: 4,
    thumbnailSrc: `${import.meta.env.BASE_URL}seoi.png`,
    name: '최서이',
    email: 'ssechho@snu.ac.kr',
    github: 'ssechho',
    githubUrl: 'https://github.com/ssechho',
    webiste: 'https://ssechho.com',
  },
  {
    id: 5,
    thumbnailSrc: `${import.meta.env.BASE_URL}pia.jpeg`,
    name: '전비아',
    email: 'piachun@snu.ac.kr',
    github: 'piachun',
    githubUrl: 'https://github.com/piachun',
  },
];

const memberData = {
  developer: developerData,
  designer: designerData,
};

export default memberData;
