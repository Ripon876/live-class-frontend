import { useState, useEffect, useRef } from "react";
import MeetingComp from "../MeetingComp";
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
import Countdown from "react-countdown";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import MoodIcon from "@mui/icons-material/Mood";
import Button from "@mui/material/Button";
import { useSearchParams } from "react-router-dom";
import PDFViewer from "./start-class/PDFViewer";
import StatetMsgs from "../StatetMsgs";
import PdfPopUp from "./start-class/PdfPopUp";
import BreakTimer from "./start-class/BreakTimer";

function ExamV2C() {
	const stdId = useSelector((state) => state.user.id);
	const [std, setStd] = useState(null);
	const [note, setNote] = useState(false);
	const [mic, setMic] = useState(false);
	const [cls, setCls] = useState(null);
	const [readed, setReaded] = useState(false);
	const [showPdf, setShowPdf] = useState(false);
	const [onGoing, setOngoing] = useState(false);
	const [currentTime, setCurrentgTime] = useState(0);
	const [breakTime, setBT] = useState(0);
	const [state, setState] = useState({
		nextStation: "",
		break: false,
		delay: false,
		allStationEnd: false,
	});
	const [pdfPopup, setPDFPopup] = useState(false);
	const [exrp, setExRp] = useState(["Examiner", "Roleplayer"]);
	const [searchParams, setSearchParams] = useSearchParams();
	const [remainingTIme, setRemainingTime] = useState(0);
	const queryString = window.location.search;
	const params = new URLSearchParams(queryString);

	const apiRef = useRef(null);

	useEffect(() => {
		if (document.querySelector(".opendMenuIcon")) {
			document.querySelector(".opendMenuIcon").click();
		}
	}, []);

	const toggleMic = () => {
		console.log("toggling", apiRef.current);
		apiRef.current?.executeCommand("toggleAudio");
	};

	useEffect(() => {
		console.log(apiRef);
	}, [apiRef]);
	return (
		<>
			<div
				style={{
					height: "90%",
					overflowY: "auto",
					overflowX: "hidden",
				}}
			>
				<Box
					sx={{ flexGrow: 1 }}
					className="px-3 mt-5 pt-5"
					sx={{
						display:
							!state?.delay &&
							!state?.break &&
							!state?.allStationEnd
								? "block"
								: "none",
					}}
				>
					<Grid
						container
						spacing={3}
						className="justify-content-center"
					>
						<Grid item sm={4} md={3}>
							<div>
								<Card
									className="mb-2"
									style={{ cursor: "normal" }}
								>
									<CardContent className="p-2 ps-4">
										<Typography
											gutterBottom
											variant="h3"
											component="div"
											className="m-0"
										>
											sdfasd
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
											{mic ? (
												<MicIcon onClick={toggleMic} />
											) : (
												<MicOffIcon
													onClick={toggleMic}
												/>
											)}
										</IconButton>
										{cls?.pdf && (
											<IconButton
												aria-label="delete"
												onClick={() =>
													setPDFPopup(!pdfPopup)
												}
											>
												<PictureAsPdfIcon />
											</IconButton>
										)}

										<IconButton
											aria-label="delete"
											onClick={() => setNote(!note)}
										>
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
													{cls?.title}
												</Typography>
											</ListItemText>
										</ListItem>
										{cls?.pdf && (
											<>
												<Divider />
												<ListItem>
													<ListItemText
														primary="Reading Time"
														secondary={`${cls?.pdf?.visibleFor} minute`}
													/>
													{readed && (
														<ListItemText
															primary={
																<CheckCircleIcon color="success" />
															}
															style={{
																textAlign:
																	"right",
															}}
														/>
													)}
												</ListItem>
											</>
										)}
										<Divider />
										<ListItem>
											<ListItemText primary="Remaining Time" />

											{currentTime && !onGoing && !remainingTIme && (
												<ListItemText
													primary={
														<Countdown
															key={currentTime}
															date={
																currentTime +
																4 *
																	60 *
																	1000
															}
															renderer={
																TimeRenderer
															}
														/>
													}
													style={{
														textAlign: "right",
													}}
												/>
											)}
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
									<div>
										<MeetingComp
											id={10}
											title="First Station"
											name="Candidate"
											sct={setCurrentgTime}
										/>
									</div>
								</div>

								<div className="mt-3 d-flex">
									<div
										style={{
											display: note ? "block" : "none",
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

							<div>
								<div>
									{cls?.pdf && pdfPopup && (
										<PdfPopUp
											pdf={cls?.pdf?.file}
											setOp={setPDFPopup}
										/>
									)}
								</div>
							</div>
						</Grid>
					</Grid>
				</Box>
				<StatetMsgs state={state} role="cd" />
			</div>
		</>
	);
}

export default ExamV2C;
function TimeRenderer({ minutes, seconds }) {
	return (
		<span>
			{minutes < 10 ? "0" + minutes : minutes}:
			{seconds < 10 ? "0" + seconds : seconds}
		</span>
	);
}
