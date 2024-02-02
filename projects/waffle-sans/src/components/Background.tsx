import styled from 'styled-components';

import { GRID } from '../constants/breakpoint';
import { Mode } from '../types/mode';
import Texture from './Texture';

interface Props {
  mode?: Mode;
}

export default function Background({ mode = Mode.OUTSIDE }: Props) {
  return (
    <Container>
      <BackgroundImage $mode={mode}>
        <Texture />
        {mode === Mode.OUTSIDE && (
          <>
            <FootPrint1 />
            <FootPrint2 />
          </>
        )}
      </BackgroundImage>
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
  z-index: -2;
`;

const BackgroundImage = styled.div<{ $mode: Mode }>`
  width: 100%;
  height: 100%;
  position: relative;
  background-size: cover;
  background-position: center;
  background-image: url('/background_${({ $mode }) => $mode}.png');

  @media ${GRID.MOBILE} {
    background-image: url('/background_${({ $mode }) => $mode}_m_ver.png');
  }
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
