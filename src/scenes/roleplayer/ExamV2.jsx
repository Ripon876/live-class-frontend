import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

const Sp = () => <h4>Connecting to station</h4>;

function ExamV2R() {
	return (
		<div className="examiner-v">
			<JitsiMeeting
				configOverwrite={{
					startWithAudioMuted: true,
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
					subject: "Station Number",
				}}
				spinner={Sp}
				interfaceConfigOverwrite={{
					DEFAULT_BACKGROUND: "#3b98ff",
					noSsl: true,
					SHOW_JITSI_WATERMARK: false,
					HIDE_DEEP_LINKING_LOGO: false,
					SHOW_BRAND_WATERMARK: false,
					SHOW_WATERMARK_FOR_GUESTS: false,
					SHOW_POWERED_BY: false,
					SHOW_CHROME_EXTENSION_BANNER: false,
					TOOLBAR_BUTTONS: [
						"microphone",
						"camera",
						// "closedcaptions",
						"desktop",
						"fullscreen",
						// "settings",
						"raisehand",
						// "videoquality",
					],
				}}
				userInfo={{
					displayName: "Roleplayer",
				}}
				// getIFrameRef={(node) => (node.style.width = "400px"  )}
				key={"34543df"}
				roomName={"Station" + 1}
			/>
		</div>
	);
}

export default ExamV2R;
