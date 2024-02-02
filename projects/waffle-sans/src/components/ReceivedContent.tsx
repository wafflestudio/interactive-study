import styled from 'styled-components';

import useWreathSans from '../hooks/useWreathSans';
import { LetterFooter } from './MobileFooter';

type Props = {
  sansContent: string;
  from: string;
};

export default function ReceivedContent({ sansContent, from }: Props) {
  const { ref, WreathSansCanvas } = useWreathSans({ initialText: sansContent });

  return (
    <Container>
      <SansWrapper ref={ref}>
        <WreathSansCanvas />
      </SansWrapper>
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
      <LetterFooter />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  top: 10px;
  width: 100%;
  aspect-ratio: 0.55;
  box-sizing: border-box;

  padding: 45px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3%;

  background-image: url('/background_outside_m_ver.png');
  background-size: cover;
  background-position: bottom center;
  box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.15);
`;

const SansWrapper = styled.div`
  width: 100%;
  height: 30%;
`;

const MainText = styled.div`
  color: #315c57;

  width: 100%;
  height: 30%;
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

  width: 100%;

  text-align: justify;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
`;
