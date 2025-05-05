import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Button from '../components/Button';
import Input from '../components/Input';
import Label from '../components/Label';
import Link from '../components/Link';
import { useUser } from '../App';
import emptyInputWarning from '../utils/emtyInputWarning';

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  padding: 24px;
`;

const Container = styled.div`
  border: var(--border-normal);
  width: 400px;
  margin: auto;
  border-radius: 24px;
  padding: 24px;
`;

const H2 = styled.h2`
  text-align: center;
  font-size: 2.4rem;
  margin-bottom: 24px;
  font-weight: 500;
`;

const LabelQuestion = styled(Label)`
  @media (max-width: 346px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 2px;
  }
`;

const Login = () => {
  const { setSessionUser } = useUser();
  const [form, setForm] = useState({
    userEmail: '',
    userPassword: '',
  });

  const [waitLogin, setWaitLogin] = useState(false); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedForm = {
      ...form,
      userEmail: form.userEmail.trim(),
      userPassword: form.userPassword.trim(),
    };
    const emptyFields = Object.entries(trimmedForm)
    .filter(([key, value]) => !value)
    .map(([key]) => key);
    if (emptyFields.length > 0) {
      emptyFields.forEach((field) => {
        emptyInputWarning(field);
      });
      toast.warning('Vui lòng nhập đầy đủ thông tin.', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedForm.userEmail)) {
      emptyInputWarning('userEmail');
      toast.warning('Email không hợp lệ.', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (trimmedForm.userPassword.length < 6) {
      emptyInputWarning('userPassword');
      toast.warning('Mật khẩu phải có ít nhất 6 ký tự.', { position: 'top-right', autoClose: 3000 });
      return;
    }
    setWaitLogin(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', trimmedForm, { withCredentials: true });
      toast.success(response.data.message, { position: 'top-right', autoClose: 3000 });
      setSessionUser(response.data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi máy chủ.', { position: 'top-right', autoClose: 3000 });
    } finally {
      setWaitLogin(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <Wrapper>
      <Container>
        <form onSubmit={handleSubmit}>
          <H2>Đăng nhập</H2>
          <Label gap="2px" margin="0 0 12px 0">
            Địa chỉ email:
            <Input name="userEmail" value={form.userEmail} onChange={handleChange} type="email" placeholder="Nhập địa chỉ email" />
          </Label>
          <Label gap="2px" margin="0 0 12px 0">
            Mật khẩu:
            <Input name="userPassword" value={form.userPassword} onChange={handleChange} type="password" placeholder="Nhập mật khẩu" />
          </Label>
          <Button margin="12px 0 0 0" disabled={waitLogin} onClick={handleSubmit}>
            {waitLogin ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>
        <Button margin="12px 0 0 0" backgroundColor="var(--success-color)" onClick={handleGoogleLogin}>
          Tiếp tục với Google
        </Button>
        <LabelQuestion margin="12px 0 0 0" direction="row" gap="4px" justifyContent="center">
          Bạn chưa có tài khoản?
          <Link to="/register" color='var(--primary-color)' hoverUnderline="true">Đăng ký</Link>
        </LabelQuestion>
        <LabelQuestion margin="6px 0 0 0" direction="row" gap="4px" justifyContent="center">
          Bạn quên mật khẩu?
          <Link to="/forgot-password" color='var(--primary-color)' hoverUnderline="true">Đặt lại</Link>
        </LabelQuestion>
      </Container>
    </Wrapper>
  );
};

export default Login;
