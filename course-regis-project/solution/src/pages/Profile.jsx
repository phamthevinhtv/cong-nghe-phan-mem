import styled from 'styled-components';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Button from '../components/Button';
import Input from '../components/Input';
import Label from '../components/Label';
import RadioGroup from '../components/RadioGroup';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useUser } from '../App';
import { toast } from 'react-toastify';
import emptyInputWarning from '../utils/emtyInputWarning';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Main = styled.main`
  width: 1248px;
  flex: 1;
  margin: 86px auto 24px auto;
  padding: 0 24px
`;

const H2 = styled.h2`
  font-size: 2.4rem;
  margin-bottom: 12px;
  font-weight: 500;
`;

const Form = styled.form`
  display: flex;
  gap: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
  }
`;

const FormChild = styled.div`
  flex: 1;
`;

const RadioGroupGender = styled(RadioGroup)`
  @media (max-width: 346px) {
    flex-direction: column;
    gap: 2px;
  }
`;

const ButtonBox = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 12px;
  justify-content: right;

  @media (max-width: 500px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const ButtonMod = styled(Button)`
  width: 100px;
  @media (max-width: 500px) {
    width: 100%;
  }
`;

const Profile = () => {
  const { sessionUser } = useUser();
  const [waitUpdate, setWaitUpdate] = useState(false);
  const [form, setForm] = useState({
    userFullName: '',
    userEmail: '',
    userGender: '',
    userPhoneNumber: '',
    userAddress: '',
  });

  const formRef = useRef();
  const [isUpdate, setIsUpdate] = useState(false);
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedForm = {
      ...form,
      userFullName: form.userFullName.trim(),
      userEmail: form.userEmail.trim(),
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
    if (!/^(?:\+84[3|5|7|8|9][0-9]{8}|0[3|5|7|8|9][0-9]{8})$/.test(trimmedForm.userPhoneNumber)) {
      emptyInputWarning('userPhoneNumber');
      toast.warning('Số điện thoại không hợp lệ.', { position: 'top-right', autoClose: 3000 });
      return;
    }
    setWaitUpdate(true);
    try {
      const response = await axios.put(`http://localhost:5000/api/user/${sessionUser?.userId}`, trimmedForm, { withCredentials: true });
      toast.success(response.data.message, { position: 'top-right', autoClose: 3000 });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi máy chủ.', { position: 'top-right', autoClose: 3000 });
    } finally {
      setWaitUpdate(false);
      setIsUpdate(false);
    }
  }

  const handleUpdateButton = () => {
    if (isUpdate) {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }
    setIsUpdate(true);
  }

  const getProfile = async () => {
    try {
      const respone = await axios.get(`http://localhost:5000/api/user/${sessionUser?.userId}`, { withCredentials: true });
      if (respone.data.user) {
        const user = respone.data.user;
        setForm({
          userFullName: user.userFullName || '',
          userEmail: user.userEmail || '',
          userGender: user.userGender || '',
          userPhoneNumber: user.userPhoneNumber || '',
          userAddress: user.userAddress || '',
        });
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin người dùng:', err);
    }
  };

  useEffect(() => {
    getProfile();
  }, [sessionUser?.userId]);

  return (
    <Wrapper>
      <Header sessionUser={sessionUser} />
      <Main>
        <H2>Thông tin cá nhân</H2>
        <Form ref={formRef} method='post' onSubmit={handleSubmit} id='form-profile'>
          <FormChild>
            <Label gap="2px" margin="0 0 12px 0">
              Địa chỉ email:
              <Input disabled name="userEmail" value={form.userEmail} onChange={handleChange} type="email" placeholder="Địa chỉ email" />
            </Label>
            <Label gap="2px" margin="0 0 12px 0">
              Họ và tên:
              <Input disabled={!isUpdate} name="userFullName" value={form.userFullName} onChange={handleChange} placeholder="Họ và tên" />
            </Label>
            <Label margin="0 0 12px 0" gap="2px">
              Giới tính:
              <RadioGroupGender disabled={!isUpdate} name="userGender" value={form.userGender} onChange={handleChange} gap="24px" direction="row"
                options={[
                  { value: 'Nam', label: 'Nam' },
                  { value: 'Nữ', label: 'Nữ' },
                  { value: 'Khác', label: 'Khác' },
                ]}
               />
            </Label>
          </FormChild>
          <FormChild>
            <Label gap="2px" margin="0 0 12px 0">
              Số điện thoại:
              <Input disabled={!isUpdate} name="userPhoneNumber" value={form.userPhoneNumber} onChange={handleChange} placeholder="Số điện thoại" />
            </Label>
            <Label gap="2px" margin="0 0 12px 0">
              Địa chỉ:
              <Input disabled={!isUpdate} name="userAddress" value={form.userAddress} onChange={handleChange} placeholder="Địa chỉ" />
            </Label>
          </FormChild>
        </Form>
        <ButtonBox>
          <ButtonMod backgroundColor='#dcdcdc' style={{ color: "var(--text-color)", display: isUpdate ? "block" : "none" }} onClick={() => { setIsUpdate(false) }}>Hủy</ButtonMod>
          <ButtonMod backgroundColor={isUpdate ? 'var(--primary-color)' : 'var(--success-color)'} onClick={handleUpdateButton}>{isUpdate ? (waitUpdate ? "Đang lưu..." : "Lưu") : "Cập nhật"}</ButtonMod>
        </ButtonBox>
      </Main>
      <Footer />
    </Wrapper>
  );
};

export default Profile;
