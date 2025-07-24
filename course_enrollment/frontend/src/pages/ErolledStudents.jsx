import { useParams } from "react-router-dom";
import styled from "styled-components";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useState, useEffect } from "react";
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

const H2 = styled.h2`
  font-size: var(--font-size-large);
  margin-bottom: 12px;
  font-weight: 500;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  min-width: 576px;
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

const StudentsErolled = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { courseId } = useParams();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `http://localhost:5000/api/course/${courseId}/students`
        );
        setStudents(res.data.students || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [courseId]);

  return (
    <Wrapper>
      <Header />
      <Main>
        <MainContent>
          <H2>Danh sách học viên</H2>
          {loading ? (
            <div style={{ textAlign: "center", margin: "24px 0" }}>
              Đang tải...
            </div>
          ) : error ? (
            <div
              style={{ color: "red", textAlign: "center", margin: "24px 0" }}
            >
              {error}
            </div>
          ) : (
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <Th style={{ width: "50px" }}>STT</Th>
                    <Th style={{ width: "200px" }}>Tên</Th>
                    <Th style={{ width: "250px" }}>Email</Th>
                    <Th style={{ width: "120px" }}>Số điện thoại</Th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((student, index) => (
                      <Tr key={`${student.userEmail}-${index}`}>
                        <Td style={{ textAlign: "center", width: "50px" }}>
                          {index + 1}
                        </Td>
                        <Td style={{ width: "220px" }}>
                          {student.userFullName}
                        </Td>
                        <Td style={{ width: "260px" }}>{student.userEmail}</Td>
                        <Td style={{ width: "140px" }}>
                          {student.userPhoneNumber}
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td
                        colSpan="4"
                        style={{ textAlign: "center", padding: "8px" }}
                      >
                        Không có dữ liệu
                      </Td>
                    </Tr>
                  )}
                </tbody>
              </Table>
            </TableWrapper>
          )}
        </MainContent>
      </Main>
      <Footer />
    </Wrapper>
  );
};

export default StudentsErolled;
