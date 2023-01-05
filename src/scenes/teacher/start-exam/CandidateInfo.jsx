import Typography from "@mui/material/Typography";

function CandidateInfo({ og, c }) {
	return (
		<div>
			<Typography
				variant="h4"
				style={{
					opacity: og ? "1" : 0,
				}}
			>
				Currently Joined Student : <b>{c?.name}</b>
			</Typography>
		</div>
	);
}

export default CandidateInfo;
