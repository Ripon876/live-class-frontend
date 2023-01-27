import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

function ExamV2C() {
	return (
		<div className="examiner-v">
			<JitsiMeeting
				configOverwrite={{
					startWithAudioMuted: true,
					hiddenPremeetingButtons: ["microphone"],
					prejoinPageEnabled: false,
					logoImageUrl: "/logo-form.png",
					defaultLogoUrl: "/logo-form.png",
				}}
				interfaceConfigOverwrite={{
					DEFAULT_BACKGROUND: "#3b98ff",
					noSsl: true,
					SHOW_JITSI_WATERMARK: false,
					HIDE_DEEP_LINKING_LOGO: false,
					SHOW_BRAND_WATERMARK: false,
					SHOW_WATERMARK_FOR_GUESTS: false,
					SHOW_POWERED_BY: false,
					DEFAULT_WELCOME_PAGE_LOGO_URL: "",
					TOOLBAR_BUTTONS: [
						"microphone",
						"camera",
						"closedcaptions",
						"desktop",
						"fullscreen",
						// "settings",
						"raisehand",
						// "videoquality",
					],
				}}
				userInfo={{
					displayName: "Candidate",
				}}
				// getIFrameRef={(node) => (node.style.width = "400px"  )}
				key={"34543df"}
				roomName={"Station" + 1}
			/>
		</div>
	);
}

export default ExamV2C;
