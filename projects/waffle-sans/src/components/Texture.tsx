import styled from 'styled-components';

export default function Texture() {
  return (
    <Container>
      <Blend src={'/texture_default.png'} />
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

const Blend = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  mix-blend-mode: multiply;
`;
