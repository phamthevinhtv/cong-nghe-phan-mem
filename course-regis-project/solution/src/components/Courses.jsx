import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useUser } from '../App';
import calendarIcon from '../assets/images/calendar.svg';
import closeIcon from '../assets/images/close.svg';
import instructorIcon from '../assets/images/instructor.svg';
import registrantIcon from '../assets/images/registrant.svg';
import sellIcon from '../assets/images/sell.svg';
import confirmDialog from '../utils/confirmDialog/confirmDialog';
import Button from './Button';
import Input from './Input';
import Select from './Select';

const Wrapper = styled.div`
  padding: 0 24px;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  border-bottom: var(--border-normal);
  padding-bottom: 12px;
  gap: 6px;
  @media (max-width: 700px) {
    flex-direction: column;
    align-items: normal;

    button, div, input {
        margin: 0;
        width: 100%;
    }
  }
`;

const CoursesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 12px;
`;

const CourseCard = styled.div`
  flex: 1 1 calc(25% - 12px);
  border: var(--border-normal);
  border-radius: 6px;
  background-color: var(--white-color);
  box-shadow: var(--shadow-normal);
  padding-bottom: 12px;
  cursor: pointer;
  transition: transform 0.2s ease;

  @media (max-width: 1060px) {
    flex: 1 1 calc(50% - 12px);
  }

  @media (max-width: 600px) {
    flex: 1 1 100%;
  }

  &:hover {
    transform: scale(1.02);
  }
`;

const H3 = styled.h3`
  font-size: 2rem;
  font-weight: 500;
  padding: 12px;
  background-color: #e6f0ff;
  border-radius: 5px 5px 0 0;
  margin-bottom: 12px;
`;

const InlineFlex = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 6px 12px 0 12px;
`;

const InfoIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  border: var(--border-normal);
  border-radius: 6px;
  flex: 1;
  max-height: 36px;
  overflow: hidden;
`;

const ClearIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px !important;
  height: 36px;
  border-radius: 0 6px 6px 0;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

const Courses = () => {
  const { sessionUser } = useUser();
  const navigate = useNavigate();
  const [sortType, setSortType] = useState('All');
  const [sortCategory, setSortCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [waitProcess, setWaitProcess] = useState(null);
  const [courseCategories, setCourseCategories] = useState([]);

  const removeVietnameseDiacritics = (str) => {
    if (!str) return '';
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  let sortTypes = [];
  if (sessionUser.userRole == 'Student') {
    sortTypes = [
      { label: "Tất cả", value: "All" },
      { label: "Đã đăng ký", value: "Enrolled" },
      { label: "Đã hủy", value: "Canceled" },
      { label: "Đã hoàn thành", value: "Completed" },
    ];
  } else {
    sortTypes = [
      { label: "Tất cả", value: "All" },
      { label: "Bản nháp", value: "Draft" },
      { label: "Công bố", value: "Publish" },
      { label: "Lưu trữ", value: "Archive" },
    ];
  }

  const applyFilters = (type, category, query) => {
    let filtered = [...allCourses];

    if (type === 'Draft') {
      filtered = filtered.filter(course => course.courseStatus === 'Draft');
    } else if (type === 'Publish') {
      filtered = filtered.filter(course => course.courseStatus === 'Publish');
    } else if (type === 'Archive') {
      filtered = filtered.filter(course => course.courseStatus === 'Archive');
    } else if (type === 'Enrolled') {
      filtered = filtered.filter(course => course.enrollmentStatus === 'Enrolled' && course.studentId === sessionUser.userId);
    } else if (type === 'Canceled') {
      filtered = filtered.filter(course => course.enrollmentStatus === 'Canceled' && course.studentId === sessionUser.userId);
    } else if (type === 'Completed') {
      filtered = filtered.filter(course => course.enrollmentStatus === 'Completed' && course.studentId === sessionUser.userId);
    }

    if (category) {
      filtered = filtered.filter(course => course.courseCategoryId === category);
    }

    if (query.trim()) {
      const normalizedQuery = removeVietnameseDiacritics(query.trim()).toLowerCase();
      filtered = filtered.filter(course => {
        const fields = [
          course.courseName,
          course.userFullName,
          course.courseStartDate && dayjs(course.courseStartDate).isValid() ? dayjs(course.courseStartDate).format('DD/MM/YYYY') : '',
          course.courseEndDate && dayjs(course.courseEndDate).isValid() ? dayjs(course.courseEndDate).format('DD/MM/YYYY') : '',
          course.totalEnrollments?.toString(),
          course.courseMaxStudent?.toString(),
          course.coursePrice?.toLocaleString()
        ];
        return fields.some(field =>
          field && removeVietnameseDiacritics(field.toString()).toLowerCase().includes(normalizedQuery)
        );
      });
    }

    setCourses(filtered);
  };

  const handleSortTypeChange = (e) => {
    const value = e.target.value;
    setSortType(value);
    applyFilters(value, sortCategory, searchQuery);
  };

  const handleSortCategoryChange = (e) => {
    const value = e.target.value;
    setSortCategory(value);
    applyFilters(sortType, value, searchQuery);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    applyFilters(sortType, sortCategory, value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    applyFilters(sortType, sortCategory, ''); 
  };

  const getCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/course/courses`, { withCredentials: true });
      if (response.data.courses && Array.isArray(response.data.courses)) {
        const uniqueCourses = {};

        response.data.courses.forEach(course => {
          const id = course.courseId;
          const isCurrentUser = course.studentId === sessionUser.userId;
          if (!uniqueCourses[id] || isCurrentUser) {
            uniqueCourses[id] = course;
          }
        });

        const filteredCourses = Object.values(uniqueCourses).map(course => {
          if (
            (course.enrollmentStatus === 'Completed' || course.enrollmentStatus === 'Enrolled' || course.enrollmentStatus === 'Canceled') &&
            course.studentId !== sessionUser.userId
          ) {
            course.studentId = '';
            course.enrollmentStatus = '';
          }
          return course;
        });

        setAllCourses(filteredCourses);
        setCourses(filteredCourses); 
        return filteredCourses;
      } else {
        setCourses([]);
        setAllCourses([]);
      }
    } catch (err) {
      console.error('Lỗi khi lấy thông tin khóa học:', err);
      setCourses([]);
      setAllCourses([]);
    }
  };

  const getCourseCategories = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/course/course-categories`, { withCredentials: true });
      if (response.data.courseCategories && Array.isArray(response.data.courseCategories)) {
        const format = response.data.courseCategories.map(cat => ({
          label: cat.courseCategoryName,
          value: cat.courseCategoryId
        }));
        setCourseCategories(format);
      } else {
        setCourseCategories([]);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh mục khóa học:', err);
      setCourseCategories([]);
    }
  };

  useEffect(() => {
    getCourses();
    getCourseCategories();
  }, []);

  const handleButtonCourse = async (e, course) => {
    e.stopPropagation();
    const confirmed = await confirmDialog({
      title: `Bạn có chắc muốn ${sessionUser.userRole != 'Student' ? 'xóa' : (course.enrollmentStatus === 'Enrolled' ? 'hủy đăng ký' :
        course.enrollmentStatus === 'Canceled' ? 'đăng ký lại' : 'đăng ký')} khóa học "${course.courseName}"?`,
      confirmText: 'Xác nhận',
      cancelText: 'Hủy',
    });
    if (confirmed) {
      setWaitProcess(course.courseId);
      let response;
      try {
        if (sessionUser.userRole == 'Student') {
          if (course.enrollmentStatus === 'Enrolled') {
            response = await axios.post('http://localhost:5000/api/course/cancel-enroll-course',
              { courseId: course.courseId, userId: sessionUser.userId }, { withCredentials: true });
          } else {
            response = await axios.post('http://localhost:5000/api/course/enroll-course',
              { courseId: course.courseId, userId: sessionUser.userId }, { withCredentials: true });
          }
        } else {
          response = await axios.delete(`http://localhost:5000/api/course/${course.courseId}`, { withCredentials: true });
        }
        await getCourses();
        toast.success(response.data.message, { position: 'top-right', autoClose: 3000 });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Lỗi máy chủ.', { position: 'top-right', autoClose: 3000 });
      } finally {
        setWaitProcess(null);
      }
    }
  };

  return (
    <Wrapper>
      <Toolbar>
        <Select
          clear={false}
          name="sortType"
          options={sortTypes}
          value={sortType}
          onChange={handleSortTypeChange}
          width={sessionUser.userRole == 'Student' ? '122px' : '86px'}
        />
        <Select
          name="sortCategory"
          options={courseCategories}
          value={sortCategory}
          onChange={handleSortCategoryChange}
          placeholder="Lọc theo danh mục"
          width='200px'
        />
        <Search>
          <Input style={{ flex: '1', border: 'none' }} placeholder='Nhập từ khóa cần tìm' value={searchQuery} onChange={handleSearchChange} />
          {searchQuery && (
            <ClearIcon onClick={handleClearSearch}>
              <img src={closeIcon} />
            </ClearIcon>
          )}
        </Search>
        <Button onClick={() => navigate('/create-course')} style={{ display: sessionUser.userRole == 'Student' ? 'none' : 'block' }}
          backgroundColor='var(--success-color)' margin='0 0 0 auto' width='120px'>
          Tạo khóa học
        </Button>
      </Toolbar>
      <CoursesWrapper>
        {courses.length === 0 ? (
          <p>Không có khóa học nào để hiển thị.</p>
        ) : (
          courses.map((course) => (
            <CourseCard key={course.courseId} onClick={() => { localStorage.setItem('selectedCourse', JSON.stringify(course)); navigate('/course-detail') }}>
              <H3>{course.courseName}</H3>
              <InlineFlex>
                <InfoIcon src={instructorIcon} />
                <p>{course.userFullName}</p>
              </InlineFlex>
              <InlineFlex>
                <InfoIcon src={calendarIcon} />
                <p>
                  {course.courseStartDate && dayjs(course.courseStartDate).isValid() ? dayjs(course.courseStartDate).format('DD/MM/YYYY') : ''} -&nbsp;
                  {course.courseEndDate && dayjs(course.courseEndDate).isValid() ? dayjs(course.courseEndDate).format('DD/MM/YYYY') : ''}
                </p>
              </InlineFlex>
              <InlineFlex>
                <InfoIcon src={registrantIcon} />
                <p>{course.totalEnrollments}/{course.courseMaxStudent}</p>
              </InlineFlex>
              <InlineFlex>
                <InfoIcon src={sellIcon} />
                <p style={{ color: 'var(--danger-color)' }}>{course.coursePrice?.toLocaleString()} VND</p>
              </InlineFlex>
              <InlineFlex>
                <Button
                disabled={waitProcess || course.enrollmentStatus === 'Completed'}
                margin='6px 0 0 0'
                style={{ display: sessionUser.userRole != 'Student' ? course.courseStatus != 'Publish' && course.totalEnrollments <= 0 ? 'block' : 'none' : 'block',
                color: course.enrollmentStatus === 'Completed' ? 'var(--text-color)' : 'var(--white-color)' }}
                backgroundColor={sessionUser.userRole != 'Student' ? 'var(--danger-color)' : (course.enrollmentStatus === 'Enrolled' ? 'var(--danger-color)' :
                course.enrollmentStatus === 'Canceled' ? 'var(--success-color)' : course.enrollmentStatus === 'Completed' ? '#dcdcdc' : 'var(--primary-color)')}
                onClick={(e) => handleButtonCourse(e, course)}
              >
                {sessionUser.userRole != 'Student' ? 'Xóa' : course.enrollmentStatus === 'Completed' ? 'Đã hoàn thành' :
                course.enrollmentStatus === 'Enrolled' ? (waitProcess === course.courseId ? 'Đang hủy...' : 'Hủy đăng ký') :
                (waitProcess === course.courseId ? 'Đang đăng ký...' : 'Đăng ký')}
              </Button>
              </InlineFlex>
            </CourseCard>
          ))
        )}
      </CoursesWrapper>
    </Wrapper>
  );
};

export default Courses;
