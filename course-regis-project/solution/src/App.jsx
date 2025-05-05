import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreateCourse from './pages/CreateCourse';
import CourseDetail from './pages/CourseDetail';
import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

function App() {
  const [sessionUser, setSessionUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/session', { withCredentials: true });
        if (response.data.loggedIn) {
          setSessionUser(response.data.user);
        } else {
          setSessionUser(null);
          localStorage.removeItem('selectedCourse');
        }
      } catch (err) {
        console.error('Lỗi khi lấy thông tin người dùng:', err);
        setSessionUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  if (loading) return <div>Đang kiểm tra đăng nhập...</div>;

  return (
    <UserContext.Provider value={{ sessionUser, setSessionUser }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={sessionUser ? "/home" : "/login"} />} />
          <Route path="/login" element={sessionUser ? <Navigate to="/home" /> : <Login />} />
          <Route path="/register" element={sessionUser ? <Navigate to="/home" /> : <Register />} />
          <Route path="/forgot-password" element={sessionUser ? <Navigate to="/home" /> : <ForgotPassword />} />
          <Route path="/home" element={sessionUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/profile" element={sessionUser ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/create-course" element={sessionUser && sessionUser.userRole != 'Student' ? <CreateCourse /> : <Navigate to="/login" />} />
          <Route path="/course-detail" element={sessionUser ? <CourseDetail /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
