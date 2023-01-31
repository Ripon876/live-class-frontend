import { useEffect } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import axios from "axios";

const MeetingComp = ({ id, title, name, apiRef, sct, ao, admin }) => {
	useEffect(() => {
		if (ao) {
			axios
				.post(process.env.REACT_APP_SERVER_URL + "/markOnline", ao)
				.then((data) => {
					console.log("marked as online");
				});
		}

		return () => {
			if (ao) {
				axios
					.post(
						process.env.REACT_APP_SERVER_URL + "/unmarkOnline",
						ao
					)
					.then((data) => {
						console.log("marked as online");
					});
			}
		};
	}, []);
	return (
		<div className="jitsiContainer">
			<JitsiMeeting
				configOverwrite={{
					// startWithAudioMuted: admin ? true : false,
					// startWithVideoMuted: admin ? true : false,
					startWithAudioMuted: true,
					startWithVideoMuted: true,
					hiddenPremeetingButtons: ["microphone"],
					prejoinPageEnabled: false,
					logoImageUrl: "",
					DEFAULT_LOGO_URL: "",
					defaultLocalDisplayName: "me",
					readOnlyName: true,
					enableInsecureRoomNameWarning: false,
					disableInviteFunctions: true,
					remoteVideoMenu: {
						disabled: true,
					},
					hideRecordingLabel: false,
					disableSelfView: true,
					hideParticipantsStats: true,
					subject: title,
					giphy: {
						enabled: false,
					},
					conferenceInfo: {
						autoHide: ["subject"],
					},
					hideConferenceTimer: true,
					logging: {
						defaultLogLevel: "error",
					},
					apiLogLevels: ["error"],
				}}
				spinner={Sp}
				interfaceConfigOverwrite={{
					// DEFAULT_BACKGROUND: "#3b98ff",
					DEFAULT_BACKGROUND: "#0e131ea3",
					noSsl: true,
					SHOW_JITSI_WATERMARK: false,
					HIDE_DEEP_LINKING_LOGO: false,
					SHOW_BRAND_WATERMARK: false,
					SHOW_WATERMARK_FOR_GUESTS: false,
					SHOW_POWERED_BY: false,
					SHOW_CHROME_EXTENSION_BANNER: false,
					DEFAULT_WELCOME_PAGE_LOGO_URL: "",
					TOOLBAR_BUTTONS: [
						"microphone",
						// "camera",
						// "closedcaptions",
						// "desktop",
						"fullscreen",
						// "settings",
						// "raisehand",
						// "videoquality",
					],
				}}
				userInfo={{
					displayName: name,
					// avatarUrl: "dffasdfa23423432sffsdfd",
				}}
				onApiReady={(externalApi) => {
					console.log("api ready");

					if (!admin) {
						setTimeout(() => {
							// externalApi.getRoomsInfo().then((rooms) => {
							// 	console.log(" = = = = = = = =  = = ");
							// 	console.log(" rooms ");
							// 	console.log(rooms);
							// 	console.log(" = = = = = = = =  = = ");
							// });

							externalApi.executeCommand("toggleAudio");
							externalApi.executeCommand("toggleVideo");
						}, 20000);
					}
				}}
				getIFrameRef={(node) => (node.style.height = "600px")}
				key={"34543df"}
				roomName={"Station" + id}
			/>
		</div>
	);
};

export default MeetingComp;

const Sp = () => <h4>Connecting to station</h4>;
