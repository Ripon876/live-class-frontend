import { useState, useRef } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";

function CheckList({ fd, sfd }) {
	let initialList = [
		{
			title: "Speaking Quality",
			required: false,
		},
		{
			title: "Explanations",
			required: false,
		},
		{
			title: "Appearance",
			required: false,
		},
		{
			title: "Answers Quality",
			required: false,
		},
	];

	const [checkList, setCheckList] = useState(initialList);
	const [checkboxValue, setCheckboxValue] = useState("");
	// const checkboxValue = useRef(null);

	const handleChange = (e) => {
		if (e.target.checked) {
			let list = [...checkList];
			let itemIndex = list.findIndex(
				(item) => item.title === e.target.name
			);
			list[itemIndex].required = true;
			setCheckList(list);
		}
		let requiredItems = checkList.filter((item) => item.required);

		sfd({
			...fd,
			checklist: requiredItems,
		});
	};

	const clear = () => {
		setCheckList(initialList);
	};

	const addCheckbox = () => {
		console.log("calling");
		if (checkboxValue) {
			setCheckList([
				...checkList,
				{
					title: checkboxValue,
					required: true,
				},
			]);
			setCheckboxValue("");
		}
	};
	return (
		<>
			<div className="ms-2 d-flex text-start">
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
									checked={item.required}
								/>
							}
							label={item.title}
						/>
					))}
				</FormGroup> 
			</div>
			<div className="align-items-center d-flex">
				<TextField
					required
					id="title"
					label="Title"
					name="title"
					placeholder="checkbox title"
					variant="filled"
					value={checkboxValue}
					required
					sx={{
						minWidth: "300px",
					}}
					onChange={(e) => {
						setCheckboxValue(e.target.value);
					}}
				/>
				<div>
					<Button
						variant="filled"
						sx={{
							mt: 1,
							ml: 2,
							boxShadow: 3,
							fontSize: "15px",
						}}
						onClick={addCheckbox}
						startIcon={<AddIcon />}
					>
						Add checkbox
					</Button>
				</div>
			</div>
		</>
	);
}

export default CheckList;
