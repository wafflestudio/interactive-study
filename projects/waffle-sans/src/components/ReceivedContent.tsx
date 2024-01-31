import createWreathSans from 'leon-sans-react/src/hooks/createWreathSans';
import { useEffect } from 'react';
import styled from 'styled-components';

type Props = {
  sansContent: string;
  from: string;
};

export default function ReceivedContent({ sansContent, from }: Props) {
  const { WreathSansCanvas, resize } = createWreathSans({
    initialText: sansContent,
    width: window.innerWidth - 100,
    height: 200,
    size: 40,
    color: '#704234',
    background: 'transparent',
  });

  useEffect(() => {
    function handleResize() {
      resize(window.innerWidth, (window.innerHeight / 100) * 62);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [resize]);

  return (
    <Container>
      <WreathSansCanvas />
      <MainText>
        메리 크리스마스 <br />
        즐거운 성탄절 보내세요 하하. 메리 크리스마스 즐거운 성탄절 보내세요
        하하. <br />
        메리 크리스마스 즐거운 성탄절 보내세요 하하. 메리 크리스마스 즐거운
        성탄절 보내세요 하하. <br />
        메리 크리스마스 즐거운 성탄절 보내세요 하하. <br />
        메리 크리스마스 즐거운 성탄절 보내세요 하하.
      </MainText>
      <From>From. {from}</From>
    </Container>
  );
}

const Container = styled.div`
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  aspect-ratio: 0.55;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  background-size: 300%;
  background-position: right;
  background-image: url('/background_outside.png');
`;

const MainText = styled.div`
  color: #315c57;

  width: 60%;
  height: 208px;
  flex-shrink: 0;
  overflow-y: auto;

  text-align: justify;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`;

const From = styled.div`
  color: #315c57;

  width: 60%;

  text-align: justify;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`;
