import styled from "styled-components";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import axios from "@/utils/axios";
import { useNavigate } from "react-router-dom";

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
  width: 100%;
  max-width: 1200px;
  height: fit-content;
`;

const Toolbar = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ToolbarInline = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const ToolbarButton = styled(Link)`
  display: block;
  min-width: fit-content;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const SearchField = styled.div`
  position: relative;
  flex: 1;
`;

const InputSearch = styled.input`
  padding: 10px 38px 10px 10px;
  border: var(--border-normal);
  border-radius: var(--radius-normal);
  width: 100%;

  &:hover {
    border-color: var(--color-primary);
  }

  &:focus {
    border-color: var(--color-primary);
    outline: var(--border-primary);
  }
`;

const ClearSearchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  padding: 9px;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  cursor: pointer;
  border-top-right-radius: var(--radius-normal);
  border-bottom-right-radius: var(--radius-normal);
`;

const ClearSearchIcon = styled.span`
  font-size: var(--font-size-large);

  &:hover {
    color: var(--color-primary);
  }
`;

const CourseGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  align-items: stretch;
  min-height: 200px;

  & > * {
    min-width: 0;
  }
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const CourseCard = styled.div`
  background-color: var(--color-white);
  color: var(--color-text-primary);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: var(--radius-medium);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  }
`;

const CourseImage = styled.img`
  width: 100%;
  display: block;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  border-top-left-radius: var(--radius-medium);
  border-top-right-radius: var(--radius-medium);
`;

const CourseInfo = styled.div`
  padding: 12px;
`;

const CourseTitle = styled.h2`
  font-size: var(--font-size-medium);
  font-weight: 500;
  margin-bottom: 12px;
  text-align: justify;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  white-space: normal;
`;

const CourseRow = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 6px 0;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const CourseRowChild = styled.span`
  font-size: var(--font-size-small);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: 4px;

  span {
    font-size: var(--font-size-large);
  }

  ${({ $price }) =>
    $price &&
    `
    color: var(--color-danger);
    font-size: var(--font-size-base);
    font-weight: 500;`};
`;

const CourseButton = styled.button`
  margin-top: 6px;
  width: 100%;
`;

function Home() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const isStudent = user?.userRole?.toLowerCase() === "student";
  const isTeacher = user?.userRole?.toLowerCase() === "teacher";
  const isLoggedIn = !!user;
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [feeTypes] = useState([
    { label: "Tất cả", value: "" },
    { label: "Miễn phí", value: "free" },
    { label: "Trả phí", value: "paid" },
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFeeType, setSelectedFeeType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/course", {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });
        setCourses(res.data.courses || []);
      } catch (err) {
        console.log("Không thể tải danh sách khóa học.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [isStudent]);

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
  }, []);

  const [search, setSearch] = useState("");

  const filteredCourses = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return courses.filter((course) => {
      let matchCategory = true;
      let matchFee = true;
      let matchSearch = true;
      if (selectedCategory) {
        matchCategory = course.courseCategoryId === selectedCategory;
      }
      if (selectedFeeType) {
        if (selectedFeeType === "free")
          matchFee = Number(course.coursePrice) === 0;
        if (selectedFeeType === "paid")
          matchFee = Number(course.coursePrice) > 0;
      }
      if (keyword) {
        const cardString = [
          course.courseName,
          course.courseDescription,
          course.teacherName,
          course.coursePlatform,
          course.courseLocation,
          course.courseDate
            ? new Date(course.courseDate).toLocaleDateString()
            : "",
          course.courseDuration,
          course.currentStudent,
          course.courseMaxStudent,
          Number(course.coursePrice) > 0
            ? `${Number(course.coursePrice).toLocaleString()}đ`
            : "Miễn phí",
        ]
          .map((field) => (field ? String(field).toLowerCase() : ""))
          .join(" ");
        matchSearch = cardString.includes(keyword);
      }
      return matchCategory && matchFee && matchSearch;
    });
  }, [courses, selectedCategory, selectedFeeType, search]);

  return (
    <Wrapper>
      <Header />
      <Main>
        <MainContent>
          <Toolbar>
            <SearchField>
              <InputSearch
                type="text"
                placeholder="Tìm kiếm khóa học..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <ClearSearchButton
                type="button"
                onClick={() => setSearch("")}
                title="Xóa tìm kiếm"
              >
                <ClearSearchIcon className="material-symbols-outlined">
                  close
                </ClearSearchIcon>
              </ClearSearchButton>
            </SearchField>
            <ToolbarInline>
              <Dropdown
                options={[
                  { label: "Tất cả", value: "" },
                  ...categories.map((cat) => ({
                    label: cat.courseCategoryName,
                    value: cat.courseCategoryId,
                  })),
                ]}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                placeholder="Chọn danh mục"
              />
              <Dropdown
                options={feeTypes}
                value={selectedFeeType}
                onChange={(e) => setSelectedFeeType(e.target.value)}
                placeholder="Chọn loại phí"
              />
              {isLoggedIn && !isStudent && (
                <ToolbarButton to="/course-edit">
                  <Button width="100%">Thêm khóa học</Button>
                </ToolbarButton>
              )}
            </ToolbarInline>
          </Toolbar>
          {loading ? (
            <div>Đang tải...</div>
          ) : error ? (
            <div style={{ color: "red" }}>{error}</div>
          ) : (
            <CourseGrid>
              {filteredCourses.map((course) => (
                <Link
                  to={`/course-detail/${course.courseId}`}
                  key={course.courseId}
                >
                  <CourseCard>
                    <CourseImage
                      src={
                        course.courseImage ||
                        "https://res.cloudinary.com/dyoogiccq/image/upload/v1753175428/wccojwxjdxzrgbx30xqe.png"
                      }
                      alt="Course image"
                    />
                    <CourseInfo>
                      <CourseTitle>{course.courseName}</CourseTitle>
                      <CourseRow>
                        <CourseRowChild>
                          <span className="material-symbols-outlined">
                            co_present
                          </span>
                          {course.teacherName || "Giảng viên"}
                        </CourseRowChild>
                      </CourseRow>
                      <CourseRow>
                        <CourseRowChild>
                          <span className="material-symbols-outlined">
                            calendar_month
                          </span>
                          {course.courseDate
                            ? new Date(course.courseDate).toLocaleDateString()
                            : "-"}
                        </CourseRowChild>
                        <CourseRowChild>
                          <span className="material-symbols-outlined">
                            schedule
                          </span>
                          {course.courseDuration || "-"}
                        </CourseRowChild>
                      </CourseRow>
                      <CourseRow>
                        <CourseRowChild>
                          <span className="material-symbols-outlined">
                            cast_for_education
                          </span>
                          {course.coursePlatform || "-"}
                        </CourseRowChild>
                        <CourseRowChild>
                          <span className="material-symbols-outlined">
                            group
                          </span>
                          {course.currentStudent || 0}/
                          {course.courseMaxStudent || "-"}
                        </CourseRowChild>
                      </CourseRow>
                      <CourseRow>
                        <CourseRowChild $price>
                          <span className="material-symbols-outlined">
                            sell
                          </span>
                          {Number(course.coursePrice) > 0
                            ? `${Number(course.coursePrice).toLocaleString()}đ`
                            : "Miễn phí"}
                        </CourseRowChild>
                      </CourseRow>
                      {isLoggedIn &&
                      user?.userRole?.toLowerCase() === "teacher" ? (
                        <CourseButton onClick={(e) => e.stopPropagation()}>
                          <Button
                            width="100%"
                            backgroundColor="var(--color-danger)"
                            onClick={async (e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              if (course.currentStudent > 0) {
                                await Swal.fire({
                                  icon: "error",
                                  title: "Không thể xóa",
                                  text: "Khóa học đã có người đăng ký, không thể xóa.",
                                  confirmButtonText: "Đóng",
                                });
                                return;
                              }
                              const result = await Swal.fire({
                                title: `Xác nhận xóa khóa học`,
                                text: `Bạn có chắc chắn muốn xóa khóa học '${course.courseName}'?`,
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#d33",
                                cancelButtonColor: "#3085d6",
                                confirmButtonText: "Xóa",
                                cancelButtonText: "Hủy",
                              });
                              if (result.isConfirmed) {
                                try {
                                  const token = localStorage.getItem("token");
                                  await axios.delete(
                                    `http://localhost:5000/api/course/${course.courseId}`,
                                    {
                                      headers: {
                                        Authorization: token
                                          ? `Bearer ${token}`
                                          : undefined,
                                      },
                                    }
                                  );
                                  setCourses((prev) =>
                                    prev.filter(
                                      (c) => c.courseId !== course.courseId
                                    )
                                  );
                                  await Swal.fire({
                                    icon: "success",
                                    title: "Đã xóa thành công!",
                                    showConfirmButton: false,
                                    timer: 1200,
                                  });
                                } catch (err) {
                                  await Swal.fire({
                                    icon: "error",
                                    title: "Thông báo",
                                    text:
                                      err?.response?.data?.message ||
                                      "Xóa thất bại.",
                                    confirmButtonText: "Đóng",
                                  });
                                }
                              }
                            }}
                          >
                            Xóa
                          </Button>
                        </CourseButton>
                      ) : isLoggedIn &&
                        user?.userRole?.toLowerCase() === "student" ? (
                        <CourseButton onClick={(e) => e.stopPropagation()}>
                          {course.isEnrolled ? (
                            <Button
                              width="100%"
                              backgroundColor="var(--color-danger)"
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const result = await Swal.fire({
                                  title: `Xác nhận hủy đăng ký khóa học`,
                                  text: `Bạn có chắc chắn muốn hủy đăng ký khóa học '${course.courseName}'?`,
                                  icon: "warning",
                                  showCancelButton: true,
                                  confirmButtonColor: "#d33",
                                  cancelButtonColor: "#3085d6",
                                  confirmButtonText: "Hủy đăng ký",
                                  cancelButtonText: "Đóng",
                                });
                                if (result.isConfirmed) {
                                  try {
                                    const token = localStorage.getItem("token");
                                    await axios.delete(
                                      `http://localhost:5000/api/course/${course.courseId}/enroll`,
                                      {},
                                      {
                                        headers: {
                                          Authorization: token
                                            ? `Bearer ${token}`
                                            : undefined,
                                        },
                                      }
                                    );
                                    setCourses((prev) =>
                                      prev.map((c) =>
                                        c.courseId === course.courseId
                                          ? {
                                              ...c,
                                              isEnrolled: false,
                                              currentStudent:
                                                c.currentStudent - 1,
                                            }
                                          : c
                                      )
                                    );
                                    await Swal.fire({
                                      icon: "success",
                                      title: "Đã hủy đăng ký thành công!",
                                      showConfirmButton: false,
                                      timer: 1200,
                                    });
                                  } catch (err) {
                                    await Swal.fire({
                                      icon: "error",
                                      title: "Thông báo",
                                      text:
                                        err?.response?.data?.message ||
                                        "Hủy đăng ký thất bại.",
                                      confirmButtonText: "Đóng",
                                    });
                                  }
                                }
                              }}
                            >
                              Hủy đăng ký
                            </Button>
                          ) : (
                            <Button
                              width="100%"
                              onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                const result = await Swal.fire({
                                  title: `Xác nhận đăng ký khóa học`,
                                  text: `Bạn có chắc chắn muốn đăng ký khóa học '${course.courseName}'?`,
                                  icon: "question",
                                  showCancelButton: true,
                                  confirmButtonColor: "#3085d6",
                                  cancelButtonColor: "#d33",
                                  confirmButtonText: "Đăng ký",
                                  cancelButtonText: "Đóng",
                                });
                                if (result.isConfirmed) {
                                  try {
                                    const token = localStorage.getItem("token");
                                    await axios.post(
                                      `http://localhost:5000/api/course/${course.courseId}/enroll`,
                                      {},
                                      {
                                        headers: {
                                          Authorization: token
                                            ? `Bearer ${token}`
                                            : undefined,
                                        },
                                      }
                                    );
                                    setCourses((prev) =>
                                      prev.map((c) =>
                                        c.courseId === course.courseId
                                          ? {
                                              ...c,
                                              isEnrolled: true,
                                              currentStudent:
                                                c.currentStudent + 1,
                                            }
                                          : c
                                      )
                                    );
                                    await Swal.fire({
                                      icon: "success",
                                      title: "Đăng ký thành công!",
                                      showConfirmButton: false,
                                      timer: 1200,
                                    });
                                  } catch (err) {
                                    await Swal.fire({
                                      icon: "error",
                                      title: "Thông báo",
                                      text:
                                        err?.response?.data?.message ||
                                        "Đăng ký thất bại.",
                                      confirmButtonText: "Đóng",
                                    });
                                  }
                                }
                              }}
                            >
                              Đăng ký
                            </Button>
                          )}
                        </CourseButton>
                      ) : (
                        <CourseButton onClick={(e) => e.stopPropagation()}>
                          <Button
                            width="100%"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              navigate("/register");
                            }}
                          >
                            Đăng ký
                          </Button>
                        </CourseButton>
                      )}
                    </CourseInfo>
                  </CourseCard>
                </Link>
              ))}
            </CourseGrid>
          )}
        </MainContent>
      </Main>
      <Footer />
    </Wrapper>
  );
}

export default Home;
