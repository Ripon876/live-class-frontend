import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
let socket;
let examId;
function JoinExam() {
	const user = useSelector((state) => state);
	useEffect(() => {
		socket = io.connect(process.env.REACT_APP_SERVER_URL);

		socket.on("connect", () => {
			socket.emit("getExamId", user, (err, id) => {
				if (!err) {
					examId = id;
				} else {
					console.log(err);
				}
			});
		});

		socket.on("startClass", async () => {
			console.log("starting cls");

			socket.emit("getExamId", user, (err, id) => {
				if (!err) {
					examId = id;

					if (user.type === "student") {
						setTimeout(() => {
							window.location.href = `/live-class?id=${id}`;
						}, 1000);
					}
					if (user.type === "roleplayer") {
						setTimeout(() => {
							window.location.href = `/live-class?id=${id}`;
						}, 1500);
					}
					window.location.href = `/live-class?id=${id}`;
				} else {
					console.log(err);
				}
			});
		});

		console.log("component loaded");

		return () => {
			socket.disconnect();
		};
	}, []);

	return <div></div>;
}

export default JoinExam;
