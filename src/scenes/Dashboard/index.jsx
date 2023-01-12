import { Box } from "@mui/system";
import React from "react";
import Header from "../../components/Header";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import RemainingTime from "./RemainingTime";
import JoinExam from "./JoinExam";
import Requirements from "./Requirements";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const userType = useSelector((state) => state.type);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your Dashboard" />
      </Box>
      {userType !== "admin" && <RemainingTime />}
      {/*{userType !== "admin" && <Requirements />}*/}
      {userType !== "admin" && <JoinExam />}
    </Box>
  );
};

export default Dashboard;
