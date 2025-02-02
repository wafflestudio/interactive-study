export type ProjectData = {
  id: number;
  title: string;
  description: string;
  thumbnailSrc: string;
  videoSrc: string;
  url: string;
};

const projectData: ProjectData[] = [
  {
    id: 0,
    title: 'DISK ON',
    description:
      '마우스를 이용해 화면 속의 CD 인터랙티브를 즐겨보세요!\n진짜 CD처럼 보이겠지만, 마음껏 다뤄도 절대 깨지지 않아요.',
    thumbnailSrc: `${import.meta.env.BASE_URL}disk-on_thumbnail.png`,
    videoSrc: `${import.meta.env.BASE_URL}disk-on_video.mov`,
    url: 'https://interactive-study.wafflestudio.com/projects/disk-on/',
  },
  {
    id: 1,
    title: 'SPOT FAKE',
    description:
      'SPOT FAKE는 지폐의 틀린 그림을 찾는 게임입니다. 세가지 조명모드를 활용하여\n 지폐를 샅샅이 살펴보고, 위조 지폐를 가려내세요! ',
    thumbnailSrc: `${import.meta.env.BASE_URL}spot-fake_thumbnail.png`,
    videoSrc: `${import.meta.env.BASE_URL}spot-fake_video.mp4`,
    url: 'https://interactive-study.wafflestudio.com/projects/paper/',
  },
  {
    id: 2,
    title: 'WAFFLE SANS',
    description: '와플 산스로\n당신만의 크리스마스 편지를 보내보세요!',
    thumbnailSrc: `${import.meta.env.BASE_URL}waffle-sans_thumbnail.png`,
    videoSrc: `${import.meta.env.BASE_URL}waffle-sans_video.mp4`,
    url: 'https://interactive-study.wafflestudio.com/projects/waffle-sans/',
  },
  {
    id: 3,
    title: "FIND WAFFLE",
    description: '나는 어디 여긴 누구..\n4가지 와플 찾기 게임을 통해 3D 웹사이트를 구경해보세요!',
    thumbnailSrc: `${import.meta.env.BASE_URL}find-waffle_thumbnail.png`,
    videoSrc: `${import.meta.env.BASE_URL}find-waffle_video.mov`,
    url: 'https://interactive-study.wafflestudio.com/projects/find-waffle/',
  }
];

export default projectData;
