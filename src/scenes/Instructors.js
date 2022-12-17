import React from "react";
import { Box, Typhography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import { mockData } from "../data/mockdata";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../components/Header";
const Instructors = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align:"left",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
    field: "email",
    headerName: "Email",
    flex: 1
  },
  ];
  return (
    <Box m="20px">
      <Header title="Instructors" subtitle="Manage The Instructors" />

      <Box m="40px 0 0 0" height="70vh">
        <DataGrid rows={mockData} columns={columns} />
      </Box>
    </Box>
  );
};

export default Instructors;
