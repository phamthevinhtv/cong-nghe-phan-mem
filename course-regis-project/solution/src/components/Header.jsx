import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import accountIcon from '../assets/images/account.svg';
import notifyIcon from '../assets/images/bell.svg';
import burgerIcon from '../assets/images/burger.svg';
import closeIcon from '../assets/images/close.svg';
import logo from '../assets/images/logo.png';
import Input from './Input';
import Link from './Link';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useUser } from '../App';

const Wrapper = styled.div`
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    background-color: var(--white-color);
    box-shadow: 0 0 5px 0 #c8c8c8;
    padding: 6px 24px;
`;

const Container = styled.div`
    width: 1200px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: auto;
`;

const Logo = styled.img`
    width: 100px;
    cursor: pointer;
`;

const NavContainer = styled.div`
    display: flex;
    align-items: center;

    @media (max-width: 768px) {
        display: none;
    }
`;

const Nav = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    padding: 6px 6px 6px 2px;
    margin-left: 12px;
    cursor: pointer;
    min-width: fit-content;

    &:hover {
        background-color: #f0f0f0;
        border-radius: 6px;
    }
`;

const NavIcon = styled.img`
    width: 24px;
`;

const NavText = styled.p`
    margin-left: 3px;
`;

const NotifyNum = styled.div`
    position: absolute;
    background-color: var(--danger-color);
    color: var(--white-color);
    padding: 0 2px;
    font-size: 1rem;
    border-radius: 2px;
    top: -2px;
    right: calc(100% - 12px);

    @media (max-width: 768px) {
        right: calc(100% - 16px);
    }
`;

const BurgerIcon = styled.img`
    margin-left: 12px;
    width: 40px;
    cursor: pointer;

    @media (min-width: 768.1111px) {
        display: none;
    }
`;

const BurgerMenu = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 300px;
    background-color: var(--white-color);
    transform: ${({ $isOpen }) => $isOpen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.1s linear;
    z-index: 11;
    padding: 15px 24px;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color:rgba(0, 0, 0, 0.3);
    z-index: 10;
`;

const BurgerMenuHeader = styled.div`
    display: flex;
    align-items: center;
    border-bottom: var(--border-normal);
    padding-bottom: 12px;
`;

const CloseIcon = styled.img`
    width: 40px;
    cursor: pointer;
    margin-left: auto;
`;

const BurgerMenuBody = styled.div`
    display: flex;
    margin-top: 12px;
    flex-direction: column;
    gap: 1px;
`;

const MenuLink = styled(Link)`
    display: block;
    padding: 8px;
    border-radius: 6px;
    background-color: ${({ $active }) => ($active ? '#f0f0f0' : 'transparent')};

    &:hover {
        background-color: #f0f0f0;
    }
`;

const NotifyNumMenu = styled.span`
    color: var(--danger-color);
`;

const NavBox = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    min-width: 100%;
    background-color: var(--white-color);
    box-shadow: 0 0 5px 0 #c8c8c8;
    padding: 12px;
    border-radius: 6px;
    cursor: default;
    z-index: 20;
`;

const NavBoxLink = styled(Link)`
    display: block;
    padding: 6px;
    border-radius: 6px;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const NotifyList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1px;
`;

const NotifyItem = styled(Link)`
    display: block;
    padding: 6px;
    border-radius: 6px;
    background-color:rgb(255, 240, 240);

    &:hover {
        background-color: #f0f0f0;
    }
`;

const Search = styled.div`
    display: flex;
    align-items: center;
    border: var(--border-normal);
    border-radius: 6px;
    flex: 1;
    margin: 0 12px 0 24px;
`;

const ClearIcon = styled.div`
    height: 100%;
    border-radius: 0 6px 6px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
        background-color: #f0f0f0;
    }

    img {
        transform: scale(0.6);
    }
`;

const Header = () => {
    const { sessionUser, setSessionUser } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [openNavBox, setOpenNavBox] = useState(null);
    const [searchValue, setSearchValue] = useState('');

    const notifyRef = useRef();
    const accountRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                openNavBox === 'notify' &&
                notifyRef.current &&
                !notifyRef.current.contains(event.target)
            ) {
                setOpenNavBox(null);
            }
            if (
                openNavBox === 'account' &&
                accountRef.current &&
                !accountRef.current.contains(event.target)
            ) {
                setOpenNavBox(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openNavBox]);

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
            toast.success(response.data.message, { position: 'top-right', autoClose: 3000 });
            setSessionUser(null);
        } catch (error) {
            console.log(error);
            
            toast.error(error.response?.data?.message || 'Lỗi máy chủ.', { position: 'top-right', autoClose: 3000 });
        } 
    }

    return (
        <Wrapper>
            <Container>
                <Logo src={logo} onClick={() => navigate('/home')} />
                <Search>
                    <Input style={{ border: 'none' }} placeholder='Tìm kiếm khóa học' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                    <ClearIcon onClick={() => setSearchValue('')}>
                        <img src={closeIcon} />
                    </ClearIcon>
                </Search>
                <NavContainer>
                    <div ref={notifyRef} style={{ position: 'relative' }}>
                        <Nav onClick={() => setOpenNavBox(openNavBox === 'notify' ? null : 'notify')}>
                            <NavIcon src={notifyIcon} />
                            <NavText>Thông báo</NavText>
                            <NotifyNum>3</NotifyNum>
                        </Nav>
                        {openNavBox === 'notify' && (
                            <NavBox style={{ minWidth: '400px' }}>
                                <p style={{
                                    textAlign: 'center',
                                    paddingBottom: '8px',
                                    borderBottom: 'var(--border-normal)'
                                }}>
                                    Thông báo mới nhất
                                </p>
                                <NotifyList>
                                    <NotifyItem>Khóa học sắp bắt đầu</NotifyItem>
                                    <NotifyItem>Khóa học sắp bắt đầu</NotifyItem>
                                    <NotifyItem>Khóa học sắp bắt đầu</NotifyItem>
                                </NotifyList>
                                <Link hoverColor='var(--primary-color)' style={{
                                    textAlign: 'center',
                                    borderTop: 'var(--border-normal)',
                                    borderRadius: '0 0 6px 6px',
                                    display: 'block',
                                    paddingTop: '8px'
                                }}>
                                    Xem tất cả
                                </Link>
                            </NavBox>
                        )}
                    </div>
                    <div ref={accountRef} style={{ position: 'relative' }}>
                        <Nav onClick={() => setOpenNavBox(openNavBox === 'account' ? null : 'account')}>
                            <NavIcon src={accountIcon} />
                            <NavText>{sessionUser?.userFullName}</NavText>
                        </Nav>
                        {openNavBox === 'account' && (
                            <NavBox>
                                <NavBoxLink to="/profile">Cá nhân</NavBoxLink>
                                <NavBoxLink onClick={handleLogout}>Đăng xuất</NavBoxLink>
                            </NavBox>
                        )}
                    </div>
                </NavContainer>
                <BurgerIcon src={burgerIcon} onClick={() => setMenuOpen(true)} />
            </Container>
            {menuOpen && <Overlay onClick={() => setMenuOpen(false)} />}
            <BurgerMenu $isOpen={menuOpen}>
                <BurgerMenuHeader>
                    <Logo style={{ width: '70px' }} src={logo} onClick={() => navigate('/home')} />
                    <CloseIcon src={closeIcon} onClick={() => setMenuOpen(false)} />
                </BurgerMenuHeader>
                <BurgerMenuBody>
                    <MenuLink to="/home" $active={location.pathname === '/home'}>Trang chủ</MenuLink>
                    <MenuLink to="/notifications" $active={location.pathname === '/notifications'}>
                        Thông báo <NotifyNumMenu>(3)</NotifyNumMenu>
                    </MenuLink>
                    <MenuLink to="/profile" $active={location.pathname === '/profile'}>Cá nhân</MenuLink>
                    <MenuLink onClick={handleLogout}>Đăng xuất</MenuLink>
                </BurgerMenuBody>
            </BurgerMenu>
        </Wrapper>
    );
};

export default Header;
