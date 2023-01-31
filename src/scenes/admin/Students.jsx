import { useState, useEffect } from "react";
import { Box, Typhography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { mockDataContacts } from "../../data/mockdata";
import Header from "../../components/Header";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [alert, setAlert] = useState({
    show: false,
    type: "success",
    msg: "",
  });
  useEffect(() => {
    getCandidates();
  }, []);

  const removeCandidate = (id) => {
    axios
      .delete(process.env.REACT_APP_SERVER_URL + "/admin/remove-instructor", {
        data: {
          id: id,
        },
      })
      .then((data) => {
        getCandidates();
        setAlert({
          show: true,
          type: "success",
          msg: data.data.message,
        });
      })
      .catch((err) => {
        console.log("err : ", err);
        setAlert({
          show: true,
          type: "error",
          msg: err.data.message,
        });
      });
  };

  const getCandidates = () => {
    axios
      .get(process.env.REACT_APP_SERVER_URL + "/admin/get-students")
      .then((data) => {
        data.data.students.map((user, i) => (user.id = i + 1));
        setStudents([...data.data.students]);
      })
      .catch((err) => console.log("err :", err));
  };

  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },

    {
      field: "actioin",
      headerName: "Action",
      flex: 0.5,
      cellClassName: "me-5  pe-5",
      renderCell: (params) => {
        return (
          <Button
            variant="contained"
            component="label"
            className="BTN"
            size="small"
            sx={{
              boxShadow: 3,
            }}
            onClick={() => {
              console.log(params.row);
              removeCandidate(params.row._id);
            }}
          >
            Remove
          </Button>
        );
      },
    },
  ];
  return (
    <div style={{ overflowY: "auto", maxHeight: "90%" }}>
      <Box m="20px">
        <Header title="Candidates" subtitle="Manage Candidates" />
        <Snackbar
          open={alert.show}
          autoHideDuration={6000}
          onClose={() => {
            setAlert({
              msg: "",
              type: "",
              show: false,
            });
          }}
        >
          <Alert severity={alert.type} sx={{ mb: 2 }}>
            {alert.msg}
          </Alert>
        </Snackbar>
        <Box m="40px 0 0 0" height="70vh">
          <DataGrid rows={students} columns={columns} />
        </Box>
      </Box>
    </div>
  );
};

export default Students;
