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
    thumbnailSrc: '/disk-on_thumbnail.png',
    videoSrc: '/disk-on_video.mov',
    url: 'https://interactive-study.wafflestudio.com/projects/paper/',
  },
  {
    id: 1,
    title: 'SPOT FAKE',
    description:
      'SPOT FAKE는 지폐의 틀린 그림을 찾는 게임입니다. 세가지 조명모드를 활용하여\n 지폐를 샅샅이 살펴보고, 위조 지폐를 가려내세요! ',
    thumbnailSrc: '/spot-fake_thumbnail.png',
    videoSrc: '/spot-fake_video.mp4',
    url: 'https://interactive-study.wafflestudio.com/projects/disk-on/',
  },
  {
    id: 2,
    title: 'WAFFLE SANS',
    description: '와플 산스 설명 설명',
    thumbnailSrc: '/waffle-sans_thumbnail.png',
    videoSrc: '/waffle-sans_video.mp4',
    url: 'https://interactive-study.wafflestudio.com/projects/waffle-sans/',
  },
];

export default projectData;
