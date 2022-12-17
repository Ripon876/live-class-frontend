import { ColorModeContext, useMode } from "../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes,Outlet } from 'react-router-dom';
import Topbar from "../global/Topbar";
import AppSidebar from "../global/Sidebar";
import { ProSidebarProvider } from "react-pro-sidebar";
import Dashboard from "../scenes/Dashboard";
import Instructors from "../scenes/Instructors";
import Students from "../scenes/Students";
import Stations from '../scenes/Stations';

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
							{/*<Routes>
								<Route path="/" element={<Dashboard />} />
								<Route
									path="/instructors"
									element={<Instructors />}
								/>
								<Route
									path="/students"
									element={<Students />}
								/>
								<Route
									path="/stations"
									element={<Stations />}
								/>
							</Routes>*/}
							<Outlet />
						</main>
					</div>
				</ProSidebarProvider>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

export default DashboardPage;
