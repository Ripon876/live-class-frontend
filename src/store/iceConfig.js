const iceConfig = {
	iceServers: [
		{ url: process.env.REACT_APP_STUN_SERVER_URL },
		{
			url: process.env.REACT_APP_TURN_SERVER_URL_1,
			username: process.env.REACT_APP_TURN_SERVER_UN,
			credential: process.env.REACT_APP_TURN_SERVER_PW,
		},
		{
			url: process.env.REACT_APP_TURN_SERVER_URL_2,
			username: process.env.REACT_APP_TURN_SERVER_UN,
			credential: process.env.REACT_APP_TURN_SERVER_PW,
		},
		{
			url: process.env.REACT_APP_TURN_SERVER_URL_3,
			username: process.env.REACT_APP_TURN_SERVER_UN,
			credential: process.env.REACT_APP_TURN_SERVER_PW,
		},
	],
};

const iceConfigReducer = (state = iceConfig, action) => {
	switch (action.type) {
		default:
			return state;
	}
};

export default iceConfigReducer;
