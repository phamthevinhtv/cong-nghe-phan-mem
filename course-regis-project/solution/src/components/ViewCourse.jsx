import styled from 'styled-components';
import dayjs from 'dayjs';
import Link from './Link';
import { useUser } from '../App';

const H1 = styled.h1`
  font-size: 3.2rem;
  font-weight: 500;
`;

const Hr = styled.hr`
  border: none;
  border-top: var(--border-normal);
  margin: 12px 0;
`;

const Description = styled.div`
  margin: 24px 0;
`;

const Info = styled.div`
  line-height: 1.5;
`;

const B = styled.b`
  font-weight: 500;
`;

const ViewCourse = ({ form }) => {
  const { sessionUser } = useUser();

  return (
    <>
        <H1>{form.courseName || 'Tên khóa học'}</H1>
        <Hr />
        <Info>
            <p><B>Người hướng dẫn:</B> {form.userFullName || 'Tên người hướng dẫn'}</p>
            <p>
                <B>Thời gian dự kiến:</B> từ&nbsp; 
                {form.courseStartDate && dayjs(form.courseStartDate).isValid() ? dayjs(form.courseStartDate).format('DD/MM/YYYY') : '.../.../...'} &nbsp;đến&nbsp; 
                {form.courseEndDate && dayjs(form.courseEndDate).isValid() ? dayjs(form.courseEndDate).format('DD/MM/YYYY') : '.../.../...'}
            </p>
            <p><B>Số lượng học viên đã đăng ký:</B> {form.totalEnrollments}/{form.courseMaxStudent}&nbsp;
            <i style={{ display: sessionUser.userRole != 'Student' ? 'inline-block' : 'none'}}><Link to="/students-enrolled" color='var(--primary-color)' hoverUnderline="true">(Xem danh sách)</Link></i>
            </p>
            <p><B>Giá khóa học:</B> {form.coursePrice?.toLocaleString()} VND</p>
        </Info>
        <Hr />
        <Description dangerouslySetInnerHTML={{ __html: form.courseDescription || 'Chưa có mô tả khóa học' }}></Description>
        <Hr style={{ display: sessionUser.userRole != 'Student' ? 'block' : 'none', marginBottom: '24px' }} />
    </>
  );
};

export default ViewCourse;
