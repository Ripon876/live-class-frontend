import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function ExamsTable({ exams, dltExm }) {
	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: "90%" }} aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Title</TableCell>
						<TableCell align="right">Teacher</TableCell>
						<TableCell align="right">Exam Duration</TableCell>
						<TableCell align="right">Start Time</TableCell>
						<TableCell align="right">Status</TableCell>
						<TableCell align="right">Actions</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{exams?.map((singleClass, i) => (
						<TableRow
							key={"jhs45df" + i}
							sx={{
								"&:last-child td, &:last-child th": {
									border: 0,
								},
							}}
						>
							<TableCell component="th" scope="row">
								{singleClass?.title}
							</TableCell>
							<TableCell align="right">
								{singleClass?.teacher?.name}
							</TableCell>
							<TableCell align="right">
								{singleClass?.classDuration}
							</TableCell>
							<TableCell align="right">
								{new Date(singleClass?.startTime)
									.toLocaleTimeString()
									.slice(0, 4) +
									" " +
									new Date(singleClass?.startTime)
										.toLocaleTimeString()
										.slice(8)}
							</TableCell>
							<TableCell align="right">
								{singleClass?.status}
							</TableCell>
							<TableCell align="right">
								<div>
									<Button
										variant="contained"
										component="label"
										size="small"
										className="BTN"
										sx={{
											boxShadow: 3,
										}}
										startIcon={<AssignmentIcon />}
										onClick={() => {
											window.location.href =
												"/exam-details?id=" +
												singleClass._id;
										}}
									>
										See Details
									</Button>
								</div>
								<div className='mt-1'>
									<Button
										variant="contained"
										component="label"
										size="small"
										className="BTN"
										sx={{
											boxShadow: 3,
										}}
										 
										startIcon={<DeleteIcon />}
										onClick={() => {
											dltExm(singleClass._id);
										}}
									>
										Delete
									</Button>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default ExamsTable;
