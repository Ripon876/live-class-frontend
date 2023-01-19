import { Peer } from "peerjs";
import axios from "axios";

export const makeTotal = (list, m) => {
	let newMar =
		list.reduce((mark, cmark) => {
			if (cmark.mark) {
				return mark + cmark.mark;
			} else {
				return mark;
			}
		}, 0) / list.length;
	let totalMark = Math.floor(newMar) + Number(m);
	return totalMark;
};

// document.cookie.split('=')[1]
export const SubmitMark = (result, cId, eId, cb) => {
	axios
		.post(
			process.env.REACT_APP_SERVER_URL + "/teacher/submit-mark",
			{
				...result,
				cId,
				eId,
			},

			{
				headers: {
					Authorization: `Bearer ${document.cookie.split("=")[1]}`,
				},
			}
		)
		.then((data) => {
			cb(null, data.data.msg);
		})
		.catch((err) => {
			cb(err, null);
		});
};

export const StartExam = (id) => {
	axios
		.get(
			process.env.REACT_APP_SERVER_URL + "/teacher/starting-class/" + id,
			{
				headers: {
					Authorization: `Bearer ${document.cookie.split("=")[1]}`,
				},
			}
		)
		.then((data) => {
			// console.log(data.data.msg)
		})
		.catch((err) => console.log("err :", err));
};

export const CreatePeers = async (
	examID /* examID */,
	config /* ice config */,
	exPI /* examiner peer (ref) */,
	rpPI /* roleplayer peer (ref) */,
	adPI /* admin peer (ref) */
) => {
	const peer = await new Peer(examID, {
		config: config,
	});
	const rp_peer = await new Peer(examID + "examiner", {
		config: config,
	});
	const ad_peer = await new Peer(examID + "admin-examiner", {
		config: config,
	});

	exPI.current = peer;
	rpPI.current = rp_peer;
	adPI.current = ad_peer;
};

export const ConnectWithCandidates = (
	peer /* examiner peer instance (ref) */,
	socket /* socket instance */,
	setOg /* setOngoing */,
	setCT /* setCurrentTime */,
	setM /* setMark */,
	setMS /* setMSubmited */,
	setTL /* setTimeLeft */,
	setAlt /* setAlert */,
	setStd /* setAlert */,
	examID /* examID */,
	myS /* examiner media stream (ref) */,
	cdVR /* candidateVideoRef (ref) */,
	clsEnd /* clsEnd */
) => {
	peer.current?.on("call", (call) => {
		call.answer(myS.current);
console.log('calling')
		setOg(true);
		setCT(Date.now());

		call.on("stream", function (remoteStream) {
			cdVR.current.srcObject = remoteStream;
			cdVR.current.play();
			setM(true);
			setMS(false);
			if (call.metadata.timeleft) {
				setTL();
				if (!clsEnd) {
					setAlt({
						msg: "Candidate Reconnected",
						type: "success",
						open: true,
					});
				}
			}
			socket.emit(
				"addWithRoleplayer",
				{
					_id: call.metadata.std.id,
					timeleft: call.metadata.timeleft,
				},
				examID
			);
			socket.emit("getStudent", call.metadata.std.id, (std) => {
				setStd(std);
			});
			socket.emit("newClassStarted", call.metadata.std.id, examID);
		});
	});
};

export const ConnectWithAdmin = (
	adPI /* admin peer (ref) */,
	myS /* examiner media stream (ref) */
) => {
	adPI.current?.on("call", (call) => {
		call.answer(myS.current);
		call.on("stream", function (remoteStream) {
			console.log("connected with admin");
		});
	});
};

export const BreakTime = (
	t /* exam duration */,
	socket /* socket instance */,
	myS /* examiner media stream (ref) */,
	setSB /* setShowBreak */
) => {
	socket.once("breakTime", () => {
		setSB((old) => true);
		myS.current.getAudioTracks()[0].enabled = false;
		setTimeout(() => {
			myS.current.getAudioTracks()[0].enabled = true;
			setSB((old) => false);
		}, t * 60 * 1000);
	});
};

export const Listeners = (
	socket /* socket instance */,
	exPI /* examiner peer (ref) */,
	myS /* examiner media stream (ref) */,
	cE /*  clsEnd */,
	setCE /* setClsEnd */,
	setOg /* setOngoing */,
	setAlt /* setAlert */
) => {
	socket.on("allClassEnd", (text) => {
		// console.log("classes end : ", text);
		setCE(true);
		exPI.current.destroy();
		myS.current.getTracks()?.forEach((x) => x.stop());
	});

	socket.on("stdDisconnected", (id) => {
		console.log("std disconnected ", id);
		setOg(false);
		if (!cE) {
			setAlt({
				msg: "Candidate disconnected",
				type: "error",
				open: true,
			});
		}
	});

	// socket.on("addWithAdmin", (id) => {
	// 	setAPid(id);
	// 	// console.log("admin want to join , : ", id);
	// });
};

export const Emitters = (
	socket /* socket instance */,
	exId /* examiner ID */,
	examID /* exam ID */,
	setCls /* setCls */,
	bt /* breaker */
) => {
	socket.emit("setActive", { id: exId });

	socket.emit("getClass", examID, (cls, notfound) => {
		if (!notfound) {
			setCls(cls);

			bt(cls.classDuration);
		} else {
			window.location.href = "/";
		}
	});
};

export const GetUserStream = (
	myS /* examiner stream (ref) */,
	setCS /* setClsStarted */,
	exVR /* examinerVideoRef */
) => {
	setCS((old) => true);
	let getUserMedia =
		navigator.getUserMedia ||
		navigator.webkitGetUserMedia ||
		navigator.mozGetUserMedia;

	getUserMedia({ video: true, audio: true }, (mediaStream) => {
		// console.log("media loaded");
		myS.current = mediaStream;
		exVR.current.srcObject = mediaStream;
		exVR.current.play();
	});
};
