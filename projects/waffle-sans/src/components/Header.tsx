import styled from 'styled-components';

import LogoIcon from '../icons/Logo';

export default function Header() {
  return (
    <Container>
      <LogoIcon />
      <CopyWriter>
        <Text>
          {'interactive study from waffle studio\nmade with Leon Sans'}
        </Text>
        <Text>{'ⓒ2019.Jongmin Kim. all rights reserved.'}</Text>
      </CopyWriter>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 40px 0 0 48px;
  box-sizing: border-box;
  gap: 44px;
`;

const CopyWriter = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 11px;
`;

const Text = styled.h6`
  display: flex;
  align-items: center;
  color: #2e3a2c;
  font-family: Inter;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  white-space: pre-wrap;
`;
