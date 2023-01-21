import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import HistoryIcon from "@mui/icons-material/History";

function RenewExams({ cr, oc }) {
	const [open, setOpen] = useState(false);
	const [time, setTIme] = useState(null);
	const handleClose = () => {
		setOpen(false);
	};

	const confirmRenew = () => {
		setOpen((old) => true);
	};

	const renew = () => {
		console.log(time);
		if (time) {
			oc(time);
			setOpen(false);
		}
	};

	const handleChange = (e) => {
		let time =
			new Date().toString().slice(0, 15) + " " + e.target.value + ":00";

		setTIme((old) => new Date(time).toUTCString());
	};

	return (
		<div>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Renew Exams</DialogTitle>
				<DialogContent>
					<DialogContentText>
						To renew, please select a new start time for exams
					</DialogContentText>
					<TextField
						id="time"
						label="Start Time"
						type="time"
						name="startTime"
						variant="filled"
						// value={fd.startTime}
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
					<Button onClick={renew}>Renew</Button>
					<Button onClick={handleClose}>Cancel</Button>
				</DialogActions>
			</Dialog>

			<Button
				variant="filled"
				sx={{
					boxShadow: 3,
					mt: 1,
				}}
				disabled={!cr}
				startIcon={<HistoryIcon />}
				onClick={confirmRenew}
			>
				Renew Exams
			</Button>
		</div>
	);
}

export default RenewExams;
