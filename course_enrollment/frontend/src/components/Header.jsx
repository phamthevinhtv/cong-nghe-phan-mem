import styled from "styled-components";
import { Link } from "react-router-dom";
import ImgLogo from "@/assets/images/logo.png";
import { useState, useRef, useEffect } from "react";

const Wrapper = styled.div`
  background-color: var(--color-white);
  display: flex;
  justify-content: center;
  padding: 6px 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const Nav = styled.nav`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  img {
    height: 40px;
    width: auto;
  }
`;

const NavList = styled.ul`
  display: flex;
  align-items: center;
  gap: 24px;
  margin-left: 12px;

  @media (max-width: 320px) {
    gap: 12px;
  }
`;

const NavItem = styled.li`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 2px;

  &:hover {
    color: var(--color-primary);
  }

  ${({ $guest }) =>
    $guest &&
    `
    display: none;
  `}
`;

const NavLink = styled(NavItem).attrs({ as: Link })`
  color: var(--color-text-primary);
`;

const NavText = styled.p`
  @media (max-width: 576px) {
    display: none;
  }

  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NavButton = styled.button`
  background-color: var(--color-primary);
  color: var(--color-white);
  border: var(--color-primary);
  border-radius: var(--radius-normal);
  padding: 6px 12px;
  cursor: pointer;

  @media (max-width: 320px) {
    padding: 6px;
  }

  &:hover {
    opacity: 0.8;
  }

  &:active {
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  padding: 12px;
`;

const NotifyBox = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
  height: fit-content;
  background-color: var(--color-white);
  padding: 12px;
  border-radius: var(--radius-medium);
  overflow: auto;
`;

const NotifyBoxClose = styled.span`
  font-size: 2.4rem !important;
  position: absolute;
  right: 6px;
  top: 6px;
  cursor: pointer;

  &:hover {
    color: var(--color-primary);
  }
`;

const NotifyBoxHeading = styled.h2`
  font-size: var(--font-size-medium);
  font-weight: 500;
  text-align: center;
  border-bottom: var(--border-normal);
  padding-bottom: 12px;
`;

const NotifyBoxList = styled.ul`
  overflow-y: auto;
  max-height: 480px;
  margin-top: -1px;
`;

const NotifyBoxItem = styled.li`
  padding: 6px;
  background-color: var(--color-gray-light);
  margin-top: 1px;
  cursor: default;
  white-space: normal;
  word-break: break-word;

  &:hover {
    background-color: var(--color-gray-light);
  }

  h4 {
    font-weight: 500;
  }

  p {
    margin-top: 6px;
    color: var(--color-text-secondary);
    font-size: var(--font-size-small);
  }
`;

const AccountBox = styled.div`
  position: absolute;
  color: var(--color-text-primary);
  right: 0;
  top: calc(100% + 6px);
  min-width: fit-content;
  background-color: var(--color-white);
  padding: 6px;
  border-radius: var(--radius-normal);
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
  border: var(--border-gray-light);
  z-index: 10;

  li {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px;
    cursor: pointer;
    white-space: nowrap;
    font-size: var(--font-size-small);

    &:hover {
      color: var(--color-primary);
    }
  }

  a {
    color: var(--color-text-primary);
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
      color: var(--color-primary);
    }
  }

  span {
    font-size: var(--font-size-large);
  }
`;

function Header() {
  const [showNotify, setShowNotify] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const notifyBoxRef = useRef(null);
  const accountBoxRef = useRef(null);
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const [notifyList, setNotifyList] = useState([]);
  const fetchNotifyList = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/course", {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      const data = await res.json();
      const courses = data.courses || [];
      const now = new Date();
      const oneDayMs = 24 * 60 * 60 * 1000;
      let notifyArr = [];
      const isStudent = user?.userRole?.toLowerCase() === "student";
      courses.forEach((course) => {
        if (isStudent && !course.isEnrolled) return;
        if (!course.courseDate || !course.courseDuration) return;
        const startTime = course.courseDuration.split(" - ")[0];
        const dateStr = course.courseDate;
        const courseStart = new Date(`${dateStr}T${startTime}:00`);
        const diff = courseStart - now;
        if (diff > 0 && diff <= oneDayMs) {
          let formattedDate = dateStr;
          if (dateStr && dateStr.length === 10) {
            const [yyyy, mm, dd] = dateStr.split("-");
            formattedDate = `${dd}/${mm}/${yyyy}`;
          }
          notifyArr.push({
            title: "Khóa học sắp diễn ra",
            message: `${course.courseName} sẽ diễn ra vào ${startTime} ngày ${formattedDate}`,
          });
        }
      });
      setNotifyList(notifyArr);
    } catch (err) {
      setNotifyList([]);
    }
  };

  useEffect(() => {
    fetchNotifyList();
  }, [user]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  const handleOverlayClick = (e) => {
    if (notifyBoxRef.current && !notifyBoxRef.current.contains(e.target)) {
      setShowNotify(false);
    }
  };

  const handleAccountBlur = (e) => {
    if (
      accountBoxRef.current &&
      !accountBoxRef.current.contains(e.relatedTarget) &&
      !accountBoxRef.current.contains(e.target)
    ) {
      setShowAccount(false);
    }
  };

  useEffect(() => {
    if (!showAccount) return;
    const handleClick = (e) => {
      if (
        accountBoxRef.current &&
        !accountBoxRef.current.contains(e.target) &&
        !e.target.closest(".account-nav-item")
      ) {
        setShowAccount(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showAccount]);

  const isLoggedIn = !!user;
  return (
    <Wrapper>
      <Nav>
        <Logo to="/">
          <img src={ImgLogo} alt="Logo image" />
        </Logo>
        <NavList>
          <NavLink $guest={!isLoggedIn} to="/">
            <span className="material-symbols-outlined">home</span>
            <NavText>Trang chủ</NavText>
          </NavLink>
          {isLoggedIn && (
            <>
              <NavItem
                $guest={false}
                onClick={async () => {
                  setShowAccount(false);
                  await fetchNotifyList();
                  setShowNotify(true);
                }}
              >
                <span className="material-symbols-outlined">
                  {notifyList.length > 0
                    ? "notifications_unread"
                    : "notifications"}
                </span>
                <NavText>Thông báo</NavText>
              </NavItem>
              <NavItem
                $guest={false}
                className={
                  showAccount ? "account-nav-item active" : "account-nav-item"
                }
                style={showAccount ? { color: "var(--color-primary)" } : {}}
                tabIndex={0}
                onClick={() => {
                  setShowAccount((v) => !v);
                  setShowNotify(false);
                }}
                onBlur={handleAccountBlur}
              >
                <span className="material-symbols-outlined">
                  account_circle
                </span>
                <NavText>
                  {user.userFullName || user.userName || "Tên của bạn"}
                </NavText>
                {showAccount && (
                  <AccountBox ref={accountBoxRef} tabIndex={-1}>
                    <ul>
                      <li>
                        <Link to="/personal">
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "18px" }}
                          >
                            person
                          </span>
                          Cá nhân
                        </Link>
                      </li>
                      <li
                        onClick={handleLogout}
                        tabIndex={0}
                        style={{ cursor: "pointer" }}
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: "18px" }}
                        >
                          logout
                        </span>
                        Đăng xuất
                      </li>
                    </ul>
                  </AccountBox>
                )}
              </NavItem>
            </>
          )}
          {!isLoggedIn && (
            <>
              <NavLink to="/login">Đăng nhập</NavLink>
              <NavLink to="/register">
                <NavButton>Đăng ký</NavButton>
              </NavLink>
            </>
          )}
        </NavList>
      </Nav>
      {showNotify && (
        <Overlay onClick={handleOverlayClick}>
          <NotifyBox ref={notifyBoxRef} onClick={(e) => e.stopPropagation()}>
            <NotifyBoxClose
              className="material-symbols-outlined"
              onClick={() => setShowNotify(false)}
            >
              close
            </NotifyBoxClose>
            <NotifyBoxHeading>Thông báo</NotifyBoxHeading>
            <NotifyBoxList>
              {notifyList.length === 0 ? (
                <NotifyBoxItem>
                  <p
                    style={{
                      textAlign: "center",
                      margin: "4px 0",
                    }}
                  >
                    Không có thông báo
                  </p>
                </NotifyBoxItem>
              ) : (
                notifyList.map((item, idx) => (
                  <NotifyBoxItem key={idx}>
                    <h4>{item.title}</h4>
                    <p>{item.message}</p>
                  </NotifyBoxItem>
                ))
              )}
            </NotifyBoxList>
          </NotifyBox>
        </Overlay>
      )}
    </Wrapper>
  );
}

export default Header;
