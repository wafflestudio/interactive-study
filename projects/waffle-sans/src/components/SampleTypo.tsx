import styled from 'styled-components';

interface Props {
  imgSize?: number;
}

export default function SampleTypo({ imgSize = 280 }: Props) {
  const images = ['/sample_typo.png', '/sample_typo.png', '/sample_typo.png'];

  return (
    <Container>
      {images.map((url, index) => (
        <Image key={index} src={url} alt="waffle sans" imgSize={imgSize} />
      ))}
    </Container>
  );
}

/* STYLES */
const Container = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  width: auto;
  height: auto;
`;

const Image = styled.img<{ imgSize: number }>`
  width: ${({ imgSize }) => imgSize}px;
  height: auto;
`;
