import React from "react";
import { Box, Typhography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { mockDataContacts } from "../data/mockdata";
import Header from "../components/Header";
const Students = () => {
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name"
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
  {
    field: "address",
    headerName: "Address",
    flex: 1
  },
  {
    field: "city",
    headerName: "City",
    flex: 1
  },
  ];
  return (
    <Box m="20px">
      <Header title="Students" subtitle="Manage The Students" />

      <Box m="40px 0 0 0" height="70vh">
        <DataGrid rows={mockDataContacts} columns={columns} />
      </Box>
    </Box>
  );
};

export default Students;
