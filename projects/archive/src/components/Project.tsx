import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { ProjectData } from '../data/projects';

type ProjectProps = {
  project: ProjectData;
  isActive: boolean;
  setSelectedId: (id: number) => void;
};
export default function Project({
  project: { id, title, description, thumbnailSrc, videoSrc, url },
  isActive,
  setSelectedId,
}: ProjectProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isActive && isHovered) {
      if (videoRef.current) videoRef.current.play();
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive, isHovered]);

  return (
    <Container>
      <VideoWrapper
        onMouseEnter={() => {
          setSelectedId(id);
          setIsHovered(true);
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Video ref={videoRef} src={videoSrc} muted />
        <Thumbnail
          $isSelected={isActive}
          src={thumbnailSrc}
          onClick={() => navigate(url)}
        />
        <Dim $isDimmed={!isActive} />
      </VideoWrapper>
      {isActive && (
        <Information>
          <Description>{description}</Description>
          <Title onClick={() => navigate(url)}>
            {title} <Dot />
          </Title>
        </Information>
      )}
    </Container>
  );
}

const Container = styled.section`
  display: flex;
  height: 100%;
  width: calc(100vw * 125 / 189);
  flex-direction: column-reverse;
  align-items: flex-end;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: calc(100vw * 125 / 189);
  aspect-ratio: 3 / 2;
  background-color: #000;
  margin-top: 26px;
  overflow: hidden;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
`;

const Thumbnail = styled.img<{ $isSelected: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  background-color: black;
  object-fit: cover;
  opacity: ${({ $isSelected }) => ($isSelected ? 0 : 1)};
  transition: opacity 0.5s;
  cursor: pointer;
`;

const Information = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-left: 36px;
  padding-right: 16px;
`;

const Title = styled.h1`
  font-size: 30px;
  font-weight: 400;
  display: flex;
  gap: 12.5px;

  cursor: pointer;
  transition: 0.1s;
  &:hover {
    opacity: 0.7;
  }
`;

const Dot = styled.div`
  width: 28px;
  height: 28px;
  background-color: #000;
  border-radius: 50%;
`;

const Description = styled.div`
  align-self: flex-end;
  font-size: 12px;
  line-height: 18px;
  white-space: pre-wrap;
`;

const Dim = styled.div<{ $isDimmed: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: ${({ $isDimmed }) => ($isDimmed ? 1 : 0)};
  transition: opacity 0.5s;
  pointer-events: none;
`;
