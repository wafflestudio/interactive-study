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
        <Name>{member.name}</Name>
        <Text>email / {member.email}</Text>
        <Text>github / {member.github}</Text>
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
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Name = styled.div`
  font-size: 14px;
`;

const Text = styled.div`
  font-size: 13px;
`;
