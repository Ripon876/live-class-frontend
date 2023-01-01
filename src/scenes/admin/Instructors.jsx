import { useState, useEffect } from "react";
import { Box, Typhography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { tokens } from "../../theme";
import { mockData } from "../../data/mockdata";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";

const Instructors = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [instructors, setInstructors] = useState([]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/admin/get-teachers")
      .then((data) => {
        data.data.teachers.map((user, i) => (user.id = i + 1));
        setInstructors([...data.data.teachers]);

        console.log(data.data.teachers);
      })
      .catch((err) => console.log("err :", err));
  }, []);

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
  ];
  return (
    <Box m="20px">
      <Header title="Instructors" subtitle="Manage The Instructors" />

      <Box m="40px 0 0 0" height="70vh">
        {/*<DataGrid rows={mockData} columns={columns} />*/}
        <DataGrid rows={instructors} columns={columns} />
      </Box>
    </Box>
  );
};

export default Instructors;
