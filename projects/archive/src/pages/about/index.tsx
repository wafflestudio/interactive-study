import styled from 'styled-components';

import { LATIN } from '../../../../../libs/leonsans/src/font/latin';
import Member from '../../components/Member';
import memberData from '../../data/members';

export default function About() {
  return (
    <Container>
      <Introduction>
        <Description>
          인터랙티브 스터디는 웹 인터랙션의 가능성을 탐구하는 스터디입니다.
          <br />
          서울대학교 컴퓨터공학부 웹 개발 동아리 와플 스튜디오 소속의 스터디로,
          개발자 3명, 디자이너 3명으로 구성되어있습니다.
          <br />
          <br />
          우리는 인터랙션이란 무엇인지 정의하는 것에서부터 출발하여, 웹페이지를
          스케치북 삼아 단순한 UX·UI 그 이상의 새로운 경험을 그려냅니다.
          <br />
          매주 레퍼런스를 기술적, 심미적으로 분석하고 이를 응용한 인터랙티브
          웹을 개발하는 프로젝트를 진행합니다.
        </Description>
        <Organizations>
          <img src="/SNU.png" />
          <img src="/WAFFLE.png" />
        </Organizations>
      </Introduction>
      <Members>
        <LabeledList>
          <Label>Developer</Label>
          <List>
            {memberData.developer.map((member) => (
              <Member member={member} />
            ))}
          </List>
        </LabeledList>
        <LabeledList>
          <Label>Designer</Label>
          <List>
            {memberData.designer.map((member) => (
              <Member member={member} />
            ))}
          </List>
        </LabeledList>
      </Members>
    </Container>
  );
}

const Container = styled.article`
  position: relative;
  height: 100%;
  flex: 1;

  display: flex;
  justify-content: space-between;
  gap: 40px;
  padding: 27vh 12vw;

  font-family: 'Noto Sans KR', sans-serif;
`;

const Introduction = styled.div`
  width: 382px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  padding-top: 45px;
`;

const Description = styled.div`
  font-size: 12px;
  line-height: 20px;
`;

const Organizations = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Members = styled.div`
  display: flex;
  width: 40vw;
  gap: 20px;
  justify-content: space-between;
`;
const LabeledList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex-shrink: 0;
`;
const List = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const Label = styled.div`
  font-size: 18px;
  font-family: Helvetica, 'Noto Sans KR', sans-serif;
`;
