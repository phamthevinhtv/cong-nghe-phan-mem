import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Personal from "@/pages/Personal";
import CourseEdit from "@/pages/CourseEdit";
import CourseDetail from "@/pages/CourseDetail";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ErolledStudents from "@/pages/ErolledStudents";
import ResetPassword from "@/pages/ResetPassword";
import RequestResetPassword from "@/pages/RequestResetPassword";
import {
  GuestRoute,
  ResetPasswordRoute,
  RoleRoute,
  AuthRoute,
} from "@/components/RouteController";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/personal"
          element={
            <AuthRoute>
              <Personal />
            </AuthRoute>
          }
        />
        <Route
          path="/course-edit"
          element={
            <RoleRoute allowRoles={["admin", "teacher"]}>
              <CourseEdit />
            </RoleRoute>
          }
        />
        <Route path="/course-detail/:courseId" element={<CourseDetail />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          path="/request-reset-password"
          element={
            <GuestRoute>
              <RequestResetPassword />
            </GuestRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ResetPasswordRoute>
              <ResetPassword />
            </ResetPasswordRoute>
          }
        />
        <Route
          path="/students-enrolled/:courseId"
          element={
            <AuthRoute>
              <ErolledStudents />
            </AuthRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
