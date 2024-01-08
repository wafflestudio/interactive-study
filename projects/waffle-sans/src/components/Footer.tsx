import styled from 'styled-components';

export default function Footer() {
  return (
    <Container>
      <Text>
        {
          'interactive study from waffle studio made with Leon Sans\nⓒ2019.Jongmin Kim. all rights reserved.'
        }
      </Text>
    </Container>
  );
}

/* STYLES */
const Container = styled.div`
  display: flex;
  position: fixed;
  align-items: center;
  justify-content: center;
  left: 0;
  bottom: 30px;
  width: 100%;
`;

const Text = styled.span`
  white-space: pre-wrap;
  color: #93afae;
  text-align: center;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: normal;
`;
