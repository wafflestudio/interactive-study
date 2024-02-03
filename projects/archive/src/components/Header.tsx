import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

export default function Header() {
  const location = useLocation();

  const currentTab = useMemo(() => {
    if (location.pathname === '/about') return 'about';
    if (location.pathname === '/') return 'works';
    if (location.pathname === '/works') return 'works';
    return 'unknown';
  }, [location.pathname]);

  return (
    <Container>
      <Title>
        <Name>Interactive Study</Name>
        <From>from waffle studio</From>
      </Title>
      <Nav>
        <Tab to="works" $isSelected={currentTab === 'works'}>
          works
          {currentTab === 'works' && <TabUnderLine />}
        </Tab>
        <Tab to="about" $isSelected={currentTab === 'about'}>
          about us
          {currentTab === 'about' && <TabUnderLine />}
        </Tab>
      </Nav>
    </Container>
  );
}

const Container = styled.header`
  position: relative;
  flex: 0;

  padding: 23px;
  display: flex;
  align-items: center;
  gap: 45px;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Name = styled.h1`
  font-size: 22px;
  font-weight: 400;
`;

const From = styled.h2`
  font-size: 15px;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

const Tab = styled(Link)<{ $isSelected: boolean }>`
  position: relative;
  width: 80px;
  height: 32px;
  font-size: 15px;
  text-decoration: none;
  color: #000;
  border-radius: 50%;
  border: 1px solid #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${({ $isSelected }) =>
    !$isSelected &&
    `cursor: pointer; 
  `};
`;

const TabUnderLine = styled(UnderLine)`
  position: absolute;
  bottom: 0;
`;

function UnderLine({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="75"
      height="9"
      viewBox="0 0 75 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 7.5793C9.34575 7.5793 17.5707 6.04401 25.826 4.90198C33.2598 3.87358 40.7877 3.37872 48.2451 2.48158C53.1639 1.88985 58.0813 1.20481 63.0379 1.02123C65.9481 0.913447 68.8468 1.2511 71.7054 1.2511C72.1743 1.2511 74.3182 1.85238 74.5044 2.22467"
        stroke="black"
        strokeLinecap="round"
      />
    </svg>
  );
}
