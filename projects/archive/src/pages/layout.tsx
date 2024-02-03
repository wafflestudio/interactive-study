import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Header from '../components/Header';

export default function DefaultLayout() {
  return (
    <Main>
      <Header />
      <Outlet />
    </Main>
  );
}

const Main = styled.main`
  position: relative;
  width: 100vw;
  min-height: 100vh;
  overflow: hidden;
  font-family: Helvetica, sans-serif;
  display: flex;
  flex-direction: column;
`;
