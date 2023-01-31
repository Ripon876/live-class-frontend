import { useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { fileToBase64 } from "./helpers";

function AddPDF({ fd, sfd }) {
	const [file, setFile] = useState({
		visibleFor: 0,
		name: "",
		file: null,
	});
	const [fileStr, setFileStr] = useState("");

	const handleFile = (e) => {
		// console.log("file reading");
		if (e.target.files[0]) {
			// setFile({ ...file, name: e.target.files[0].name });
			fileToBase64(e.target.files[0], (err, str) => {
				setFile({ ...file, file: str, name: e.target.files[0].name });
			});
		}
	};

	const handleChange = (e) => {
	
		sfd({
			...fd,
			pdf: { ...file, visibleFor: e.target.value },
		});
	};

	return (
		<div className="mb-4 mt-2 d-flex align-items-center">
			<div>
				<Button variant="contained" component="label"  size="small" className='BTN'>
					Upload PDF
					<input type="file" hidden onChange={handleFile} />
				</Button>
				{file.name && (
					<Typography
						variant="p"
						sx={{ marginLeft: "10px", color: "#66bb6a" }}
					>
						{file.name}
					</Typography>
				)}
			</div>
			{file.name && (
				<div>
					<TextField
						id="standard-number"
						label="Visible For"
						type="number"
						name="visileFor"
						variant="filled"
						required
						// value={file.visibleFor}
						sx={{
							minWidth: "300px",
						}}
						InputLabelProps={{
							shrink: true,
						}}
						onChange={handleChange}
					/>
				</div>
			)}
		</div>
	);
}

export default AddPDF;
