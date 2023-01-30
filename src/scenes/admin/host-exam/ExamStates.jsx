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
	// { type: 'student', cd: { name: 's2' }, ex: { name: 'Ex 1' } }
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: "90%" }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>#</TableCell>
						<TableCell align="right">Student</TableCell>
						<TableCell align="right">Teacher</TableCell>
						<TableCell align="right">*</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{states?.map((state, i) => (
						<TableRow
							key={"mdfhdf" + i}
							sx={{
								"&:last-child td, &:last-child th": {
									border: 0,
								},
							}}
						>
							<TableCell component="th" scope="row">
								{i + 1}
							</TableCell>
							<TableCell align="right">{state.cd.name}</TableCell>
							<TableCell align="right">{state.ex.name}</TableCell>
							<TableCell align="right">
								<Button
									size="small"
									sx={{
										boxShadow: 3,
										pt: "10px",
										pb: "10px",
									}}
									onClick={() => {
										window.location.href = `/inspect-exam?id=${state.exam}`;
									}}
									variant="filled"
									startIcon={<RemoveRedEyeIcon />}
								>
									Inspect Exam
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
