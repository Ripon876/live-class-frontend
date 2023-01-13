import { ColorModeContext, useMode } from "../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Route, Routes, Outlet } from "react-router-dom";
import Topbar from "../global/Topbar";
import AppSidebar from "../global/Sidebar";
import { ProSidebarProvider } from "react-pro-sidebar";
import { useSelector } from "react-redux";
import JoinExam from "../scenes/Dashboard/JoinExam";

function DashboardPage() {
	const [theme, colorMode] = useMode();
	const userType = useSelector((state) => state.user.type);
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
							{userType !== "admin" && <JoinExam />}
							<div>
								<img
									src="./logo.png"
									className="img-fluid me-2 mt-1 p-1 position-absolute sticky-bottom"
									style={{
										right: "5px",
										bottom: "5px",
										maxWidth: "170px",
									}}
								/>
							</div>
						</main>
					</div>
				</ProSidebarProvider>
			</ThemeProvider>
		</ColorModeContext.Provider>
	);
}

export default DashboardPage;
