import styled from 'styled-components';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useUser } from '../App';
import CourseEditor from '../components/CourseEditor';
import ViewCourse from '../components/ViewCourse';
import { useState } from 'react';
import Button from '../components/Button';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  width: 1248px;
  flex: 1;
  margin: 86px auto 24px auto;
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

const CreateCourse = () => {
  const { sessionUser } = useUser();
  const [isView, setIsView] = useState(false); 

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
  });

  return (
    <Wrapper>
        <Header sessionUser={sessionUser}/>
        <Main>
        <div style={{ display: isView ? 'block' : 'none' }}>
          <ViewCourse form={form} isUpdate={false} />
        </div>
        <ButtonBox>
          <ButtonMod style={{ color: "var(--text-color)", display: sessionUser.userRole != 'Student' ? (isView ? 'block' : 'none') : 'none' }} 
          backgroundColor='#dcdcdc' onClick={() => setIsView(false)}>
            Trở lại
        </ButtonMod>
        </ButtonBox>
        <div style={{ display: isView ? 'none' : 'block' }}>
          <CourseEditor form={form} setForm={setForm} mode='Create' setIsView={setIsView} />
        </div>
        </Main>
        <Footer />
    </Wrapper>
  );
};

export default CreateCourse;
