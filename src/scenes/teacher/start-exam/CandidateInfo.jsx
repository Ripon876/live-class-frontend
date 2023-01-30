import Typography from "@mui/material/Typography";

function CandidateInfo({ og, cdn }) {
	return (
		<div>
			<Typography
				variant="h4"
				style={{
					opacity: og ? "1" : 0,
				}}
			>
				Candidate : <b>{cdn}</b>
			</Typography>
		</div>
	);
}

export default CandidateInfo;
