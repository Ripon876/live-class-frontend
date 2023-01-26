import { useRef, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import MoodIcon from "@mui/icons-material/Mood";
import Button from "@mui/material/Button";
import Countdown from "react-countdown";

function Test() {
	const exRef = useRef(null);
	const rpRef = useRef(null);
	const [exrp, setExRp] = useState(["Examiner", "Roleplayer"]);
	const rpVideoContainer = useRef(null);

	useEffect(() => {
		if (document.querySelector(".opendMenuIcon")) {
			document.querySelector(".opendMenuIcon").click();
		}

		// document.querySelector(".rpVideoContainer").children.forEach(()=> {
		// 	console.log('sdfsdafsad')
		// })
		// .forEach((elem) => {
		// 	elem.addEventListener("click", (e) => {
		// 		console.log(elem);
		// 		swapVideo();
		// 	});
		// });

		for (let elem of rpVideoContainer.current.children) {
			elem.addEventListener("click", (e) => {
				console.log(elem);
				swapVideo();
			});
		}
		// rpVideoContainer.current.addEventListener("click", (e) => {
		// 	console.log(e.target.parentElement);
		// 	swapVideo();
		// });
	}, []);

	const swapVideo = () => {
		setExRp((old) => [...old.reverse()]);
		let rpV = rpRef.current.children[0];
		let exV = exRef.current.children[0];
		rpRef.current.replaceChildren(exV);
		exRef.current.replaceChildren(rpV);
	};

	return (
		<div
			style={{
				height: "90%",
				overflowY: "auto",
				overflowX: "hidden",
			}}
		>
			<Box sx={{ flexGrow: 1 }} className="px-3 mt-5 pt-5">
				<Grid container spacing={3} className="justify-content-center">
					<Grid item sm={4} md={3}>
						<div>
							<Card className="mb-2" style={{ cursor: "normal" }}>
								<div className={`video cd-video `}>
									<div className="h-100 w-100">
										<div className="w-100 h-100 bg-black">
											<div>
												<video
													// src={stream.current}
													src="https://images.all-free-download.com/footage_preview/mp4/closeup_of_wild_butterfly_in_nature_6891908.mp4"
												></video>
											</div>
										</div>
									</div>
								</div>
								<CardContent className="p-2 ps-4">
									<Typography
										gutterBottom
										variant="h3"
										component="div"
										className="m-0"
									>
										std
									</Typography>

									<Typography
										variant="body2"
										color="text.secondary"
									>
										Candidate
									</Typography>
								</CardContent>
							</Card>

							<Card className="mb-2">
								<ButtonGroup
									className="justify-content-around w-100 py-1"
									variant="contained"
									aria-label="Disabled elevation buttons"
								>
									<IconButton aria-label="delete">
										<MicIcon />
									</IconButton>

									<IconButton aria-label="delete">
										<PictureAsPdfIcon />
									</IconButton>

									<IconButton aria-label="delete">
										<NoteAltIcon />
									</IconButton>
								</ButtonGroup>
							</Card>
							<Card className="mb-3">
								<List
									component="nav"
									aria-label="secondary mailbox folder"
								>
									<ListItem>
										<ListItemText>
											<Typography
												gutterBottom
												variant="h3"
												component="div"
												className="m-0"
											>
												sdfsd
											</Typography>
										</ListItemText>
									</ListItem>
									<>
										<Divider />
										<ListItem>
											<ListItemText
												primary="Reading Time"
												secondary={`5`}
											/>

											<ListItemText
												primary={
													<CheckCircleIcon color="success" />
												}
												style={{
													textAlign: "right",
												}}
											/>
										</ListItem>
									</>
									)}
									<Divider />
									<ListItem>
										<ListItemText primary="Remaining Time" />

										<ListItemText
											primary={
												<Countdown
													key={Date.now()}
													date={
														Date.now() +
														10 * 60 * 1000
													}
												/>
											}
											style={{
												textAlign: "right",
											}}
										/>
									</ListItem>
									<Divider />
									<ListItem>
										<ListItemText
											secondary="There is 1 examiner"
											secondaryTypographyProps={{
												fontSize: "20px",
											}}
										/>
									</ListItem>
								</List>
							</Card>
						</div>
					</Grid>
					<Grid item sm={8} md={8}>
						<div>
							<div>
								<Card
									className="mb-2"
									style={{ cursor: "normal" }}
								>
									<div className="h-100 w-100">
										<div
											className="w-100 h-100 bg-black"
											ref={exRef}
										>
											<div>
												<video
													className="h-100 w-100"
													autoPlay
													muted
													loop
													// src={stream.current}
													src="https://images.all-free-download.com/footage_preview/mp4/closeup_of_wild_butterfly_in_nature_6891908.mp4"
												></video>
											</div>
										</div>
									</div>

									<CardContent className="p-2 ps-4">
										<Typography
											variant="body2"
											color="text.secondary"
										>
											{exrp[0]}
										</Typography>
									</CardContent>
								</Card>
							</div>

							<div className="mt-3 d-flex">
								<div
									className="d-flex rpVideoContainer"
									ref={rpVideoContainer}
									// onClick={change}
								>
									<div className="me-4">
										<Card
											className="mb-2"
											style={{
												cursor: "pointer",
												width: "250px",
											}}
										>
											<div className="h-100 w-100">
												<div
													className="w-100 h-100 bg-black"
													ref={rpRef}
												>
													<div>
														<video
															className="h-100 w-100"
															autoPlay
															muted
															loop
															src="https://images.all-free-download.com/footage_preview/mp4/tiny_wild_bird_searching_for_food_in_nature_6892037.mp4"
														></video>
													</div>
												</div>
											</div>

											<CardContent className="p-2 ps-4">
												<Typography
													variant="body2"
													color="text.secondary"
												>
													{exrp[1]}
												</Typography>
											</CardContent>
										</Card>
									</div>
								</div>

								<div
									style={{
										display: "block",
									}}
									className="w-100"
								>
									<div className="form-group">
										<label htmlFor="note">Note</label>
										<textarea
											placeholder="Write note"
											className="form-control"
											rows="6"
											id="note"
										></textarea>
									</div>
								</div>
							</div>
						</div>
					</Grid>
				</Grid>
			</Box>
		</div>
	);
}

export default Test;
