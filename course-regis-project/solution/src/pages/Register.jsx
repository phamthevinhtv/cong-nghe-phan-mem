import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Button from '../components/Button';
import Input from '../components/Input';
import Label from '../components/Label';
import Link from '../components/Link';
import RadioGroup from '../components/RadioGroup';
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

const RadioGroupGender = styled(RadioGroup)`
  @media (max-width: 346px) {
    flex-direction: column;
    gap: 2px;
  }
`;

const LabelQuestion = styled(Label)`
  @media (max-width: 346px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 2px;
  }
`;

const Register = () => {
  const [form, setForm] = useState({
    userFullName: '',
    userEmail: '',
    userPassword: '',
    userGender: '',
    userPhoneNumber: '',
    userAddress: '',
  });

  const [waitRegister, setWaitRegister] = useState(false); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedForm = {
      ...form,
      userFullName: form.userFullName.trim(),
      userEmail: form.userEmail.trim(),
      userPassword: form.userPassword.trim(),
      userGender: form.userGender.trim(),
      userPhoneNumber: form.userPhoneNumber.trim(),
      userAddress: form.userAddress.trim(),
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
    if (!/^(?:\+84[3|5|7|8|9][0-9]{8}|0[3|5|7|8|9][0-9]{8})$/.test(trimmedForm.userPhoneNumber)) {
      emptyInputWarning('userPhoneNumber');
      toast.warning('Số điện thoại không hợp lệ.', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (trimmedForm.userPassword.length < 6) {
      emptyInputWarning('userPassword');
      toast.warning('Mật khẩu phải có ít nhất 6 ký tự.', { position: 'top-right', autoClose: 3000 });
      return;
    }
    setWaitRegister(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', trimmedForm);
      toast.success(response.data.message, { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi máy chủ.', { position: 'top-right', autoClose: 3000 });
    } finally {
      setWaitRegister(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <Wrapper>
      <Container>
        <form onSubmit={handleSubmit}>
          <H2>Đăng ký</H2>
          <Label gap="2px" margin="0 0 12px 0">
            Địa chỉ email:
            <Input name="userEmail" value={form.userEmail} onChange={handleChange} type="email" placeholder="Nhập địa chỉ email" />
          </Label>
          <Label gap="2px" margin="0 0 12px 0">
            Họ và tên:
            <Input name="userFullName" value={form.userFullName} onChange={handleChange} placeholder="Nhập họ và tên" />
          </Label>
          <Label margin="0 0 12px 0" gap="2px">
            Giới tính:
            <RadioGroupGender name="userGender" value={form.userGender} onChange={handleChange} gap="24px" direction="row"
              options={[
                { value: 'Nam', label: 'Nam' },
                { value: 'Nữ', label: 'Nữ' },
                { value: 'Khác', label: 'Khác' },
              ]}
            />
          </Label>
          <Label gap="2px" margin="0 0 12px 0">
            Số điện thoại:
            <Input name="userPhoneNumber" value={form.userPhoneNumber} onChange={handleChange} placeholder="Nhập số điện thoại" />
          </Label>
          <Label gap="2px" margin="0 0 12px 0">
            Địa chỉ:
            <Input name="userAddress" value={form.userAddress} onChange={handleChange} placeholder="Nhập địa chỉ" />
          </Label>
          <Label gap="2px" margin="0 0 12px 0">
            Mật khẩu:
            <Input name="userPassword" value={form.userPassword} onChange={handleChange} type="password" placeholder="Nhập mật khẩu" />
          </Label>
          <Button margin="12px 0 0 0" disabled={waitRegister} onClick={handleSubmit}>
            {waitRegister ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>
        <Button margin="12px 0 0 0" backgroundColor="var(--success-color)" onClick={handleGoogleLogin}>
          Tiếp tục với Google
        </Button>
        <LabelQuestion margin="12px 0 0 0" direction="row" gap="4px" justifyContent="center">
          Bạn đã có tài khoản?
          <Link to="/login" hoverUnderline="true" color='var(--primary-color)'>Đăng nhập</Link>
        </LabelQuestion>
      </Container>
    </Wrapper>
  );
};

export default Register;
