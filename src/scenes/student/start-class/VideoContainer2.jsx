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

// custom component
import Video from "./video-streams/Video";

function VideoContainer2() {
	const [mic, setMic] = useState(true);
	const [note, setNote] = useState(false);

	const handleMic = () => {
		setMic(!mic);
	};
	const handleNote = () => {
		setNote(!note);
	};

	return (
		<div>
			<Box sx={{ flexGrow: 1 }} className="px-3">
				<Grid container spacing={3}>
					<Grid item sm={4} md={2.5}>
						<div>
							<Video cd title={"Candidate"} />
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
												Station 1
											</Typography>
										</ListItemText>
									</ListItem>
									<Divider />
									<ListItem>
										<ListItemText
											primary="Reading Time"
											secondary="1 minute"
										/>
										<ListItemText
											primary={
												<CheckCircleIcon color="success" />
											}
											style={{ textAlign: "right" }}
										/>
									</ListItem>
									<Divider />
									<ListItem>
										<ListItemText primary="Remaining Time" />
										<ListItemText
											primary="00:50"
											style={{ textAlign: "right" }}
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
					<Grid item sm={8} md={7}>
						<div>
							<Video ex title={"Examiner"} />
						</div>
					</Grid>
					<Grid item sm={4} md={2.5}>
						<div>
							<Video rp title={"Roleplayer"} />

							<div className="mt-5" style={{display: note ? 'block' : 'none'}}>
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
