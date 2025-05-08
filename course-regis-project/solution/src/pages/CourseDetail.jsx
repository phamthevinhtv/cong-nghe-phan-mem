import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useUser } from '../App';
import Button from '../components/Button';
import CourseEditor from '../components/CourseEditor';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ViewCourse from '../components/ViewCourse';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Main = styled.main`
  width: 1248px;
  flex: 1;
  margin: 100px auto 24px auto;
  padding: 0 24px;
  position: relative;
  z-index: 0;
`;

const ButtonBox = styled.div`
  display: flex;
  gap: 24px;
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

const CourseDetail = () => {
  const { sessionUser } = useUser();
  const [isView, setIsView] = useState(true);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    courseName: '',
    courseDescription: '',
    courseCategoryId: null,
    courseStartDate: '',
    courseEndDate: '',
    courseMaxStudent: 0,
    totalEnrollments: 0,
    coursePrice: 0,
    courseStatus: 'Draft',
    userId: null,
    userFullName: ''
  });

  const getCourse = async () => {
    const storedCourse = localStorage.getItem('selectedCourse');
    if (storedCourse) {
      const selectedCourse = JSON.parse(storedCourse);

      try {
        const response = await axios.get(`http://localhost:5000/api/course/${selectedCourse.courseId}`, { withCredentials: true });
        if (response.data.course) {
          const course = response.data.course;

          setForm({
            courseName: course.courseName || '',
            courseDescription: course.courseDescription || '',
            courseCategoryId: course.courseCategoryId || null,
            courseStartDate: course.courseStartDate || '',
            courseEndDate: course.courseEndDate || '',
            courseMaxStudent: course.courseMaxStudent || 0,
            totalEnrollments: course.totalEnrollments || 0,
            coursePrice: course.coursePrice || 0,
            courseStatus: course.courseStatus || '',
            userId: course.userId || null,
            userFullName: course.userFullName || '',
          });
        }
      } catch (err) {
        console.error('Lỗi khi lấy thông tin khóa học:', err);
      }
    } else {
      navigate('/home');
    }
  };

  useEffect(() => {
    getCourse();
  }, []);

  return (
    <Wrapper>
      <Header sessionUser={sessionUser} />
      <Main>
        <div style={{ display: isView ? 'block' : 'none' }}>
          <ViewCourse form={form} isUpdate={true}/>
        </div>
        <ButtonBox>
          <ButtonMod backgroundColor='#dcdcdc' style={{ display: sessionUser.userRole != 'Student' ? (isView ? 'block' : 'none') : 'none', color: "var(--text-color)" }} onClick={() => navigate(-1)}>Trở lại</ButtonMod>
          <ButtonMod style={{ display: sessionUser.userRole != 'Student' ? (isView ? 'block' : 'none') : 'none' }}
          backgroundColor='var(--success-color)' onClick={() => setIsView(false)}>
            Cập nhật
          </ButtonMod>
        </ButtonBox>
        <div style={{ display: isView ? 'none' : 'block' }}>
          <CourseEditor form={form} setForm={setForm} mode='Update' setIsView={setIsView} />
        </div>
      </Main>
      <Footer />
    </Wrapper>
  );
};

export default CourseDetail;