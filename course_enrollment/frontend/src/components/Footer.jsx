import styled from "styled-components";
import { Link } from "react-router-dom";
import LogoFacebook from "../assets/images/logo_facebook.png";
import LogoYoutube from "../assets/images/logo_youtube.png";
import LogoImg from "@/assets/images/logo.png";

const Wrapper = styled.footer`
  background-color: var(--color-dark-blue);
  color: var(--color-white);
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 24px 12px 12px 12px;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  gap: 24px;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const Child = styled.div`
  flex: 1;
`;

const ChildHeading = styled.h2`
  font-weight: 600;
  font-size: var(--font-size-medium);
  margin-bottom: 24px;
  cursor: default;
`;

const Logo = styled.img`
  height: 40px;
  width: auto;
  margin: -12px 0 16px 0;
`;

const InfoItem = styled.li`
  margin-bottom: 12px;
  cursor: default;
`;

const InfoLink = styled(InfoItem).attrs({ as: Link })`
  color: var(--text-color);
  display: block;
  cursor: pointer;
`;

const SocialList = styled.ul`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const SocialLogo = styled.img`
  height: 40px;
  width: auto;
`;

const FooterEnd = styled.div`
  width: 100%;
  max-width: 1200px;
  text-align: center;
  padding-top: 12px;
  margin-top: 12px;
  border-top: var(--border-white);
`;

function Footer() {
  return (
    <Wrapper>
      <Container>
        <Child>
          <Link to="/">
            <Logo src={LogoImg} alt="Logo" />
          </Link>
          <ul>
            <InfoItem>Địa chỉ: 123, Abc, Vĩnh Long</InfoItem>
            <InfoItem>Email: cskh@doublev.vn</InfoItem>
            <InfoItem style={{ marginBottom: "0px" }}>
              Số điện thoại: 0123456789
            </InfoItem>
          </ul>
        </Child>
        <Child>
          <ChildHeading>Về DoubleV</ChildHeading>
          <ul>
            <InfoLink>Giới thiệu</InfoLink>
            <InfoLink>Điều khoản sử dụng</InfoLink>
            <InfoLink style={{ marginBottom: "0" }}>
              Chính sách bảo mật
            </InfoLink>
          </ul>
        </Child>
        <Child>
          <ChildHeading>Mạng xã hội</ChildHeading>
          <SocialList>
            <li>
              <a href="#">
                <SocialLogo src={LogoFacebook} />
              </a>
            </li>
            <li>
              <a href="#">
                <SocialLogo src={LogoYoutube} />
              </a>
            </li>
          </SocialList>
        </Child>
      </Container>
      <FooterEnd>Copyright By &copy; DoubleV 2025</FooterEnd>
    </Wrapper>
  );
}

export default Footer;
