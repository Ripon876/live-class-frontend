import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
// import Autocomplete from "@mui/material/Autocomplete";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function HostClass() {
	// const [value, setValue] = useState("");
	// const [inputValue, setInputValue] = useState("");

	const currencies = [
		{
			value: "USD",
			label: "English",
		},
		{
			value: "EUR",
			label: "Math",
		},
		{
			value: "BTC",
			label: "Physics",
		},
		{
			value: "JPY",
			label: "Biology",
		},
	];

	return (
		<div style={{ overflowY: "scroll", maxHeight: "90%" }}>
			<Box
				component="form"
				sx={{
					"& .MuiTextField-root": { m: 2 },
				}}
				m="50px"
				noValidate
				autoComplete="off"
			>
				<Typography variant="h3" mb="20px">
					Host a new class
				</Typography>

				<div>
					<TextField
						required
						id="title"
						label="Title"
						defaultValue=""
						placeholder="class title"
						variant="filled"
						sx={{
							minWidth: "300px",
						}}
					/>

					<TextField
						id="filled-select-currency"
						select
						label="Subject"
						defaultValue="Subject"
						variant="filled"
						sx={{
							minWidth: "300px",
						}}
					>
						{currencies.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</TextField>
					<TextField
						id="filled-select-currency"
						select
						label="Select Teacher"
						defaultValue="Jhone Doe"
						variant="filled"
						sx={{
							minWidth: "300px",
						}}
					>
						{currencies.map((option) => (
							<MenuItem key={option.value} value={option.value}>
								{option.label}
							</MenuItem>
						))}
					</TextField>
					<TextField
						id="standard-number"
						label="Class Duration"
						type="number"
						variant="filled"
						sx={{
							minWidth: "300px",
						}}
						InputLabelProps={{
							shrink: true,
						}}
					/>
					<TextField
						id="datetime-local"
						label="Date"
						type="datetime-local"
						variant="filled"
						sx={{
							minWidth: "300px",
						}}
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</div>
				<Button
					variant="filled"
					sx={{
						mt: 1,
						ml: 2,
					}}
					startIcon={<AddIcon />}
				>
					Add
				</Button>
			</Box>

			<Box
				component="div"
				m="40px 40px "
				width="90%"
				p='0 0 0 20px'
			>
				<Typography variant="h4" mb="20px">
					Class Schedule
				</Typography>

				<TableContainer component={Paper}>
					<Table sx={{ minWidth: "90%" }} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell>Title</TableCell>
								<TableCell align="right">Subject</TableCell>
								<TableCell align="right">Teacher</TableCell>
								<TableCell align="right">
									Class Duration
								</TableCell>
								<TableCell align="right">Date</TableCell>
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
									<TableCell align="right">
										Jhone Doe
									</TableCell>
									<TableCell align="right">10</TableCell>
									<TableCell align="right">
										24 DEC 2022
									</TableCell>
									<TableCell align="right">
										<Button
											variant="filled"
											startIcon={<DeleteIcon />}
										>
											Delete
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</div>
	);
}

export default HostClass;
