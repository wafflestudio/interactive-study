import { Link } from 'react-router-dom';
import { styled } from 'styled-components';

import { MemberData } from '../data/members';

type MemberProps = {
  member: MemberData;
};

export default function Member({ member }: MemberProps) {
  return (
    <Container>
      <Thumbnail src={member.thumbnailSrc} />

      <Information>
        {member.webiste ? (
          <ClickableName to={member.webiste} target="_blank">
            {member.name}
          </ClickableName>
        ) : (
          <Name>{member.name}</Name>
        )}
        <Email>email / {member.email}</Email>
        <Github to={member.githubUrl} target="_black">
          github / {member.github}
        </Github>
      </Information>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  gap: 28px;
`;

const Thumbnail = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  object-position: center;
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Name = styled.div`
  font-size: 14px;
`;

const Email = styled.div`
  font-size: 13px;
`;

const ClickableName = styled(Link)`
  color: #000;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.1s;
  font-size: 13px;
  &:hover {
    opacity: 0.7;
  }
`;

const Github = styled(Link)`
  color: #000;
  font-size: 13px;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
