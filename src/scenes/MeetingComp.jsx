import { JitsiMeeting } from "@jitsi/react-sdk";

const MeetingComp = ({ id, title, name, apiRef, sct }) => {
	return (
		<JitsiMeeting
			configOverwrite={{
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
				DEFAULT_WELCOME_PAGE_LOGO_URL: "",
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
				displayName: name,
			}}
			onApiReady={(externalApi) => {
				console.log("api ready");

				if (apiRef) {
					apiRef.current = externalApi;
				}
				if (sct) {
					// sct(Date.now());
				}
			}}
			// getIFrameRef={(node) => (node.style.width = "400px"  )}
			key={"34543df"}
			roomName={"Station" + id}
		/>
	);
};

export default MeetingComp;

const Sp = () => <h4>Connecting to station</h4>;
