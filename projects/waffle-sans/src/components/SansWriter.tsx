import { useCallback, useState } from 'react';
import styled from 'styled-components';

import Button from './Button';

export default function SansWriter() {
  const [value, setValue] = useState('');

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (e.target.value.length > 50) return;
      setValue(e.target.value);
    },
    [],
  );

  return (
    <Container>
      <TextareaContainer>
        <Textarea
          value={value}
          onChange={handleChange}
          placeholder="interactive study"
        />
        <TextCount>{`${value?.length}/50`}</TextCount>
      </TextareaContainer>

      <ButtonContainer>
        <Button
          text={'SHARE'}
          color={'#FFFFFF'}
          handleClick={() => {}}
          hoveredColor="#E6F0F0"
          icon={<Icon src="/share.svg" alt="share" />}
        ></Button>
        <Button
          text={'WRITE'}
          color={'#D2E6E4'}
          handleClick={() => {}}
          hoveredColor="#BFDBD9"
          icon={<Icon src="/write.svg" alt="write" />}
        ></Button>
      </ButtonContainer>
    </Container>
  );
}

/* STYLES */
const Container = styled.div`
  display: flex;
  width: 651px;
  gap: 16px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  bottom: 124px;
  padding: 8px;
`;

const TextareaContainer = styled.div`
  position: relative;
  width: 635px;
  height: 88px;
`;

const Textarea = styled.textarea`
  resize: none;
  width: 635px;
  height: 88px;
  padding: 5px 8px 20px 8px;
  flex-direction: column;
  border: none;
  border-radius: 2px;
  box-sizing: border-box;
  background: #fff;
  color: #2e3a2c;
  font-family: Inter, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  outline: none;

  &:placeholder {
    color: #93afae;
  }
  &:focus {
    outline: none;
  }
`;

const TextCount = styled.div`
  position: absolute;
  right: 8px;
  bottom: 5px;
  color: #718f8d;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  background: #fff;
  border-radius: 6px;
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
