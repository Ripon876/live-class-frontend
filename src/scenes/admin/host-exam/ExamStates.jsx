import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

function ExamStates({ states }) {
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: "90%" }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>#</TableCell>
						<TableCell align="right">Student</TableCell>
						<TableCell align="right">Subject</TableCell>
						<TableCell align="right">Teacher</TableCell>
						<TableCell align="right">*</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{states?.map((state, i) => (
						<TableRow
							sx={{
								"&:last-child td, &:last-child th": {
									border: 0,
								},
							}}
						>
							<TableCell component="th" scope="row">
								{i + 1}
							</TableCell>
							<TableCell align="right">{state.student}</TableCell>
							<TableCell align="right">
								{state.cls.subject}
							</TableCell>
							<TableCell align="right">
								{state.cls.teacher}
							</TableCell>
							<TableCell align="right">
								<Button
									size="normal"
									variant="filled"
									sx={{
										boxShadow: 3,
										pt: "10px",
										pb: "10px",
									}}
									onClick={() => {
										window.location.href = `/inspect-exam?id=${state.cls._id}`;
									}}
								>
									<Typography variant="h3">
										<RemoveRedEyeIcon /> Inspect Exams
									</Typography>
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default ExamStates;
