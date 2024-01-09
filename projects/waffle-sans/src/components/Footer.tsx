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
  align-items: center;
  justify-content: center;
  width: 100%;
  height: auto;
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
