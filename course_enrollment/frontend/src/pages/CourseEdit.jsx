import styled from "styled-components";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useInputValid from "@/utils/useInputValid";
import axios from "@/utils/axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TextField from "@/components/TextField";
import FileField from "@/components/FileField";
import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import JoditEditor from "jodit-react";

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
`;

const H2 = styled.h2`
  font-size: var(--font-size-large);
  margin-bottom: 12px;
  font-weight: 500;
`;

const ContentRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 2px;

  @media (max-width: 576px) {
    width: 100%;
  }

  ${({ $fullWidth }) =>
    $fullWidth &&
    `
    width: 100%;
  `}

  ${({ $width200px }) =>
    $width200px &&
    `
    width: 200px;
  `}
`;

const ButtonWrapper = styled.main`
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  align-items: center;
  gap: 12px;

  @media (max-width: 576px) {
    flex-direction: column-reverse;

    button {
      width: 100%;
    }
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
`;

const CreateCategory = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
  height: fit-content;
  background-color: var(--color-white);
  padding: 12px;
  border-radius: var(--radius-medium);
  overflow: auto;

  & > form > :nth-child(3) {
    margin-bottom: 16px;
  }
`;

const CreateCategoryClose = styled.span`
  font-size: 2.4rem !important;
  position: absolute;
  right: 6px;
  top: 6px;
  cursor: pointer;

  &:hover {
    color: var(--color-primary);
  }
`;

const CreateCategoryHeading = styled.h2`
  font-size: var(--font-size-medium);
  font-weight: 500;
  text-align: center;
  padding-bottom: 12px;
`;

const Message = styled.p`
  font-size: var(--font-size-small);
  color: var(--color-danger);
  min-height: 18px;
  margin: 0;
`;

function CreateCourse() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");
  const [inputError, setInputError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const categoryOptions = categories.map((cat) => ({
    value: cat.courseCategoryId,
    label: cat.courseCategoryName,
  }));

  const courseStatus = [
    { value: "Publish", label: "Công khai" },
    { value: "Draft", label: "Bản nháp" },
  ];

  const coursePlatform = [
    { value: "Google Meet", label: "Google Meet" },
    { value: "Zoom", label: "Zoom" },
    { value: "Microsoft Teams", label: "Microsoft Teams" },
  ];

  const nameValid = useInputValid((v) => v.trim().length > 0);
  const dateValid = useInputValid((v) => v.trim().length > 0);
  const startValid = useInputValid((v) => v.trim().length > 0);
  const endValid = useInputValid((v) => v.trim().length > 0);
  const maxStudentValid = useInputValid((v) => v.trim().length > 0);
  const priceValid = useInputValid((v) => v.trim().length > 0);
  const descValid = useInputValid((v) => v.trim().length > 0);

  const [formData, setFormData] = useState({
    courseCategoryId: null,
    courseName: "",
    courseImage: null,
    courseDescription: "",
    courseDate: "",
    courseStart: "",
    courseEnd: "",
    courseDuration: "",
    courseLocation: "",
    coursePlatform: "Google Meet",
    courseMaxStudent: "15",
    coursePrice: "0",
    courseStatus: "Draft",
  });

  useEffect(() => {
    if (location.state && location.state.course) {
      const c = location.state.course;
      let start = "";
      let end = "";
      if (c.courseDuration && c.courseDuration.includes("-")) {
        const parts = c.courseDuration.split("-");
        start = parts[0].trim();
        end = parts[1].trim();
      }
      const newForm = {
        courseCategoryId: c.courseCategoryId || null,
        courseName: c.courseName || "",
        courseImage: c.courseImage || null,
        courseDescription: c.courseDescription || "",
        courseDate:
          c.courseDate && typeof c.courseDate === "string"
            ? c.courseDate.slice(0, 10)
            : "",
        courseStart: start,
        courseEnd: end,
        courseDuration: c.courseDuration || "",
        courseLocation: c.courseLocation || "",
        coursePlatform: c.coursePlatform || "Google Meet",
        courseMaxStudent: c.courseMaxStudent
          ? String(c.courseMaxStudent)
          : "15",
        coursePrice: c.coursePrice ? String(c.coursePrice) : "0",
        courseStatus: c.courseStatus || "Draft",
        courseId: c.courseId,
      };
      setFormData(newForm);
      nameValid.onChange({ target: { value: newForm.courseName } });
      dateValid.onChange({ target: { value: newForm.courseDate } });
      startValid.onChange({ target: { value: newForm.courseStart } });
      endValid.onChange({ target: { value: newForm.courseEnd } });
      maxStudentValid.onChange({ target: { value: newForm.courseMaxStudent } });
      priceValid.onChange({ target: { value: newForm.coursePrice } });
      descValid.onChange({ target: { value: newForm.courseDescription } });
    }
  }, [location.state]);

  const handleChange = (field) => (e) => {
    let value = e && e.target ? e.target.value : e;
    setFormData((prev) => ({ ...prev, [field]: value }));
    switch (field) {
      case "courseName":
        nameValid.onChange({ target: { value } });
        break;
      case "courseDate":
        dateValid.onChange({ target: { value } });
        break;
      case "courseStart":
        startValid.onChange({ target: { value } });
        break;
      case "courseEnd":
        endValid.onChange({ target: { value } });
        break;
      case "courseMaxStudent":
        maxStudentValid.onChange({ target: { value } });
        break;
      case "coursePrice":
        priceValid.onChange({ target: { value } });
        break;
      case "courseStatus":
        break;
      default:
        break;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    imageValid.onChange({ target: { value: file } });
    if (!file || !file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, courseImage: null }));
      return;
    }
    setFormData((prev) => ({ ...prev, courseImage: file }));
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, courseDescription: value }));
    descValid.onChange({ target: { value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setApiError("");
    nameValid.onBlur();
    dateValid.onBlur();
    startValid.onBlur();
    endValid.onBlur();
    maxStudentValid.onBlur();
    priceValid.onBlur();
    descValid.onBlur();
    const now = new Date();
    let validDateTime = true;
    if (formData.courseDate && formData.courseStart) {
      const dateStr = formData.courseDate;
      const startStr = formData.courseStart;
      const dateTimeStr = `${dateStr}T${startStr}:00`;
      const courseDateTime = new Date(dateTimeStr);
      if (courseDateTime <= now) {
        setApiError("Ngày học và giờ bắt đầu phải sau thời điểm hiện tại.");
        validDateTime = false;
      }
    }
    if (
      !nameValid.isValid ||
      !dateValid.isValid ||
      !startValid.isValid ||
      !endValid.isValid ||
      !descValid.isValid ||
      !validDateTime
    ) {
      return;
    }
    let date = formData.courseDate;
    let formattedDate = "";
    if (date) {
      const d = new Date(date);
      formattedDate = d.toISOString().slice(0, 10);
    }
    let duration = "";
    if (formData.courseStart && formData.courseEnd) {
      duration = `${formData.courseStart} - ${formData.courseEnd}`;
    }
    let maxStudent = formData.courseMaxStudent || "15";
    let price = formData.coursePrice || "0";
    let courseStatus = formData.courseStatus || "Draft";
    setLoading(true);
    try {
      let imageUrl = "";
      if (
        formData.courseImage &&
        typeof formData.courseImage !== "string" &&
        formData.courseImage.type &&
        formData.courseImage.type.startsWith("image/")
      ) {
        const formDataImg = new FormData();
        formDataImg.append("file", formData.courseImage);
        formDataImg.append("upload_preset", "course_enrollment");
        const resCloud = await fetch(
          "https://api.cloudinary.com/v1_1/dyoogiccq/image/upload",
          {
            method: "POST",
            body: formDataImg,
          }
        );
        const data = await resCloud.json();
        if (data.secure_url) {
          imageUrl = data.secure_url;
        } else {
          setApiError("Upload ảnh thất bại. Vui lòng thử lại.");
          setLoading(false);
          return;
        }
      } else if (typeof formData.courseImage === "string") {
        imageUrl = formData.courseImage;
      }
      const token = localStorage.getItem("token");
      const body = {
        ...formData,
        courseDate: formattedDate,
        courseDuration: duration,
        courseMaxStudent: maxStudent,
        coursePrice: price,
        courseStatus,
        courseImage: imageUrl,
      };
      delete body.courseStart;
      delete body.courseEnd;
      console.log(body);

      if (formData.courseId) {
        const res = await axios.put(
          `http://localhost:5000/api/course/${formData.courseId}`,
          body,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          }
        );
        setMessage(res.data.message || "Cập nhật khóa học thành công!");
        setTimeout(() => {
          navigate(`/course-detail/${formData.courseId}`);
        }, 1200);
      } else {
        const res = await axios.post("http://localhost:5000/api/course", body, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });
        setMessage(res.data.message || "Tạo khóa học thành công!");
        const newId = res.data.course?.courseId || res.data.courseId;
        if (newId) {
          setTimeout(() => {
            navigate(`/course-detail/${newId}`);
          }, 1200);
        }
      }
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          (formData.courseId
            ? "Cập nhật khóa học thất bại. Vui lòng thử lại."
            : "Tạo khóa học thất bại. Vui lòng thử lại.")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/course/category",
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          }
        );
        setCategories(res.data.categories || []);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, [isCategoryOpen, message]);

  const openCategory = (e) => {
    e.preventDefault();
    setIsCategoryOpen(true);
    setCategoryName("");
    setMessage("");
    setInputError("");
    setApiError("");
  };
  const closeCategory = () => setIsCategoryOpen(false);

  const handleCategoryChange = (e) => {
    setCategoryName(e.target.value);
    setInputError("");
    setMessage("");
    setApiError("");
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setApiError("");
    if (!categoryName.trim()) {
      setInputError("Tên danh mục không được để trống");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/course/category",
        {
          courseCategoryName: categoryName.trim(),
        },
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );
      setMessage(res.data.message || "Tạo danh mục thành công.");
      setCategoryName("");
    } catch (err) {
      setApiError(
        err?.response?.data?.message ||
          "Tạo danh mục thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Header />
      <Main>
        <MainContent>
          <H2>Soạn thảo khóa học</H2>
          <form onSubmit={handleSubmit}>
            <ContentRow>
              <Label $fullWidth>
                Tên khóa học
                <TextField
                  placeholder="Nhập tên khóa học"
                  value={formData.courseName}
                  onChange={handleChange("courseName")}
                  onBlur={nameValid.onBlur}
                />
                <Message
                  style={{ display: nameValid.error ? "block" : "none" }}
                >
                  Tên không được để trống
                </Message>
              </Label>
              <Label $width200px>
                Trạng thái
                <Dropdown
                  placeholder="Chọn trạng thái"
                  options={courseStatus}
                  value={formData.courseStatus}
                  onChange={handleChange("courseStatus")}
                />
              </Label>
            </ContentRow>
            <ContentRow>
              <Label $fullWidth>
                Ảnh khóa học
                <FileField onChange={handleFileChange} />
              </Label>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "flex-end",
                  gap: "6px",
                }}
              >
                <Label $fullWidth>
                  Danh mục
                  <Dropdown
                    placeholder="Chọn danh mục"
                    value={formData.courseCategoryId}
                    onChange={handleChange("courseCategoryId")}
                    options={categoryOptions}
                  />
                </Label>
                <Button width="fit-content" onClick={openCategory}>
                  Thêm
                </Button>
              </div>
            </ContentRow>
            <ContentRow>
              <Label $fullWidth>
                Ngày tổ chức
                <TextField
                  type="date"
                  value={formData.courseDate}
                  onChange={handleChange("courseDate")}
                  onBlur={dateValid.onBlur}
                />
                <Message
                  style={{ display: dateValid.error ? "block" : "none" }}
                >
                  Ngày tổ chức không được để trống
                </Message>
              </Label>
              <Label $fullWidth>
                Giờ bắt đầu
                <TextField
                  type="time"
                  value={formData.courseStart}
                  onChange={handleChange("courseStart")}
                  onBlur={startValid.onBlur}
                />
                <Message
                  style={{ display: startValid.error ? "block" : "none" }}
                >
                  Giờ bắt đầu không được để trống
                </Message>
              </Label>
              <Label $fullWidth>
                Giờ kết thúc
                <TextField
                  type="time"
                  value={formData.courseEnd}
                  onChange={handleChange("courseEnd")}
                  onBlur={endValid.onBlur}
                />
                <Message style={{ display: endValid.error ? "block" : "none" }}>
                  Giờ kết thúc không được để trống
                </Message>
              </Label>
            </ContentRow>
            <ContentRow>
              <Label $width200px>
                Ứng dụng
                <Dropdown
                  placeholder="Chọn ứng dụng"
                  options={coursePlatform}
                  value={formData.coursePlatform}
                  onChange={handleChange("coursePlatform")}
                />
              </Label>
              <Label $fullWidth>
                Địa chỉ
                <TextField
                  placeholder="Nhập địa chỉ"
                  value={formData.courseLocation}
                  onChange={handleChange("courseLocation")}
                />
              </Label>
            </ContentRow>
            <ContentRow>
              <Label $fullWidth>
                Số lượng học viên
                <TextField
                  type="number"
                  placeholder="Nhập số lượng học viên"
                  value={formData.courseMaxStudent}
                  onChange={handleChange("courseMaxStudent")}
                  onBlur={maxStudentValid.onBlur}
                />
              </Label>
              <Label $fullWidth>
                Giá khóa học
                <TextField
                  type="number"
                  placeholder="Nhập giá khóa học"
                  value={formData.coursePrice}
                  onChange={handleChange("coursePrice")}
                  onBlur={priceValid.onBlur}
                />
              </Label>
            </ContentRow>
            <ContentRow>
              <Label $fullWidth>
                Mô tả khóa học
                <JoditEditor
                  value={formData.courseDescription}
                  onChange={handleDescriptionChange}
                  onBlur={descValid.onBlur}
                />
                <Message
                  style={{ display: descValid.error ? "block" : "none" }}
                >
                  Mô tả không được để trống
                </Message>
              </Label>
            </ContentRow>
            <ButtonWrapper>
              {message && (
                <Message
                  style={{
                    color: "var(--color-success)",
                    textAlign: "center",
                  }}
                >
                  {message}
                </Message>
              )}
              {apiError && (
                <Message
                  style={{
                    color: "var(--color-danger)",
                    textAlign: "center",
                  }}
                >
                  {apiError}
                </Message>
              )}
              <Button type="submit" width="fit-content" disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu"}
              </Button>
            </ButtonWrapper>
          </form>
        </MainContent>
      </Main>
      <Footer />
      {isCategoryOpen && (
        <Overlay onClick={closeCategory}>
          <CreateCategory onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCategorySubmit}>
              <CreateCategoryClose
                className="material-symbols-outlined"
                onClick={closeCategory}
              >
                close
              </CreateCategoryClose>
              <CreateCategoryHeading>Thêm danh mục mới</CreateCategoryHeading>
              <Label>
                Tên danh mục mới
                <TextField
                  placeholder="Nhập tên danh mục mới"
                  value={categoryName}
                  onChange={handleCategoryChange}
                  disabled={loading}
                />
                <Message
                  style={{
                    display: inputError ? "block" : "none",
                  }}
                >
                  {inputError}
                </Message>
              </Label>
              <Button type="submit" width="100%" disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu"}
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
              {apiError && (
                <Message
                  style={{
                    color: "var(--color-danger)",
                    textAlign: "center",
                    marginTop: "16px",
                  }}
                >
                  {apiError}
                </Message>
              )}
            </form>
          </CreateCategory>
        </Overlay>
      )}
    </Wrapper>
  );
}

export default CreateCourse;
