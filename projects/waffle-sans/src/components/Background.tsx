import styled from 'styled-components';

export default function Background() {
  return (
    <Container>
      <Image />
      <FootPrint1 />
      <FootPrint2 />
    </Container>
  );
}

/* STYLES */
const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
`;

const Image = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-size: cover;
  background-position: center;
  background-image: url('/background_day.png');
`;

const FootPrint1 = styled.div`
  position: absolute;
  width: 360px;
  height: 143px;
  bottom: 0;
  left: 106px;
  background-size: cover;
  background-position: center;
  background-image: url('/foot_print_1.png');
`;

const FootPrint2 = styled.div`
  position: absolute;
  width: 98px;
  height: 105px;
  bottom: 97px;
  left: 10px;
  background-size: cover;
  background-position: center;
  background-image: url('/foot_print_2.png');
`;
