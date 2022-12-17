import { ColorModeContext, useMode } from "../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes,Outlet } from 'react-router-dom';
import Topbar from "../global/Topbar";
import AppSidebar from "../global/Sidebar";
import { ProSidebarProvider } from "react-pro-sidebar";


function DashboardPage() {
	const [theme, colorMode] = useMode();

	return (
		<ColorModeContext.Provider value={colorMode}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<ProSidebarProvider>
					<div className="app">
						<AppSidebar />
						<main className="content">
							<Topbar />
							<Outlet />
						</main>
					</div>
				</ProSidebarProvider>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

export default DashboardPage;
