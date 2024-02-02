import styled from 'styled-components';

import useWreathSans from '../hooks/useWreathSans';

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
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 0.55;
  box-sizing: border-box;

  padding: 45px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;

  background-size: 300%;
  background-position: right;
  background-image: url('/background_outside.png');
  box-shadow: 0 6px 6px 0 rgba(0, 0, 0, 0.15);
`;

const SansWrapper = styled.div`
  width: 100%;
`;

const MainText = styled.div`
  color: #315c57;

  width: 100%;
  height: 208px;
  flex-shrink: 0;
  overflow-y: auto;

  margin-top: 60px;

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
