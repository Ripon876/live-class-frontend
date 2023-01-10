import { useState, useEffect, useRef } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import ButtonGroup from "@mui/material/ButtonGroup";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Countdown from "react-countdown";
import { Peer } from "peerjs";
// custom component
import Video from "./video-streams/Video";
import TimeRenderer from "./TimeRenderer";

function VideoContainer2({ cvr, evr, og, clsId, rp, msr, ct, rt, cls }) {
	const [mic, setMic] = useState(true);
	const [note, setNote] = useState(false);
	const [readed, setReaded] = useState(false);
	const rpVideoRef = useRef(null);

	useEffect(() => {
		const peer = new Peer(clsId + "candidate-roleplayer");

		peer.on("call", (call) => {
			console.log("receving call from roleplayer");
			call.answer(msr.current);
			call.on("stream", function (rpStream) {
				console.log("call accepted");
				rpVideoRef.current.srcObject = rpStream;
				rpVideoRef.current.play();
			});
		});
	}, []);

	useEffect(() => {
		setReaded(false);
		if (cls?.pdf) {
			setTimeout(() => {
				setReaded(true);
			}, cls?.pdf?.visibleFor * 60 * 1000 + 5000);
		}
	}, [cls]);

	const handleMic = () => {
		if (mic) {
			msr.current.getAudioTracks()[0].enabled = false;
			setMic(false);
		} else {
			msr.current.getAudioTracks()[0].enabled = true;
			setMic(true);
		}
	};

	const handleNote = () => {
		setNote(!note);
	};

	return (
		<div>
			<Box sx={{ flexGrow: 1 }} className="px-3 mt-5 pt-5">
				<Grid container spacing={3}>
					<Grid item sm={4} md={2.5}>
						<div>
							<Video cd title={"Candidate"} stream={msr} />
							<Card className="mb-2">
								<ButtonGroup
									className="justify-content-around w-100"
									variant="contained"
									aria-label="Disabled elevation buttons"
								>
									<IconButton aria-label="delete">
										{mic ? (
											<MicIcon onClick={handleMic} />
										) : (
											<MicOffIcon onClick={handleMic} />
										)}
									</IconButton>
									<IconButton aria-label="delete">
										<NoteAltIcon onClick={handleNote} />
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
									<Divider />
									{cls?.pdf && (
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
														textAlign: "right",
													}}
												/>
											)}
										</ListItem>
									)}
									<Divider />
									<ListItem>
										<ListItemText primary="Remaining Time" />
										{rt !== 0 && (
											<ListItemText
												primary={
													<Countdown
														key={ct}
														date={
															ct + rt * 60 * 1000
														}
														renderer={TimeRenderer}
													/>
												}
												style={{ textAlign: "right" }}
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
					<Grid item sm={8} md={7}>
						<div>
							<Video ex title={"Examiner"} itemRef={evr} />
						</div>
					</Grid>
					<Grid item sm={4} md={2.5}>
						<div>
							{cls?.roleplayer && (
								<div className="mb-5">
								<Video
									rp
									title={"Roleplayer"}
									itemRef={rpVideoRef}
								/>	
								</div>
								
							)}
							<div style={{ display: note ? "block" : "none" }}
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
					</Grid>
				</Grid>
			</Box>
		</div>
	);
}

export default VideoContainer2;