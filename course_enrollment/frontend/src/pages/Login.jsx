import styled from "styled-components";
import TextField from "@/components/TextField";
import PasswordField from "@/components/PasswordField";
import Button from "@/components/Button";
import { Link } from "react-router-dom";
import useInputValid from "@/utils/useInputValid";
import axios from "@/utils/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  & > :nth-child(4) {
    margin-bottom: 12px;
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
`;

const TextEnd = styled.p`
  text-align: center;
  cursor: default;
  margin-top: 16px;
`;

function Login() {
  const navigate = useNavigate();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const userEmail = useInputValid((v) => emailRegex.test(v.trim()));
  const userPassword = useInputValid((v) => v.trim().length >= 6);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    userEmail.onBlur();
    userPassword.onBlur();
    setError("");
    if (!userEmail.isValid || !userPassword.isValid) {
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        userEmail: userEmail.value,
        userPassword: userPassword.value,
      });
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      const popup = window.open(
        "http://localhost:5000/api/auth/google",
        "_blank",
        "width=500,height=600"
      );
      const receiveMessage = (event) => {
        if (
          event.origin === "http://localhost:5000" &&
          event.data?.token &&
          event.data?.user
        ) {
          localStorage.setItem("token", event.data.token);
          localStorage.setItem("user", JSON.stringify(event.data.user));
          popup && popup.close();
          window.removeEventListener("message", receiveMessage);
          navigate("/");
        }
      };
      window.addEventListener("message", receiveMessage);
    } catch (err) {
      setError("Đăng nhập Google thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Title>Đăng nhập</Title>
        <Label>
          Địa chỉ email
          <TextField
            name="userEmail"
            value={userEmail.value}
            onChange={userEmail.onChange}
            onBlur={userEmail.onBlur}
            placeholder="Nhập địa chỉ email"
          />
          <Message style={{ display: userEmail.error ? "block" : "none" }}>
            Email không hợp lệ
          </Message>
        </Label>
        <Label>
          Mật khẩu
          <PasswordField
            name="userPassword"
            value={userPassword.value}
            onChange={userPassword.onChange}
            onBlur={userPassword.onBlur}
            placeholder="Nhập mật khẩu"
          />
          <Message style={{ display: userPassword.error ? "block" : "none" }}>
            Mật khẩu phải có ít nhất 6 ký tự
          </Message>
        </Label>
        <Button type="submit" width="100%" disabled={loading}>
          {loading ? "Đang gửi..." : "Đăng nhập"}
        </Button>
        <Button
          backgroundColor="var(--color-success)"
          type="button"
          width="100%"
          onClick={handleGoogleLogin}
        >
          Tiếp tục với Google
        </Button>
        {error && (
          <Message
            style={{
              marginTop: "16px",
              color: "var(--color-danger)",
              textAlign: "center",
            }}
          >
            {error}
          </Message>
        )}
        <TextEnd>
          Chưa có tài khoản?
          <Link to="/register"> Đăng ký</Link>
        </TextEnd>
        <TextEnd>
          Quên mật khẩu?
          <Link to="/request-reset-password"> Đặt lại</Link>
        </TextEnd>
      </Form>
    </Wrapper>
  );
}

export default Login;
