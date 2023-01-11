import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircleIcon from "@mui/icons-material/Circle";
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
		});
		setCheckList(list);
	}, []);

	const markPassed = (sn, qn) => {
		if (checkList[sn].questions[qn].passed) {
			checkList[sn].questions[qn].passed = false;
		} else {
			checkList[sn].questions[qn].passed = true;
		}
	};

	const submitMark = () => {
		let clist = [...checkList];

		for (let item of clist) {
			item.passedCount = item.questions.filter(
				(question) => question.passed
			).length;
			item.questionsCount = item.questions.length;
			delete item.required;
		}

		let result = {
			...mark,
			list: clist,
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
		<div className="mt-5">
			<div className="text-start">
				<FormGroup>
					<div className="row mb-3">
						{checkList?.map((item, sn) => (
							<div className="col-4">
								<Typography variant="h3">
									<CircleIcon
										sx={{
											fontSize: "15px",
											paddingRight: "5px",
										}}
									/>
									{item?.title}
								</Typography>
								{item?.questions && (
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
												(question, qn) => (
													<FormControlLabel
														label={question?.title}
														className="d-block"
														control={
															<Checkbox
																color="success"
																onChange={() => {
																	markPassed(
																		sn,
																		qn
																	);
																}}
															/>
														}
													/>
												)
											)}
										</FormGroup>
									</Box>
								)}
							</div>
						))}
					</div>
					<TextField
						label="Mark"
						name="mark"
						type="number"
						variant="filled"
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
