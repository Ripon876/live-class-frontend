import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
// import Autocomplete from "@mui/material/Autocomplete";

function HostClass() {
	// const [value, setValue] = useState("");
	// const [inputValue, setInputValue] = useState("");

	const options = ["Option 1", "Option 2"];
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
		<div>
			<Box
				component="form"
				sx={{
					"& .MuiTextField-root": { m: 2, width: "40ch" },
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
					/>

					<TextField
						id="filled-select-currency"
						select
						label="Subject"
						defaultValue="Subject"
						variant="filled"
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
		</div>
	);
}

export default HostClass;
