import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import CircleIcon from "@mui/icons-material/Circle";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

function ExamDetails() {
	const [searchParams] = useSearchParams();

	const [exam, setExam] = useState({});

	useEffect(() => {
		console.log(searchParams.get("id"));
		axios
			.get(
				process.env.REACT_APP_SERVER_URL +
					"/admin/get-exam/" +
					searchParams.get("id"),
				{
					headers: {
						Authorization:
							"Bearer " + document.cookie.split("=")[1],
					},
				}
			)
			.then((data) => {
				console.log(data.data.exam);
				setExam(data.data.exam);
			})
			.catch((err) => {
				console.log("err :", err);
			});
	}, []);

	// {
	//     "teacher": {
	//         "_id": "63b17709f5eab7b9b8f124d0",
	//         "name": "Teacher 1"
	//     },
	//     "_id": "63c43daee20cdf4dc90c754b",
	//     "title": "dsfsd",
	//     "classDuration": 3,
	//     "startTime": "10:30",
	//     "checklist": [],
	//     "status": "Not Started",
	//     "students": [],
	//     "hasToJoin": 0,
	//     "__v": 0
	// }

	return (
		<div style={{ overflowY: "auto", maxHeight: "90%" }}>
			<Box component="div" m="40px 40px " width="90%" p="0 0 0 20px">
				<Typography variant="h3">
					Title : <strong>{exam?.title} </strong>
				</Typography>
				<p className="mb-0">
					Duration : <strong>{exam?.classDuration} min</strong>
				</p>
				<p className="mb-0">
					Start Time :
					<strong>
						{" "}
						{new Date(exam?.startTime)
							.toLocaleTimeString()
							.slice(0, 4) +
							" " +
							new Date(exam?.startTime)
								.toLocaleTimeString()
								.slice(8)}{" "}
					</strong>
				</p>
				<p className="mb-0">
					Status :<strong>{exam?.status}</strong>
				</p>
				<p className="mb-0">
					Teacher : <strong>{exam?.teacher?.name}</strong>
				</p>
				{exam?.roleplayer && (
					<p className="mb-0">
						Roleplayer : <strong>{exam?.roleplayer?.name}</strong>
					</p>
				)}
				<div>
					<p className="mb-0">Questions :</p>
					<strong>
						<div className="row mb-3">
							{exam?.checklist?.map((item, i) => (
								<div className="col-4" key={"sdfl3lv3" + i}>
									<p className="mb-0">
										<CircleIcon
											sx={{
												fontSize: "15px",
												paddingRight: "5px",
											}}
										/>
										{item?.title}
									</p>
									{item?.questions && (
										<Box
											sx={{
												display: "flex",
												flexDirection: "column",
												ml: 3,
											}}
										>
											{item?.questions?.map(
												(question, i) => (
													<p
														className="mb-0"
														key={"sdnn3lv3" + i}
													>
														<CircleIcon
															sx={{
																fontSize:
																	"13px",
																paddingRight:
																	"5px",
															}}
														/>
														{question?.title}
													</p>
												)
											)}
										</Box>
									)}
								</div>
							))}
						</div>
					</strong>
				</div>
				{exam?.pdf && (
					<div className="mt-4">
						<p className="mb-0">
							PDF : Visible for{" "}
							<strong>{exam?.pdf?.visibleFor} min</strong>
						</p>
						<iframe
							src={exam?.pdf?.file + "#toolbar=0"}
							width="100%"
							height="500px"
						/>
					</div>
				)}
				<Button
					sx={{
						boxShadow: 3,
						mt:2
					}}
					variant="filled"
					// startIcon={<AssignmentIcon />}
					onClick={() => {
						window.location.href = "/host_exam";
					}}
				>
					Go Back
				</Button>
			</Box>
		</div>
	);
}

export default ExamDetails;
