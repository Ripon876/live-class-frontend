import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

function StartExams({ cs, sp, oc }) {
	const [open, setOpen] = useState(false);
	const [data, setData] = useState({
		breakAfter: "",
		breakDuraion: "",
	});
	const handleClose = () => {
		setOpen(false);
	};

	const confirmStart = () => {
		setOpen((old) => true);
	};

	const startexams = () => {
		console.log(data);

		if (Object.values(data)?.every((item) => item !== "")) {
			oc(data);
			setOpen(false);
		}
	};

	const handleChange = (e) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Start Exams</DialogTitle>
				<DialogContent>
					<DialogContentText>
						To start, please give break information
					</DialogContentText>
					<TextField
						label="Break After"
						type="number"
						title="After which station you want to show break"
						name="breakAfter"
						variant="filled"
						required
						InputLabelProps={{
							shrink: true,
						}}
						inputProps={{
							step: 300, // 5 min
						}}
						sx={{ width: 300, mt: 2 }}
						onChange={handleChange}
					/>
					<TextField
						label="Break Duration (min)"
						type="number"
						name="breakDuraion"
						variant="filled"
						required
						InputLabelProps={{
							shrink: true,
						}}
						inputProps={{
							step: 300, // 5 min
						}}
						sx={{ width: 300, mt: 2 }}
						onChange={handleChange}
					/>
				</DialogContent>
				<DialogActions className="justify-content-start">
					<Button onClick={startexams}>Start</Button>
					<Button onClick={handleClose}>Cancel</Button>
				</DialogActions>
			</Dialog>

			<Button
				variant="filled"
				sx={{
					boxShadow: 3,
				}}
				disabled={sp || !cs}
				startIcon={<PlayArrowIcon />}
				onClick={confirmStart}
			>
				Start Today's Exams 222
			</Button>
		</div>
	);
}

export default StartExams;
