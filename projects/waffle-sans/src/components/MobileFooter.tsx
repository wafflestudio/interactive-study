import styled from 'styled-components';

import LogoIcon from './Logo';

export default function MobileFooter() {
  return (
    <Container>
      <LogoIcon color="#f1f6f6" />
      <Text>
        {
          'interactive study from waffle studio\nmade with Leon Sans\nⓒ2019.Jongmin Kim.all righ- ts reserved.'
        }
      </Text>
    </Container>
  );
}

const Container = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Text = styled.h6`
  display: flex;
  align-items: center;
  color: #f1f6f6;
  text-align: center;
  font-family: Inter;
  font-size: 8px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  white-space: pre-wrap;
`;
