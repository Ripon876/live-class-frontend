import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function Preloader({ cls, call, rf, exId,clsTitle }) {
	return (
		<div style={{ marginTop: "100px",textAlign: 'center' }}>
			<CircularProgress size="100px" mt="50px" color="success" />
			<Typography variant="h3" mt="40px">
				' {cls?.title} {clsTitle && clsTitle}'
			</Typography>

			<Typography variant="h4" mb="20px">
				Exam will be : {cls?.classDuration} min
			</Typography>
			<Typography variant="h2" mb="20px">
				Getting You In
			</Typography>
			<Button
				variant="contained"
				size="large"
				style={{ display: "none" }}
				onClick={() => call(exId)}
				ref={rf}
			>
				Join
			</Button>
		</div>
	);
}

export default Preloader;
