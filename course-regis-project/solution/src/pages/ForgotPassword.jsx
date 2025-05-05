import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Button from '../components/Button';
import Input from '../components/Input';
import Label from '../components/Label';
import Link from '../components/Link';
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

const InlineFlex = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
`;

const LabelQuestion = styled(Label)`
  @media (max-width: 346px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 2px;
  }
`;

const ForgotPassword = () => {
  const [form, setForm] = useState({
    userOtp: '',
    userEmail: '',
    userPassword: '',
  });

  const [waitReset, setWaitReset] = useState(false); 
  const [waitSendOtp, setWaitSendOtp] = useState(false); 
  const [countDown, setCountDown] = useState(0); 

  useEffect(() => {
    const storedCountdown = parseInt(localStorage.getItem('otpCountdown'), 10);
    if (!isNaN(storedCountdown) && storedCountdown > 0) {
      setCountDown(storedCountdown);
    }
  }, []);

  useEffect(() => {
    let timer;

    if (countDown > 0) {
      localStorage.setItem('otpCountdown', countDown);
      timer = setInterval(() => {
        setCountDown(prev => {
          const newCount = prev - 1;
          if (newCount <= 0) {
            localStorage.removeItem('otpCountdown');
          } else {
            localStorage.setItem('otpCountdown', newCount);
          }
          return newCount;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [countDown]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedForm = {
      ...form,
      userOtp: form.userOtp.trim(),
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

    setWaitReset(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', trimmedForm);
      toast.success(response.data.message, { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi máy chủ.', { position: 'top-right', autoClose: 3000 });
    } finally {
      setWaitReset(false);
    }
  };

  const handleSendOtp = async () => {
    const trimmedForm = {
      ...form,
      userEmail: form.userEmail.trim(),
    };
    if (trimmedForm.userEmail.length <= 0) {
      emptyInputWarning('userEmail');
      toast.warning('Vui lòng nhập email.', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedForm.userEmail)) {
      emptyInputWarning('userEmail');
      toast.warning('Email không hợp lệ.', { position: 'top-right', autoClose: 3000 });
      return;
    }
    setWaitSendOtp(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/request-reset-password', trimmedForm);
      toast.success(response.data.message, { position: 'top-right', autoClose: 3000 });
      setCountDown(60);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi máy chủ.', { position: 'top-right', autoClose: 3000 });
    } finally {
      setWaitSendOtp(false);
    }
  };

  return (
    <Wrapper>
      <Container>
        <form onSubmit={handleSubmit}>
          <H2>Đặt lại mật khẩu</H2>
          <Label htmlFor='userEmail' margin="0 0 2px 0">Địa chỉ email:</Label>
          <InlineFlex>
            <Input
              name="userEmail"
              value={form.userEmail}
              onChange={handleChange}
              type="email"
              placeholder="Nhập địa chỉ email"
              required
            />
            <Button
              disabled={waitSendOtp || countDown > 0}
              onClick={handleSendOtp}
              type='button'
              backgroundColor="var(--success-color)"
              width={countDown > 0 ? '200px' : 'fit-content'}
            >
              {waitSendOtp ? 'Đang gửi' : countDown > 0 ? `Gửi lại sau ${countDown}s` : 'Gửi OTP'}
            </Button>
          </InlineFlex>
          <Label gap="2px" margin="0 0 12px 0">
            Mã OTP:
            <Input name="userOtp" value={form.userOtp} onChange={handleChange} placeholder="Nhập mã OTP" required />
          </Label>
          <Label gap="2px" margin="0 0 12px 0">
            Mật khẩu:
            <Input name="userPassword" value={form.userPassword} onChange={handleChange} type="password" placeholder="Nhập mật khẩu" required />
          </Label>
          <Button margin="12px 0 0 0" disabled={waitReset} onClick={handleSubmit}>
            {waitReset ? 'Đang đặt lại...' : 'Đặt lại'}
          </Button>
        </form>
        <LabelQuestion margin="12px 0 0 0" direction="row" gap="4px" justifyContent="center">
          Bạn đã có tài khoản?
          <Link to="/login" color='var(--primary-color)' hoverUnderline="true">Đăng nhập</Link>
        </LabelQuestion>
        <LabelQuestion margin="6px 0 0 0" direction="row" gap="4px" justifyContent="center">
          Bạn chưa có tài khoản?
          <Link to="/register" color='var(--primary-color)' hoverUnderline="true">Đăng ký</Link>
        </LabelQuestion>
      </Container>
    </Wrapper>
  );
};

export default ForgotPassword;
