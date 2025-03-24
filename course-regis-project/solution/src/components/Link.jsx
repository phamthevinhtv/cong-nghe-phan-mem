import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Link = styled.a`
  color: ${(props) => props.color || 'var(--primary-color)'};
  text-decoration: ${(props) => props.underline ? 'underline' : 'none'};
  cursor: pointer;

  &:hover {
    text-decoration: ${(props) => props.hoverUnderline ? 'underline' : 'none'};
  }
`;

const Input = ({ to, color, hoverUnderline, underline, ...props }) => {
    const navigate = useNavigate();
    return (
    <Link color={color} hoverUnderline={hoverUnderline} underline={underline} onClick={() => navigate(to)} {...props}/>
  );
};

export default Input;
