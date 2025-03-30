import styled from 'styled-components';
import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import RadioGroup from '../components/RadioGroup';
import Link from '../components/Link';
import Label from '../components/Label';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
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

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^(?:\+84[3|5|7|8|9][0-9]{8}|0[3|5|7|8|9][0-9]{8})$/.test(form.userPhoneNumber)) {
      toast.warning('Số điện thoại không hợp lệ.', { position: 'top-right', autoClose: 3000 });
      return;
    }
    if (form.userPassword.length < 6) {
      toast.warning('Mật khẩu phải có ít nhất 6 ký tự.', { position: 'top-right', autoClose: 3000 });
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', form);
      toast.success(response.data.message || 'Đăng ký thành công!', { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      toast.error(error.response?.data?.message?.split(':')[0] || 'Đăng ký thất bại!', { position: 'top-right', autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Wrapper>
      <Container>
        <form onSubmit={handleSubmit}>
          <H2>Đăng ký</H2>
          <Label gap="2px" margin="0 0 12px 0">
            Địa chỉ email:
            <Input name="userEmail" value={form.userEmail} onChange={handleChange} type="email" placeholder="Nhập địa chỉ email" required />
          </Label>
          <Label gap="2px" margin="0 0 12px 0">
            Họ và tên:
            <Input name="userFullName" value={form.userFullName} onChange={handleChange} placeholder="Nhập họ và tên" required />
          </Label>
          <Label margin="0 0 12px 0" direction="row" gap="24px" alignItem="center">
            Giới tính:
            <RadioGroup name="userGender" value={form.userGender} onChange={handleChange} gap="24px" direction="row"
              options={[
                { value: 'Nam', label: 'Nam' },
                { value: 'Nữ', label: 'Nữ' },
                { value: 'Khác', label: 'Khác' },
              ]}
              required/>
          </Label>
          <Label gap="2px" margin="0 0 12px 0">
            Số điện thoại:
            <Input name="userPhoneNumber" value={form.userPhoneNumber} onChange={handleChange} placeholder="Nhập số điện thoại" required />
          </Label>
          <Label gap="2px" margin="0 0 12px 0">
            Địa chỉ:
            <Input name="userAddress" value={form.userAddress} onChange={handleChange} placeholder="Nhập địa chỉ" required />
          </Label>
          <Label gap="2px" margin="0 0 12px 0">
            Mật khẩu:
            <Input name="userPassword" value={form.userPassword} onChange={handleChange} type="password" placeholder="Nhập mật khẩu" required />
          </Label>
          <Button margin="12px 0 0 0" disabled={isLoading}>
            {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
          </Button>
        </form>
        <Button margin="12px 0 0 0" backgroundColor="var(--success-color)" onClick={() => navigate('/google')}>
          Tiếp tục với Google
        </Button>
        <Label margin="12px 0 0 0" direction="row" gap="4px" justifyContent="center">
          Bạn đã có tài khoản?
          <Link to="/login" hoverUnderline="true">Đăng nhập</Link>
        </Label>
      </Container>
    </Wrapper>
  );
};

export default Register;
