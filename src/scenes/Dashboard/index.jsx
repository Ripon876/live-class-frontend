import { Box } from "@mui/system";
import React from "react";
import Header from "../../components/Header";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import RemainingTime from "./RemainingTime";

const Dashboard = () => {
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your Dashboard" />
      </Box>
      <RemainingTime />
    </Box>
  );
};

export default Dashboard;
