import { useState } from "react";
import { Sidebar, Menu, MenuItem, useProSidebar } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import AssignmentTurnedInOutlinedIcon from "@mui/icons-material/AssignmentTurnedInOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MenuOpenOutlinedIcon from "@mui/icons-material/MenuOpenOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import ClassIcon from "@mui/icons-material/Class";
import { useSelector } from "react-redux";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.primary[100] }}
      onClick={() => setSelected(title)}
      icon={icon}
      routerLink={<Link to={to} />}
    >
      <Typography>{title}</Typography>
    </MenuItem>
  );
};

const AppSidebar = () => {
  const userType = useSelector((state) => state.user.type);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState(false);
  const { collapseSidebar, collapsed } = useProSidebar();
  return (
    <Box
      sx={{
        "& .ps-sidebar-container": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          background: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .ps-menuitem-root.ps-active span": {
          color: "#6870fa !important",
        },
      }}
    >
      <Sidebar style={{ height: "100vh" }}>
        {collapsed ? (
          <Box textAlign="center" style={{ color: colors.primary[100] }}>
            <IconButton
              onClick={() => {
                collapseSidebar();
              }}
            >
              <MenuOutlinedIcon />
            </IconButton>
          </Box>
        ) : (
          <Box display="flex" justifyContent="space-between">
            <Box>
              <IconButton
                onClick={() => {
                  collapseSidebar();
                }}
              >
                <MenuOpenOutlinedIcon style={{ color: colors.primary[100] }} />
              </IconButton>
            </Box>
            <Typography
              variant="h4"
              pr={4}
              style={{ color: colors.primary[100] }}
            >
              {userType === "admin" && "Admin"}
              {userType === "teacher" && "Examiner"}
              {userType === "student" && "Candidate"}
              {userType === "roleplayer" && "Roleplayer"}
            </Typography>
          </Box>
        )}

        <Menu>
          <Item
            title="Dashboard"
            to="/"
            setSelected={setSelected}
            selected={selected}
            icon={<HomeOutlinedIcon />}
          />

          {/* admin */}

          {userType === "admin" ? (
            <>
              <Item
                title="Candidates"
                to="/students"
                setSelected={setSelected}
                selected={selected}
                icon={<SchoolOutlinedIcon />}
              />
              <Item
                title="Examiners"
                to="/instructors"
                setSelected={setSelected}
                selected={selected}
                icon={<PersonOutlinedIcon />}
              />
              <Item
                title="Manage Examiners"
                to="/manage_examiners"
                setSelected={setSelected}
                selected={selected}
                icon={<ManageAccountsIcon />}
              />
              <Item
                title="Manage Roleplayers"
                to="/manage_roleplayers"
                setSelected={setSelected}
                selected={selected}
                icon={<ManageAccountsIcon />}
              />
              <Item
                title="Host Exam"
                to="/host_exam"
                setSelected={setSelected}
                selected={selected}
                icon={<ClassIcon />}
              />
            </>
          ) : (
            <Item
              title="Today's Exams"
              to="/classes"
              setSelected={setSelected}
              selected={selected}
              icon={<ClassIcon />}
            />
          )}
          {userType === "student" && (
            <Item
              title="Results"
              to="/result"
              setSelected={setSelected}
              selected={selected}
              icon={<AssignmentTurnedInOutlinedIcon />}
            />
          )}
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default AppSidebar;
