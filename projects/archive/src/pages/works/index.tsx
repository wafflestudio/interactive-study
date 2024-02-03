import { useState } from 'react';
import styled from 'styled-components';

import Project from '../../components/Project';
import projectData from '../../data/projects';

export default function Works() {
  const [selectedId, setSelectedId] = useState(0);

  return (
    <Container>
      {projectData.map((project) => (
        <ProjectWrapper
          key={project.id}
          $isSelected={selectedId === project.id}
        >
          <Project
            project={project}
            isActive={selectedId === project.id}
            setSelectedId={setSelectedId}
          />
        </ProjectWrapper>
      ))}
    </Container>
  );
}

const Container = styled.article`
  position: relative;
  height: 100%;
  flex: 1;

  display: flex;
  justify-content: space-between;
`;

const ProjectWrapper = styled.div<{ $isSelected: boolean }>`
  display: flex;
  justify-content: center;
  width: ${({ $isSelected }) =>
    $isSelected ? `calc(100vw * 125 / 189)` : `calc(100% * 25 / 189);`};
  overflow: hidden;
  transition: width 0.5s;
`;
