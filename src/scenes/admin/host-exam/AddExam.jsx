import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
// import { subjects } from "./helpers";
import CheckList from "./CheckList";
import AddPDF from "./AddPDF";

function AddExam({ fd, hc, hs, examiners, roleplayers, sfd }) {
	const [key1, setK1] = useState(true);
	const [key2, setK2] = useState(true);

	const handleSubmit = () => {
		hs();
		setK1(!key1);
		setK2(!key2);
	};

	return (
		<div>
			<div>
				<TextField
					required
					id="title"
					label="Title"
					name="title"
					placeholder="class title"
					variant="filled"
					value={fd.title}
					required
					sx={{
						minWidth: "300px",
					}}
					onChange={hc}
				/>

				{/*<TextField
					id="filled-select-currency"
					select
					label="Subject"
					name="subject"
					variant="filled"
					value={fd.subject}
					required
					sx={{
						minWidth: "300px",
					}}
					onChange={hc}
				>
					{subjects.map((option) => (
						<MenuItem key={option.value} value={option.value}>
							{option.label}
						</MenuItem>
					))}
				</TextField>*/}
				<TextField
					id="filled-select-currency"
					select
					label="Select Examiner"
					name="teacher"
					variant="filled"
					value={fd.teacher}
					required
					sx={{
						minWidth: "300px",
					}}
					onChange={hc}
				>
					{examiners.map((examiner) => (
						<MenuItem value={examiner}>{examiner.name}</MenuItem>
					))}
				</TextField>
				<TextField
					id="filled-select-currency"
					select
					label="Select Roleplayer"
					name="roleplayer"
					variant="filled"
					value={fd.roleplayer}
					sx={{
						minWidth: "300px",
					}}
					onChange={hc}
				>
					{roleplayers.map((roleplayer) => (
						<MenuItem value={roleplayer}>
							{roleplayer.name}
						</MenuItem>
					))}
				</TextField>
				<TextField
					id="standard-number"
					label="Exam Duration"
					type="number"
					name="classDuration"
					value={fd.classDuration}
					variant="filled"
					required
					sx={{
						minWidth: "300px",
					}}
					InputLabelProps={{
						shrink: true,
					}}
					onChange={hc}
				/>
				<TextField
					id="time"
					label="Start Time"
					type="time"
					name="startTime"
					variant="filled"
					value={fd.startTime}
					required
					sx={{
						minWidth: "300px",
					}}
					InputLabelProps={{
						shrink: true,
					}}
					inputProps={{
						step: 300, // 5 min
					}}
					sx={{ width: 150 }}
					onChange={hc}
				/>
			</div>
			<div>
				<CheckList fd={fd} sfd={sfd} key={key1} />
			</div>
			<div>
				<AddPDF fd={fd} sfd={sfd} key={key2} />
			</div>
			<div>
				<Button
					variant="filled"
					sx={{
						mt: 1,
						ml: 2,
						boxShadow: 3,
					}}
					startIcon={<AddIcon />}
					onClick={handleSubmit}
				>
					Add
				</Button>
			</div>
		</div>
	);
}

export default AddExam;
