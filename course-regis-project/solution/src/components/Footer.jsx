import styled from 'styled-components';

const Wrapper = styled.div`
    background-color: #000028;
    padding: 24px;
`;

const Copyright = styled.p`
    color: var(--white-color);
    text-align: center;
    cursor: default;
`;

const Footer = () => {
  return (
    <Wrapper>
        <Copyright>&copy; Copyright 2025 DoubleV</Copyright>
    </Wrapper>
  );
};

export default Footer;
