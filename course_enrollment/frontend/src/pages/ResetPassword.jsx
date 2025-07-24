import styled from "styled-components";
import { Link } from "react-router-dom";
import PasswordField from "@/components/PasswordField";
import Button from "@/components/Button";
import useInputValid from "@/utils/useInputValid";
import axios from "@/utils/axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
`;

const Form = styled.form`
  width: 100%;
  max-width: 400px;
  border: var(--border-normal);
  padding: 24px;
  border-radius: var(--radius-medium);

  & > :nth-child(3) {
    margin-bottom: 16px;
  }
`;

const Title = styled.h1`
  font-size: var(--font-size-large);
  font-weight: 500;
  text-align: center;
  color: var(--color-primary);
  margin-bottom: 12px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 12px;
`;

const Message = styled.p`
  font-size: var(--font-size-small);
  color: var(--color-danger);
  min-height: 18px;
  margin: 0;
`;

const TextEnd = styled.p`
  text-align: center;
  cursor: default;
  margin-top: 16px;
`;

function ResetPassword() {
  const userPassword = useInputValid((v) => v.trim().length >= 6);
  const userConfirmPassword = useInputValid(
    (v) => v.trim() === userPassword.value && v.trim().length > 0
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const handlePasswordChange = (e) => {
    userPassword.onChange(e);
    if (userConfirmPassword.touched) {
      userConfirmPassword.onBlur();
    }
  };

  const handleConfirmPasswordChange = (e) => {
    userConfirmPassword.onChange(e);
    if (userPassword.touched) {
      userPassword.onBlur();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    userPassword.onBlur();
    userConfirmPassword.onBlur();
    setMessage("");
    setError("");
    if (!userPassword.isValid || !userConfirmPassword.isValid) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          token,
          newPassword: userPassword.value,
        }
      );
      setMessage(res.data.message || "Đặt lại mật khẩu thành công.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Yêu cầu đặt lại mật khẩu không hợp lệ hoặc đã hết hạn."
      );
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Title>Đặt lại mật khẩu</Title>
        <Label>
          Mật khẩu mới
          <PasswordField
            placeholder="Nhập mật khẩu mới"
            name="userPassword"
            value={userPassword.value}
            onChange={handlePasswordChange}
            onBlur={userPassword.onBlur}
          />
          <Message style={{ display: userPassword.error ? "block" : "none" }}>
            Mật khẩu phải có ít nhất 6 ký tự
          </Message>
        </Label>
        <Label>
          Xác nhận mật khẩu mới
          <PasswordField
            placeholder="Nhập lại mật khẩu mới"
            name="userConfirmPassword"
            value={userConfirmPassword.value}
            onChange={handleConfirmPasswordChange}
            onBlur={userConfirmPassword.onBlur}
          />
          <Message
            style={{ display: userConfirmPassword.error ? "block" : "none" }}
          >
            Mật khẩu xác nhận không khớp
          </Message>
        </Label>
        <Button type="submit" width="100%">
          Đặt lại
        </Button>
        {message && (
          <Message
            style={{
              color: "var(--color-success)",
              textAlign: "center",
              marginTop: "16px",
            }}
          >
            {message}
          </Message>
        )}
        {error && (
          <Message
            style={{
              color: "var(--color-danger)",
              textAlign: "center",
              marginTop: "16px",
            }}
          >
            {error}
          </Message>
        )}
        {error && (
          <TextEnd>
            <Link to="/login">Gửi lại yêu cầu</Link>
          </TextEnd>
        )}
        {message && (
          <TextEnd>
            <Link to="/login">Trở lại đăng nhập</Link>
          </TextEnd>
        )}
      </Form>
    </Wrapper>
  );
}

export default ResetPassword;
