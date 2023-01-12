import React, { useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";

function ProgressBar({ og, ee, exam, pr, setPr, setOg }) {
	useEffect(() => {
		const timer = setInterval(() => {
			if (pr === 100) {
				clearInterval(timer);
				console.log("closing tiemr");
			}

			setPr((oldProgress) => {
				return oldProgress + 1;
			});
		}, ((exam.classDuration * 60) / 100) * 1000);

		setTimeout(() => {
			setOg(false);
			console.log("hiding tiemr");
		}, exam?.classDuration * 60 * 1000 + 5000);

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
