import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/system";
import Header from "../../components/Header";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import RemainingTime from "./RemainingTime";
import JoinExam from "./JoinExam";
import Requirements from "./Requirements";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const userType = useSelector((state) => state.user.type);
  const [show, setShow] = useState(false);
  const [requirements, setR] = useState({
    mic: false,
    camera: false,
    connection: false,
    speed: false,
  });

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your Dashboard" />
      </Box>
      {userType !== "admin" &&
        !Object.values(requirements).every((item) => item) && (
          <Requirements rq={requirements} srq={setR} />
        )}
      {Object.values(requirements).every((item) => item) && (
        <>
          {userType !== "admin" && <RemainingTime />}
          {userType !== "admin" && <JoinExam />}
        </>
      )}
    </Box>
  );
};

export default Dashboard;
