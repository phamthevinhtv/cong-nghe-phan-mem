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

  & > :nth-child(6) {
    margin-bottom: 16px;
  }

  & > :nth-child(7) {
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
  min-height: 18px;
  margin: 0;
`;

const Text = styled.p`
  text-align: center;
  cursor: default;
  margin-top: 16px;
`;

function Register() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const vnPhoneRegex = /^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/;

  const userEmail = useInputValid((v) => emailRegex.test(v.trim()));
  const userName = useInputValid((v) => v.trim().length > 0);
  const userPhone = useInputValid((v) => vnPhoneRegex.test(v.trim()));
  const userPassword = useInputValid((v) => v.trim().length >= 6);
  const userConfirmPassword = useInputValid(
    (v) => v.trim() === userPassword.value && v.trim().length > 0
  );

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
    setMessage("");
    setErrorMsg("");
    userEmail.onBlur();
    userName.onBlur();
    userPhone.onBlur();
    userPassword.onBlur();
    userConfirmPassword.onBlur();
    if (
      !userEmail.isValid ||
      !userName.isValid ||
      !userPhone.isValid ||
      !userPassword.isValid ||
      !userConfirmPassword.isValid
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        userFullName: userName.value,
        userEmail: userEmail.value,
        userPassword: userPassword.value,
        userPhoneNumber: userPhone.value,
        userRole: "Student",
      });
      setMessage(res.data.message || "Đăng ký thành công!");
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg("");
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
      setErrorMsg("Đăng nhập Google thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Title>Đăng ký</Title>
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
        <Label>
          Họ và tên
          <TextField
            placeholder="Nhập họ và tên"
            name="userName"
            value={userName.value}
            onChange={userName.onChange}
            onBlur={userName.onBlur}
          />
          <Message style={{ display: userName.error ? "block" : "none" }}>
            Tên không được để trống
          </Message>
        </Label>
        <Label>
          Số điện thoại
          <TextField
            placeholder="Nhập số điện thoại"
            name="userPhone"
            value={userPhone.value}
            onChange={userPhone.onChange}
            onBlur={userPhone.onBlur}
          />
          <Message style={{ display: userPhone.error ? "block" : "none" }}>
            Số điện thoại không hợp lệ
          </Message>
        </Label>
        <Label>
          Mật khẩu
          <PasswordField
            placeholder="Nhập mật khẩu"
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
          Xác nhận mật khẩu
          <PasswordField
            placeholder="Nhập lại mật khẩu"
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
        <Button type="submit" width="100%" disabled={loading}>
          {loading ? "Đang gửi..." : "Đăng ký"}
        </Button>
        <Button
          backgroundColor="var(--color-success)"
          type="button"
          width="100%"
          onClick={handleGoogleLogin}
        >
          Tiếp tục với Google
        </Button>
        {message && (
          <Message
            style={{
              marginTop: "16px",
              color: "var(--color-success)",
              textAlign: "center",
            }}
          >
            {message}
          </Message>
        )}
        {errorMsg && (
          <Message
            style={{
              marginTop: "16px",
              color: "var(--color-danger)",
              textAlign: "center",
            }}
          >
            {errorMsg}
          </Message>
        )}
        <Text>
          Đã có tài khoản?
          <Link to="/login"> Đăng nhập</Link>
        </Text>
      </Form>
    </Wrapper>
  );
}

export default Register;
