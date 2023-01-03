import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Dashboard from "./scenes/Dashboard";
import Settings from "./scenes/settings/Settings";

// admin
import Instructors from "./scenes/admin/Instructors";
import Students from "./scenes/admin/Students";
import Stations from "./scenes/admin/Stations";
import HostClass from "./scenes/admin/HostClass";
import AddInstructor from "./scenes/admin/AddInstructor";

// teacher
import TodaysClassesOfTeacher from "./scenes/teacher/TodaysClassesOfTeacher";
// student
import TodaysClassesOfStudent from "./scenes/student/TodaysClassesOfStudent";

// new files v
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./scenes/NotFound";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import RequireAuth from "./auth/RequireAuth";
import NotRequireAuth from "./auth/NotRequireAuth";

// components for live class
import StartClassAsTeacher from "./scenes/teacher/StartClassAsTeacher";
import StartClassAsStudent from "./scenes/student/StartClassAsStudent";

function App() {
  const userType = useSelector((state) => state.type);
  // console.log(userType);

  return (
    <>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<DashboardPage />}>
            <Route index element={<Dashboard />} />

            {/*admin*/}
            <Route path="instructors" element={<Instructors />} />
            <Route path="students" element={<Students />} />
            <Route path="stations" element={<Stations />} />
            <Route path="host_class" element={<HostClass />} />
            <Route path="add_intructor" element={<AddInstructor />} />

            {/*teacher & student */}

            <Route
              path="classes"
              element={
                userType === "teacher" ? (
                  <TodaysClassesOfTeacher />
                ) : (
                  <TodaysClassesOfStudent />
                )
              }
            />
            <Route
              path="live-class"
              element={
                userType === "teacher" ? (
                  <StartClassAsTeacher />
                ) : (
                  <StartClassAsStudent />
                )
              }
            />

            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>

        <Route element={<NotRequireAuth />}>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
