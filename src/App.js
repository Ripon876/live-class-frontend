import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

import Dashboard from "./scenes/Dashboard";
// admin
import Instructors from "./scenes/admin/Instructors";
import Students from "./scenes/admin/Students";
import Stations from "./scenes/admin/Stations";
import HostClass from "./scenes/admin/HostClass";

// teacher
import TodaysClassesOfTeacher from "./scenes/teacher/TodaysClassesOfTeacher";

// teacher
import TodaysClassesOfStudent from "./scenes/student/TodaysClassesOfStudent";

// import Bar from './scenes/bar'
// import Form from './scenes/form'
// import Pie from './scenes/pie'
// import Line from './scenes/line'
// import Geography from './scenes/geography'

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
  console.log(userType);

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
