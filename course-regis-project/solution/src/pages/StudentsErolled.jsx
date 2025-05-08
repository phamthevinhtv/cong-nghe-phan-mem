import styled from 'styled-components';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Button from '../components/Button';
import { useUser } from '../App';
import { useState, useEffect } from 'react';
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

const TableWrapper = styled.div`
  overflow-x: auto;  
`;

const Table = styled.table`
  min-width: 760px;
  width: 100%;
  border-collapse: collapse;
  border: var(--border-normal);
`;

const Th = styled.th`
  background-color: #f5f5f5;
  padding: 8px;
  font-weight: 500;
  border: var(--border-normal);
`;

const Td = styled.td`
  padding: 8px;
  border: var(--border-normal);
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f5f5f5;
  }
`;

const ButtonBox = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 24px;
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

const StudentsErolled = () => {
  const { sessionUser } = useUser();
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const getStudentsEnrolled = async () => {
    const storedCourse = localStorage.getItem('selectedCourse');
    if (storedCourse) {
      const selectedCourse = JSON.parse(storedCourse);

      try {
        console.log(selectedCourse.courseId);

        const response = await axios.get(`http://localhost:5000/api/course/${selectedCourse.courseId}/students`, { withCredentials: true });
        if (response.data.students) {
          setStudents(response.data.students);
        }
      } catch (err) {
        console.error('Lỗi khi lấy thông tin học viên đã đăng ký:', err);
      }
    } else {
      navigate('/home');
    }
  };

  useEffect(() => {
    getStudentsEnrolled();
  }, []);
  return (
    <Wrapper>
      <Header sessionUser={sessionUser} />
      <Main>
        <H2>Danh sách học viên</H2>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th style={{ width: '50px' }}>STT</Th>
                <Th>Tên</Th>
                <Th>Email</Th>
                <Th>Giới tính</Th>
                <Th>Số điện thoại</Th>
                <Th>Địa chỉ</Th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student, index) => (
                  <Tr key={`${student.id}-${index}`}>
                    <Td style={{ textAlign: 'center', width: '50px' }}>{index + 1}</Td>
                    <Td>{student.userFullName}</Td>
                    <Td>{student.userEmail}</Td>
                    <Td>{student.userGender}</Td>
                    <Td>{student.userPhoneNumber}</Td>
                    <Td>{student.userAddress}</Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="6" style={{ textAlign: 'center', padding: '8px' }}>
                    Không có dữ liệu
                  </Td>
                </Tr>
              )}
            </tbody>
          </Table>
        </TableWrapper>
        <ButtonBox>
          <ButtonMod backgroundColor='#dcdcdc' style={{ color: "var(--text-color)" }} onClick={() => navigate(-1)}>Trở lại</ButtonMod>
        </ButtonBox>
      </Main>
      <Footer />
    </Wrapper>
  );
};

export default StudentsErolled;
