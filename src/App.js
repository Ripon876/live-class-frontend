import "./App.css";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./scenes/Dashboard";
import Instructors from "./scenes/Instructors";
import Students from "./scenes/Students";
import Stations from "./scenes/Stations";
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
import RequireAuth from "./requireAuth/RequireAuth";
import NotRequireAuth from "./auth/NotRequireAuth";

function App() {
  return (
    <>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<DashboardPage />}>
            <Route index element={<Dashboard />} />
            <Route path="instructors" element={<Instructors />} />
            <Route path="students" element={<Students />} />
            <Route path="stations" element={<Stations />} />
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
