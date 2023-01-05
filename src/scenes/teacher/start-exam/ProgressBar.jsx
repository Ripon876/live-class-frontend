import React, { useEffect } from "react";
import LinearProgress from "@mui/material/LinearProgress";

function ProgressBar({ og, ee, exam, pr, setPr }) {
	useEffect(() => {
		const timer = setInterval(() => {
			if (pr === 110) {
				clearInterval(timer);
			}

			setPr((oldProgress) => {
				return oldProgress + 1;
			});
		}, ((exam.classDuration * 60) / 100) * 1000);

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
