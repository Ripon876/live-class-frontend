import React, { useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";

function ProgressBar({
	og,
	ee,
	exam,
	pr,
	setPr,
	setOg,
	ct,
	pTime,
	taken,
	setTaken,
	socket,
}) {
	useEffect(() => {
		const timer = setInterval(() => {
			setPr((oldProgress) => {
				// console.log(oldProgress);

				if (oldProgress === 100) {
					setOg(false);
					// console.log("closing tiemr");
					clearInterval(timer);
					setTimeout(() => {
						socket.emit("markedTaken", taken, exam._id, () => {
							// console.log("marking taken");
							setTaken((t) => t + 1);
						});
					}, 1500);
					return 0;
				}

				return oldProgress + 1;
			});
		}, pTime);

		// setTimeout(() => {
		// 	setOg(false);
		// 	console.log("hiding tiemr");
		// }, exam?.classDuration * 60 * 1000 + 5);

		return () => {
			clearInterval(timer);
		};
	}, [exam]);

	return (
		<>
			{og && !ee && (
				<LinearProgress
					variant="determinate"
					color="success"
					value={pr}
				/>
			)}
		</>
	);
}

export default ProgressBar;
