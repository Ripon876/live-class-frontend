import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import axios from "axios";

let socket;
let examId;
function JoinExam() {
	const user = useSelector((state) => state.user);
	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("startClass", async () => {
			// console.log("starting cls");
			axios
				.post(process.env.REACT_APP_SERVER_URL + "/get-exam-id", user)
				.then((data) => {
					// console.log(data.data.id);

					if (data.data.id) {
						if (user.type === "student") {
							setTimeout(() => {
								window.location.href = `/live-class?id=${data.data.id}`;
							}, 1000);
						}
						if (user.type === "roleplayer") {
							setTimeout(() => {
								window.location.href = `/live-class?id=${data.data.id}`;
							}, 1500);
						}
						window.location.href = `/live-class?id=${data.data.id}`;
					}
				})
				.catch((err) => console.log("err :", err));
		});

		// axios
		// 	.get(process.env.REACT_APP_SERVER_URL + "/get-rooms/" + user.id)
		// 	.then((data) => {
		// 		let rooms = JSON.stringify(data.data.rooms);
		// 		localStorage.setItem("rooms", rooms);
		// 	});

		// console.log("component loaded");

		return () => {
			socket.disconnect();
		};
	}, []);

	return <div></div>;
}

export default JoinExam;

// {
//     "roomId": "63d46efac23becb0990f6884",
//     "time": "Sat, 28 Jan 2023 02:00:00 GMT",
//     "durarion": 2,
//     "delay": false
// }
