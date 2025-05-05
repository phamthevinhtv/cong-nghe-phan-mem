import styled from 'styled-components';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useUser } from '../App';
import ViewCourse from '../components/ViewCourse';
import { useState, useEffect } from 'react';
import axios from 'axios';

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

const CourseDetail = () => {
  const { sessionUser } = useUser();

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
    try {
      const response = await axios.get(`http://localhost:5000/api/course/4NZBdkRuxLZkvIMhaGP-`, { withCredentials: true });
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
  };

  useEffect(() => {
    getCourse();
  }, []);

  return (
    <Wrapper>
      <Header sessionUser={sessionUser} />
      <Main>
          <ViewCourse form={form} />
      </Main>
      <Footer />
    </Wrapper>
  );
};

export default CourseDetail;
