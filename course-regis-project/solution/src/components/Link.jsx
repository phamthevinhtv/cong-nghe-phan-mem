import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LinkStyled = styled.a`
  color: ${(props) => props.color};
  text-decoration: ${(props) => props.underline ? 'underline' : 'none'};
  cursor: pointer;

  &:hover {
    text-decoration: ${(props) => props.hoverUnderline ? 'underline' : 'none'};
    color: ${(props) => props.hoverColor};
  }
`;

const Link = ({ children, to, color, hoverColor, hoverUnderline, underline, ...props }) => {
  const navigate = useNavigate();
  return (
    <LinkStyled color={color} hoverColor={hoverColor} hoverUnderline={hoverUnderline} underline={underline} onClick={() => navigate(to)} {...props}>
      {children}
    </LinkStyled>
  );
};

export default Link;
