import styled from 'styled-components';

const HorizontalContainer = styled.div`
  display: flex;
  gap: ${(props) => props.gap || '0px'};
  width: ${(props) => props.width || '100%'};
  margin: ${(props) => props.margin || '0px 0px 0px 0px'};
  justify-content: ${(props) => props.justifyContent || 'flex-start'};
  align-items: ${(props) => props.alignItem || 'center'};
`;

const Horizontal = ({ children, gap, width, margin, justifyContent, alignItem, ...props }) => {
  return (
    <HorizontalContainer width={width} alignItem={alignItem} justifyContent={justifyContent} margin={margin} gap={gap} {...props}>
      {children}
    </HorizontalContainer>
  );
};

export default Horizontal;
