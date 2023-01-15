import { useState, useRef } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

function CheckList({ fd, sfd }) {
	let initialList = [
		{
			title: "Communication with patient",
			required: false,
			questions: [],
		},
		{
			title: "Communication with colleagues",
			required: false,
			questions: [],
		},
		{
			title: "Information Gathering",
			required: false,
			questions: [],
		},
		{
			title: "Patient's Safety",
			required: false,
			questions: [],
		},
		{
			title: "Applied Clinical Knowledge",
			required: false,
			questions: [],
		},
	];

	const [checkList, setCheckList] = useState(initialList);

	const handleChange = (e) => {
		if (e) {
			let list = [...checkList];
			let itemIndex = list.findIndex(
				(item) => item.title === e.target.name
			);

			if (list[itemIndex].required) {
				list[itemIndex].required = false;
				list[itemIndex].questions = [];
			} else {
				list[itemIndex].required = true;
			}

			setCheckList([...list]);
		}
	};

	const clear = () => {
		setCheckList(initialList);
	};

	const addQuestion = (i) => {
		// parentElement.previousElementSibling
		let value = document.querySelector("#checkbox" + i).value;
		if (value) {
			let newList = [...checkList];
			newList[i].questions.push({
				title: value,
				required: true,
				passed: false,
			});
			document.querySelector("#checkbox" + i).value = "";
			setCheckList([...newList]);
			let requiredItems = newList.filter((item) => item.required);
			sfd({
				...fd,
				checklist: requiredItems,
			});
			return;
		}
		return;
	};

	return (
		<>
			<div className="ms-2 d-flex text-start">
				<FormGroup
					sx={{
						maxWidth: "350px",
					}}
				>
					{checkList?.map((item, i) => (
						<div key={"dfgfd4534sdf" + i}>
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
							{item.required && (
								<div>
									<Box
										sx={{
											display: "flex",
											flexDirection: "column",
											ml: 3,
										}}
									>
										<FormGroup
											sx={{
												maxWidth: "350px",
											}}
										>
											{item?.questions?.map(
												(question) => (
													<FormControlLabel
														label={question.title}
														control={
															<Checkbox
																color="success"
																checked={
																	question.required
																}
															/>
														}
													/>
												)
											)}
										</FormGroup>
									</Box>

									<div className="align-items-center d-flex">
										<TextField
											required
											id={"checkbox" + i}
											placeholder="question"
											variant="filled"
											required
											size="small"
											sx={{
												minWidth: "300px",
											}}
										/>
										<div>
											<Button
												size="small"
												variant="filled"
												sx={{
													width: "170px",
													boxShadow: 3,
													fontSize: "15px",
												}}
												onClick={() => {
													addQuestion(i);
												}}
												startIcon={<AddIcon />}
											>
												Add Questions
											</Button>
										</div>
									</div>
								</div>
							)}
						</div>
					))}
				</FormGroup>
			</div>
		</>
	);
}

export default CheckList;
