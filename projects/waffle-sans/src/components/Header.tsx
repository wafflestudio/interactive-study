import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { GRID } from '../constants/breakpoint';
import LogoIcon from './Logo';

enum Mode {
  LIGHT = 'light',
  DARK = 'dark',
}

interface Props {
  mode?: 'light' | 'dark';
}

export default function Header({ mode = Mode.LIGHT }: Props) {
  const router = useNavigate();

  return (
    <Container>
      <Logo onClick={() => router('/')}>
        <LogoIcon
          width={'100%'}
          height={'100%'}
          color={mode === Mode.LIGHT ? '#2E3A2C' : '#ffffff'}
        />
      </Logo>

      <CopyWriter>
        <Text $mode={mode}>
          {'interactive study from waffle studio\nmade with Leon Sans'}
        </Text>
        <Text $mode={mode}>{'ⓒ2019.Jongmin Kim. all rights reserved.'}</Text>
      </CopyWriter>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  width: 100%;
  padding: 40px 0 0 48px;
  box-sizing: border-box;
  gap: 44px;

  @media ${GRID.MOBILE} {
    justify-content: center;
    padding: 60px 0 0;
  }
`;

const Logo = styled.button`
  width: 99px;
  height: 53px;
  border: none;
  background-color: transparent;

  @media ${GRID.MOBILE} {
    width: 99px;
    height: 53px;
  }
`;

const CopyWriter = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 11px;

  @media ${GRID.MOBILE} {
    display: none;
  }
`;

const Text = styled.h6<{ $mode: 'light' | 'dark' }>`
  display: flex;
  align-items: center;
  color: ${({ $mode }) => ($mode === Mode.LIGHT ? '#2E3A2C' : '#ffffff')};
  font-family: Inter;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  white-space: pre-wrap;
`;
