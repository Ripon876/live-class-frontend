import BreakTimer from "./teacher/BreakTimer";
import MoodIcon from "@mui/icons-material/Mood";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function StatetMsgs({ state, breakTime, role }) {
	return (
		<div>
			{state?.delay && (
				<h3 style={{ marginTop: "300px", textAlign: "center" }}>
					{role === "cd" ? (
						<>Taking you to next station</>
					) : (
						<> Waiting for next candidate</>
					)}

					<BreakTimer ct={Date.now()} rt={0.5} />
				</h3>
			)}
			{/* break  time*/}
			{state?.break && (
				<h3 style={{ marginTop: "300px", textAlign: "center" }}>
					Exam will continue after{" "}
					<BreakTimer ct={Date.now()} rt={breakTime || 0} />
				</h3>
			)}
			{/* all station ended */}
			{state?.allStationEnd && (
				<div>
					<div className="text-center">
						<MoodIcon
							style={{ fontSize: "200px" }}
							mt="50px"
							color="success"
						/>
						<Typography variant="h2" mb="20px">
							No More Exams Left Today
						</Typography>
						<a href="/" style={{ textDecoration: "none" }}>
							<Button variant="contained" size="large">
								Back to dashboard
							</Button>
						</a>
					</div>
				</div>
			)}
		</div>
	);
}

export default StatetMsgs;
