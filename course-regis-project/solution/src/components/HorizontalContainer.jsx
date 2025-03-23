import styled from 'styled-components';

const HorizontalContainer = styled.div`
  display: flex;
  gap: ${(props) => props.gap || '0px'};
  align-items: center;
  width: ${(props) => props.width || '100%'};
`;

const Horizontal = ({ children, gap, width, ...props }) => {
  return (
    <HorizontalContainer width={width} gap={gap} {...props}>
      {children}
    </HorizontalContainer>
  );
};

export default Horizontal;
