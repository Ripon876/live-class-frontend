import { useState, useEffect } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { makeTotal, SubmitMark } from "./helpers";

function Mark({ list, cId, eId, sm, ms }) {
	const [checkList, setCheckList] = useState([]);
	const [mark, setMark] = useState({
		mark: 0,
		comment: "",
	});

	useEffect(() => {
		list.map((item) => {
			delete item.required;
			item.passed = false;
		});
		setCheckList(list);
	}, []);

	const handleChange = (e) => {
		let cList = [...checkList];
		let itemIndex = cList.findIndex((item) => item.title === e.target.name);
		if (cList[itemIndex].mark != 5) {
			cList[itemIndex].mark = 5;
			cList[itemIndex].passed = true;
		} else {
			cList[itemIndex].mark = 0;
			cList[itemIndex].passed = false;
		}
		console.log(cList);
		setCheckList(cList);
	};

	const submitMark = () => {
		let totalMark = makeTotal(checkList, mark.mark);
		let result = {
			mark: totalMark,
			comment: mark.comment,
			list: [...checkList],
		};
		SubmitMark(result, cId, eId, (err, msg) => {
			if (err) {
				console.log(err);
			} else {
				ms(true);
				sm(false);
			}
		});
	};
	return (
		<div>
			<div className="text-start">
				<FormGroup
					sx={{
						maxWidth: "350px",
					}}
				>
					{checkList?.map((item) => (
						<FormControlLabel
							control={
								<Checkbox
									color="success"
									name={item.title}
									onChange={handleChange}
								/>
							}
							label={item.title}
						/>
					))}
					<TextField
						label="Mark"
						name="mark"
						type="number"
						variant="filled"
						// value={fd.title}
						sx={{
							marginTop: "10px",
							minWidth: "300px",
							maxWidth: "350px",
						}}
						onChange={(e) => {
							setMark({
								...mark,
								mark: e.target.value,
							});
						}}
					/>
					<TextField
						label="Comment"
						name="comment"
						type="text"
						variant="filled"
						// value={fd.title}
						sx={{
							marginTop: "15px",
							minWidth: "300px",
							maxWidth: "350px",
						}}
						onChange={(e) => {
							setMark({
								...mark,
								comment: e.target.value,
							});
						}}
					/>
				</FormGroup>
				<div className="text-start mt-3">
					<Button
						variant="contained"
						size="normal"
						onClick={submitMark}
					>
						Submit
					</Button>
				</div>
			</div>
		</div>
	);
}

export default Mark;
