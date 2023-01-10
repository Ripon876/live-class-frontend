import { useState, useEffect } from "react";
import { Box, Typhography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { mockDataContacts } from "../../data/mockdata";
import Header from "../../components/Header";

const Students = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/admin/get-students")
      .then((data) => {
        data.data.students.map((user, i) => (user.id = i + 1));
        setStudents([...data.data.students]);
      })
      .catch((err) => console.log("err :", err));
  }, []);

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      headerAlign: "left",
      align: "left",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
    },
  ];
  return (
    <Box m="20px">
      <Header title="Candidates" subtitle="Manage The Candidates" />

      <Box m="40px 0 0 0" height="70vh">
        <DataGrid rows={students} columns={columns} />
      </Box>
    </Box>
  );
};

export default Students;
