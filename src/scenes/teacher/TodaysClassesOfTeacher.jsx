import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


function TodaysClassesOfTeacher() {
	return (
		<div style={{ overflowY: "scroll", maxHeight: "90%" }}>
			<Box component="div" m="40px 40px " width="90%" p="0 0 0 20px">
				<Typography variant="h4" mb="20px">
					Today's Class Schedule
				</Typography>

				<TableContainer component={Paper}>
					<Table sx={{ minWidth: "90%" }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Title</TableCell>
								<TableCell align="right">Subject</TableCell>
								<TableCell align="right">
									Class Duration
								</TableCell>
								<TableCell align="right">Start Time</TableCell>
								<TableCell align="right">Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{new Array(5).fill(3).map(() => (
								<TableRow
									sx={{
										"&:last-child td, &:last-child th": {
											border: 0,
										},
									}}
								>
									<TableCell component="th" scope="row">
										Frozen yoghurt
									</TableCell>
									<TableCell align="right">Math</TableCell>
									<TableCell align="right">10</TableCell>
									<TableCell align="right">
										10:30 AM
									</TableCell>
									<TableCell align="right">
										<Button
											variant="filled"
											endIcon={<PlayArrowIcon />}
										>
											Start
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</div>
	)
}

export default TodaysClassesOfTeacher;