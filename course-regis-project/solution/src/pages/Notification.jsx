import styled from 'styled-components';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useUser } from '../App';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Link from '../components/Link';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Main = styled.main`
  width: 1248px;
  flex: 1;
  margin: 100px auto 24px auto;
  position: relative;
  z-index: 0;
  padding: 0 24px;
`;

const H2 = styled.h2`
  font-size: 2.4rem;
  margin-bottom: 12px;
  font-weight: 500;
`;

const NotifyList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1px;
`;

const NotifyItem = styled(Link)`
    display: block;
    padding: 8px;
    border-radius: 6px;

    &:hover {
        background-color: #f0f0f0;
    }
`;

const Notifications = () => {
  const { sessionUser } = useUser();
  const [coursesNotify, setCoursesNotify] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getSoonToStartCourses();
  }, []);

  const getSoonToStartCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/course/soon-to-start-courses`, { withCredentials: true });
      if (response.data.courses) {
        setCoursesNotify(response.data.courses);
      } else {
        setCoursesNotify([]);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh mục khóa học:', err);
    }
  };

  return (
    <Wrapper>
      <Header sessionUser={sessionUser} />
      <Main>
        <H2>Thông báo</H2>
        <NotifyList>
          {coursesNotify.length === 0 ? (
            <p style={{ padding: '8px' }}>Không có thông báo.</p>
          ) : (
            coursesNotify.map((course) => (
              <NotifyItem onClick={() => { localStorage.setItem('selectedCourse', JSON.stringify(course)); navigate('/course-detail') }}>
                Khóa học "{course.courseName}" sẽ bắt đầu vào {course.daysUntilStart == 0 ? 'hôm nay' : `ngày ${dayjs(course.courseStartDate).format('DD/MM/YYYY')}, còn lại ${course.daysUntilStart} ngày.`}
              </NotifyItem>
            ))
          )}
        </NotifyList>
      </Main>
      <Footer />
    </Wrapper>
  );
};

export default Notifications;
