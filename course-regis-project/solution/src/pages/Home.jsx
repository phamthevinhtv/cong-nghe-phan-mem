import styled from 'styled-components';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useUser } from '../App';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Main = styled.main`
  width: 1248px;
  flex: 1;
  margin: 120px auto 48px auto;
`;

const Home = () => {
  const { sessionUser } = useUser();
  return (
    <Wrapper>
        <Header sessionUser={sessionUser}/>
        <Main></Main>
        <Footer />
    </Wrapper>
  );
};

export default Home;
