import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
}
export const TextureProvider = ({ children }: Props) => {
  return (
    <Container>
      <Blend src={'/texture_default.png'} />
      {children}
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
`;

const Blend = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  mix-blend-mode: multiply;
`;
