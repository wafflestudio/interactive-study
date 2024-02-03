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
    description: '디스크온 설명 설명\n디스크온 설명 설명',
    thumbnailSrc: '/disk-on_thumbnail.png',
    videoSrc: '/disk-on_video.mov',
    url: '/',
  },
  {
    id: 1,
    title: 'SPOT FAKE',
    description:
      'SPOT FAKE는 지폐의 틀린 그림을 찾는 게임입니다. 세가지 조명모드를 활용하여 ',
    thumbnailSrc: '/spot-fake_thumbnail.png',
    videoSrc: '/spot-fake_video.mp4',
    url: '/',
  },
  {
    id: 2,
    title: 'WAFFLE SANS',
    description: '와플 산스 설명 설명',
    thumbnailSrc: '/waffle-sans_thumbnail.png',
    videoSrc: '/waffle-sans_video.mp4',
    url: '/',
  },
];

export default projectData;
