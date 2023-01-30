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
import InspectExam from "./scenes/admin/InspectExam";
import MangeExaminers from "./scenes/admin/MangeExaminers";
import MangeRoleplayers from "./scenes/admin/MangeRoleplayers";
import ExamDetails from "./scenes/admin/ExamDetails";

// teacher
import TodaysClassesOfTeacher from "./scenes/teacher/TodaysClassesOfTeacher";

import ExamV2E from "./scenes/teacher/ExamV2";
// student
import TodaysClassesOfStudent from "./scenes/student/TodaysClassesOfStudent";
import ExamV2C from "./scenes/student/ExamV2";
import Result from "./scenes/student/result/Result";
// roleplayer
import TodaysClassesOfRoleplayer from "./scenes/roleplayer/TodaysClassesOfRoleplayer";

import ExamV2R from "./scenes/roleplayer/ExamV2";

// new files v
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./scenes/NotFound";
import Register from "./components/register/Register";
import Login from "./components/login/Login";
import RequireAuth from "./auth/RequireAuth";
import NotRequireAuth from "./auth/NotRequireAuth";

// components for live class
 
import StartClassAsStudent from "./scenes/student/start-class/StartClassAsStudent";
import JoinExam from "./scenes/roleplayer/JoinExam";

function App() {
  const userType = useSelector((state) => state.user.type);
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
            <Route path="inspect-exam" element={<InspectExam />} />
            <Route path="exam-details" element={<ExamDetails />} />

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

            {/* <Route
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
            /> */}
            {/*    <Route
              path="live-class"
              element={
                userType === "teacher" ? (
                  <ExamE />
                ) : userType === "roleplayer" ? (
                  <ExamR />
                ) : (
                  <ExamC />
                )
              }
            />  */}
            <Route
              path="live-class"
              element={
                userType === "teacher" ? (
                  <ExamV2E />
                ) : userType === "roleplayer" ? (
                  <ExamV2R />
                ) : (
                  <ExamV2C />
                )
              }
            />
            <Route
              path="result"
              element={userType === "student" && <Result />}
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
