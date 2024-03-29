import { useState, useEffect } from "react";
import { Box, Typhography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";

const Instructors = ({ instructors, rE }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (!instructors) {
    instructors = [];
  }
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
              rE(params.row._id);
            }}
          >
            Remove
          </Button>
        );
      },
    },
  ];
  return (
    <Box m="20px">
      <Box m="40px 0 0 0" height="70vh">
        <DataGrid rows={instructors} columns={columns} />
      </Box>
    </Box>
  );
};

export default Instructors;
