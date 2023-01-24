import React from "react";
import { Box, Icon, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../theme";
import { InputBase } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";

import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies([]);

  const logOut = () => {
    removeCookie("token");
    removeCookie("userType");
    navigate("/login");
  };

  const settings = () => {
    navigate("/settings");
  };

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box
        display="flex"
        color={colors.primary[100]}
        borderRadius="3px"
        border="2px solid"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>
      <Box>
        {/*<IconButton onClick={colorMode.toggleColorMode} className='colorModeIcon'>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlinedIcon />
          ) : (
            <DarkModeOutlinedIcon />
          )}
        </IconButton>*/}
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton onClick={settings}>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
        <IconButton onClick={logOut}>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
