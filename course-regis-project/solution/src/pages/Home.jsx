import styled from 'styled-components';
import { useUser } from '../App';
import Courses from '../components/Courses';
import Footer from '../components/Footer';
import Header from '../components/Header';

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
`;

const Home = () => {
  const { sessionUser } = useUser();
  return (
    <Wrapper>
        <Header sessionUser={sessionUser}/>
        <Main>
          <Courses />
        </Main>
        <Footer />
    </Wrapper>
  );
};

export default Home;
