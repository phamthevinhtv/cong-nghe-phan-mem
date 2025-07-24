import styled from "styled-components";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import { Link } from "react-router-dom";
import useInputValid from "@/utils/useInputValid";
import axios from "@/utils/axios";
import { useState } from "react";

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

  & > :nth-child(2) {
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

function RequestResetPassword() {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const userEmail = useInputValid((v) => emailRegex.test(v.trim()));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    userEmail.onBlur();
    setMessage("");
    setError("");
    if (!userEmail.isValid) return;
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          userEmail: userEmail.value,
        }
      );
      setMessage(
        res.data.message ||
          "Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư."
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Gửi yêu cầu thất bại. Vui lòng thử lại."
      );
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Title>Yêu cầu đặt lại mật khẩu</Title>
        <Label>
          Địa chỉ email
          <TextField
            placeholder="Nhập địa chỉ email"
            name="userEmail"
            value={userEmail.value}
            onChange={userEmail.onChange}
            onBlur={userEmail.onBlur}
          />
          <Message style={{ display: userEmail.error ? "block" : "none" }}>
            Email không hợp lệ
          </Message>
        </Label>
        <Button type="submit" width="100%">
          Gửi yêu cầu
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
        <TextEnd>
          <Link to="/login">Trở lại đăng nhập</Link>
        </TextEnd>
      </Form>
    </Wrapper>
  );
}

export default RequestResetPassword;
