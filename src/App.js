import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Dashboard from "./scenes/Dashboard";
import Settings from "./scenes/settings/Settings";

// admin
import Instructors from "./scenes/admin/Instructors";
import Students from "./scenes/admin/Students";
import Stations from "./scenes/admin/Stations";
import HostExam from "./scenes/admin/host-exam/HostExam";
import MangeExaminers from "./scenes/admin/MangeExaminers";
import MangeRoleplayers from "./scenes/admin/MangeRoleplayers";

// teacher
import TodaysClassesOfTeacher from "./scenes/teacher/TodaysClassesOfTeacher";
// student
import TodaysClassesOfStudent from "./scenes/student/TodaysClassesOfStudent";
// roleplayer
import TodaysClassesOfRoleplayer from "./scenes/roleplayer/TodaysClassesOfRoleplayer";

// new files v
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./scenes/NotFound";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import RequireAuth from "./auth/RequireAuth";
import NotRequireAuth from "./auth/NotRequireAuth";

// components for live class
import StartClassAsTeacher from "./scenes/teacher/StartClassAsTeacher";
import StartClassAsStudent from "./scenes/student/start-class/StartClassAsStudent";
import JoinExam from "./scenes/roleplayer/JoinExam";

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
            <Route path="host_exam" element={<HostExam />} />
            <Route path="manage_examiners" element={<MangeExaminers />} />
            <Route path="manage_roleplayers" element={<MangeRoleplayers />} />

            {/*teacher & student */}

            <Route
              path="classes"
              element={
                userType === "teacher" ? (
                  <TodaysClassesOfTeacher />
                ) : userType === "roleplayer" ? (
                  <TodaysClassesOfRoleplayer />
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
                ) : userType === "roleplayer" ? (
                  <JoinExam />
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
