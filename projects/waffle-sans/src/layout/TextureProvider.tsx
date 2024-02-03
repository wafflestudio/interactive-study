import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
}
export const TextureProvider = ({ children }: Props) => {
  return (
    <Container>
      <Blend src={`${import.meta.env.BASE_URL}texture_default.jpg`} />
      {children}
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Blend = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  mix-blend-mode: multiply;
`;
