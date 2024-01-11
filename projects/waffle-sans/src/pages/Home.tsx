import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import Button from '../components/Button';

export default function Home() {
  const router = useNavigate();

  return (
    <Container>
      <Background />

      <Button
        text={'편지쓰러가기 (임시)'}
        handleClick={() => router('/sans')}
      />
    </Container>
  );
}

/* STYLES */
const Container = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: center; // TODO
  align-items: center;
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding-bottom: 30px;
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-image: url('/background_home.png');
  z-index: -1;
`;

/**
 * 남은 TODO
 * 1. [x] 자잘한 인터랙션 (화면전환, 버튼 클릭)
 * 2. [ ] 반응형
 * 3. [ ] 링크 공유 기능
 * 4. [ ] waffle sans 붙이기
 * 5. [ ] 다크모드 전환
 * 6. [ ] 홈화면
 */
