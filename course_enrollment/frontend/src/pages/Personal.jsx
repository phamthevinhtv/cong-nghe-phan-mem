import styled from "styled-components";
import { useState } from "react";
import axios from "@/utils/axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TextField from "@/components/TextField";
import Button from "@/components/Button";

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 24px 12px;
`;

const MainContent = styled.div`
  height: fit-content;
  width: 100%;
  max-width: 1200px;
  border: var(--border-normal);
  border-radius: var(--radius-medium);
  display: flex;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside`
  border-right: var(--border-normal);
  padding: 6px 12px 12px 12px;
  width: fit-content;

  @media (max-width: 480px) {
    width: 100%;
    border-right: none;
    border-bottom: var(--border-normal);
  }
`;

const SidebarList = styled.ul`
  li {
    padding: 6px 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
      color: var(--color-primary);
    }
  }
`;

const Form = styled.form`
  padding: 12px;
  flex: 1;
`;

const FormHeading = styled.h2`
  font-size: var(--font-size-medium);
  font-weight: 500;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .material-symbols-outlined {
    cursor: pointer;

    &:hover {
      color: var(--color-primary);
    }
  }
`;

const FormInline = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const FormButton = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  align-items: center;
  gap: 12px;

  button {
    white-space: nowrap;
  }

  @media (max-width: 576px) {
    flex-direction: column-reverse;
    button {
      width: 100% !important;
    }
  }
`;

function Personal() {
  const [tab, setTab] = useState(0);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const email = user?.userEmail || "";
  const [fullName, setFullName] = useState(user?.userFullName || "");
  const [phone, setPhone] = useState(user?.userPhoneNumber || "");

  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [resetMsg, setResetMsg] = useState("");
  const [resetMsgType, setResetMsgType] = useState("success");
  const [editMode, setEdit] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");
  const [updateMsgType, setUpdateMsgType] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tab === 0) {
      setUpdateMsg("");
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.put(
          `http://localhost:5000/api/user/${user.userId}`,
          {
            userFullName: fullName,
            userPhoneNumber: phone,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const updatedUser = { ...user, ...res.data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUpdateMsg("Cập nhật thành công!");
        setUpdateMsgType("success");
        setEdit(false);
      } catch (err) {
        setUpdateMsg(
          err?.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại."
        );
        setUpdateMsgType("danger");
      } finally {
        setLoading(false);
      }
    } else if (tab === 1) {
      setResetMsg("");
      setLoading(true);
      try {
        await axios.post("http://localhost:5000/api/auth/forgot-password", {
          userEmail: email,
        });
        setResetMsg("Đã gửi email đặt lại mật khẩu!");
        setResetMsgType("success");
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (err) {
        setResetMsg(
          err?.response?.data?.message ||
            "Gửi yêu cầu thất bại. Vui lòng thử lại."
        );
        setResetMsgType("danger");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Wrapper>
      <Header />
      <Main>
        <MainContent>
          <Sidebar>
            <SidebarList>
              <li
                style={{
                  color: tab === 0 ? "var(--color-primary)" : undefined,
                }}
                onClick={() => setTab(0)}
              >
                <span className="material-symbols-outlined">info</span>
                Thông tin cá nhân
              </li>
              <li
                style={{
                  color: tab === 1 ? "var(--color-primary)" : undefined,
                }}
                onClick={() => setTab(1)}
              >
                <span className="material-symbols-outlined">lock_reset</span>
                Đặt lại mật khẩu
              </li>
            </SidebarList>
          </Sidebar>
          {tab === 0 && (
            <Form onSubmit={handleSubmit}>
              <FormHeading>
                Thông tin cá nhân
                <span
                  onClick={() => setEdit(!editMode)}
                  className="material-symbols-outlined"
                >
                  {editMode ? "edit_off" : "edit"}
                </span>
              </FormHeading>
              <FormInline>
                <Label>
                  Địa chỉ email
                  <TextField
                    name="userEmail"
                    value={email}
                    placeholder=""
                    disabled={true}
                  />
                </Label>
              </FormInline>
              <FormInline>
                <Label>
                  Họ và tên
                  <TextField
                    name="userName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập họ và tên"
                    disabled={!editMode}
                  />
                </Label>
                <Label>
                  Số điện thoại
                  <TextField
                    name="userPhone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                    disabled={!editMode}
                  />
                </Label>
              </FormInline>
              <FormButton>
                {updateMsg && (
                  <p
                    style={{
                      fontSize: "var(--font-size-small)",
                      color:
                        updateMsgType === "success"
                          ? "var(--color-success)"
                          : "var(--color-danger)",
                    }}
                  >
                    {updateMsg}
                  </p>
                )}
                <Button type="submit" disabled={!editMode || loading}>
                  {loading ? "Đang gửi..." : "Cập nhật"}
                </Button>
              </FormButton>
            </Form>
          )}
          {tab === 1 && (
            <Form onSubmit={handleSubmit}>
              <FormHeading>Đặt lại mật khẩu</FormHeading>
              <FormInline>
                <Label>
                  Địa chỉ email
                  <TextField
                    value={email}
                    name="userEmail"
                    placeholder=""
                    disabled={true}
                  />
                </Label>
              </FormInline>
              <FormButton>
                {resetMsg && (
                  <p
                    style={{
                      fontSize: "var(--font-size-small)",
                      color:
                        resetMsgType === "success"
                          ? "var(--color-success)"
                          : "var(--color-danger)",
                    }}
                  >
                    {resetMsg}
                  </p>
                )}
                <Button type="submit" disabled={loading || countdown > 0}>
                  {loading
                    ? "Đang gửi..."
                    : countdown > 0
                    ? `Gửi lại sau ${countdown}s`
                    : "Gửi yêu cầu"}
                </Button>
              </FormButton>
            </Form>
          )}
        </MainContent>
      </Main>
      <Footer />
    </Wrapper>
  );
}

export default Personal;
