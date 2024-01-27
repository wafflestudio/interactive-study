import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import styled from 'styled-components';

import createWreathSans from '../../../../libs/leon-sans-react/src/hooks/createWreathSans';
import { sansInputState } from '../store/sans';
import Button from './Button';
import Textarea from './Textarea';

export default function SansForm() {
  const router = useNavigate();
  const [value, setValue] = useRecoilState(sansInputState);
  const { WreathSansCanvas, onInputHandler, resize } = createWreathSans({
    initialText: '',
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (e.target.value.length > 50) return;
      setValue(e.target.value);
    },
    [setValue],
  );

  useEffect(() => {
    function handleResize() {
      resize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [resize]);

  return (
    <Container>
      <SansContainer>{/* <WreathSansCanvas /> */}</SansContainer>

      <Textarea
        name="sans"
        width="635px"
        value={value}
        threshold={50}
        handleChange={handleChange}
        placeholder="interactive study"
        handleInput={onInputHandler}
      />
      <ButtonContainer>
        <Button
          text={'SHARE'}
          color={'#FFFFFF'}
          hoveredColor="#E6F0F0"
          handleClick={() => router(`/post?msg=${value}`)}
          icon={<Icon src="/share.svg" alt="share" />}
        />
        <Button
          text={'WRITE'}
          color={'#D2E6E4'}
          hoveredColor="#BFDBD9"
          handleClick={() => {}}
          icon={<Icon src="/write.svg" alt="write" />}
        />
      </ButtonContainer>
    </Container>
  );
}

/* STYLES */
const Container = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-bottom: auto;
`;

const SansContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 65vh;
  max-height: calc(100vh - 320px);
  overflow: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  width: 100%;
`;

const Icon = styled.img`
  width: 16px;
  height: 16px;
`;
