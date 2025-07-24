import styled from "styled-components";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import Swal from "sweetalert2";
import axios from "@/utils/axios";
import { Link } from "react-router-dom";

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
  display: flex;
  gap: 12px;

  @media (max-width: 576px) {
    flex-direction: column;
  }
`;

const CourseContent = styled.div`
  flex: 1;
`;

const CourseSide = styled.div`
  flex: 0.3;
  border-left: var(--border-gray-light);
  padding-left: 12px;

  @media (max-width: 768px) {
    flex: 0.35;
  }

  @media (max-width: 576px) {
    border-left: none;
    border-top: var(--border-gray-light);
    padding: 12px 0 0 0;
  }
`;

const CourseTitle = styled.h1`
  font-size: var(--font-size-large);
  font-weight: 500;
  text-align: justify;
  white-space: normal;
  word-break: break-word;
`;

const CourseRow = styled.p`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const CourseRowChild = styled.span`
  font-size: var(--font-size-small);
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

const CourseButton = styled.div`
  margin-top: 12px;
  width: 100%;
`;

const CourseDecription = styled.div`
  margin-top: 12px;
`;

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const isTeacher = user?.userRole?.toLowerCase() === "teacher";

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `http://localhost:5000/api/course/${courseId}`
        );
        setCourse(res.data.course);
      } catch (err) {
        setError("Khóa học này không tồn tại.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handleDelete = async () => {
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
              Authorization: token ? `Bearer ${token}` : undefined,
            },
          }
        );
        await Swal.fire({
          icon: "success",
          title: "Đã xóa thành công!",
          showConfirmButton: false,
          timer: 2000,
        });
        window.location.href = "/";
      } catch (err) {
        await Swal.fire({
          icon: "error",
          title: "Thông báo",
          text: err?.response?.data?.message || "Xóa thất bại.",
          confirmButtonText: "Đóng",
        });
      }
    }
  };

  return (
    <Wrapper>
      <Header />
      <Main>
        <MainContent>
          {loading ? (
            <div>Đang tải...</div>
          ) : error ? (
            <div style={{ color: "red" }}>{error}</div>
          ) : course ? (
            <>
              <CourseContent>
                <CourseTitle>{course.courseName}</CourseTitle>
                <CourseDecription
                  dangerouslySetInnerHTML={{
                    __html: course.courseDescription || "",
                  }}
                />
              </CourseContent>
              <CourseSide>
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
                    <span className="material-symbols-outlined">schedule</span>
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
                    <span className="material-symbols-outlined">group</span>
                    {course.currentStudent || 0}/
                    {course.courseMaxStudent || "-"}
                  </CourseRowChild>
                </CourseRow>
                <CourseRow>
                  <CourseRowChild>
                    <span className="material-symbols-outlined">
                      location_on
                    </span>
                    {course.courseLocation || "..."}
                  </CourseRowChild>
                </CourseRow>
                <CourseRow>
                  <CourseRowChild $price>
                    <span className="material-symbols-outlined">sell</span>
                    {Number(course.coursePrice) > 0
                      ? `${Number(course.coursePrice).toLocaleString()}đ`
                      : "Miễn phí"}
                  </CourseRowChild>
                </CourseRow>
                {isTeacher ? (
                  <CourseButton>
                    <Button
                      onClick={() => {
                        navigate("/course-edit", { state: { course } });
                      }}
                      width="100%"
                    >
                      Chỉnh sửa
                    </Button>
                  </CourseButton>
                ) : null}
                <CourseButton>
                  {isTeacher ? (
                    <Button
                      width="100%"
                      backgroundColor="var(--color-danger)"
                      onClick={handleDelete}
                    >
                      Xóa
                    </Button>
                  ) : user?.userRole?.toLowerCase() === "student" ? (
                    course.isEnrolled ? (
                      <Button
                        width="100%"
                        backgroundColor="var(--color-danger)"
                        onClick={async (e) => {
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
                              setCourse((prev) => ({
                                ...prev,
                                isEnrolled: false,
                                currentStudent: prev.currentStudent - 1,
                              }));
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
                              setCourse((prev) => ({
                                ...prev,
                                isEnrolled: true,
                                currentStudent: prev.currentStudent + 1,
                              }));
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
                    )
                  ) : (
                    <Button
                      width="100%"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/register");
                      }}
                    >
                      Đăng ký
                    </Button>
                  )}
                </CourseButton>
                {isTeacher ? (
                  <Link
                    to={`/students-enrolled/${course.courseId}`}
                    style={{
                      display: "block",
                      marginTop: "12px",
                      textAlign: "center",
                    }}
                  >
                    Xem danh sách học viên
                  </Link>
                ) : null}
              </CourseSide>
            </>
          ) : null}
        </MainContent>
      </Main>
      <Footer />
    </Wrapper>
  );
}

export default CourseDetail;
