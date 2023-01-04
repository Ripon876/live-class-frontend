import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";



function Preloader({cls,call,rf}) {
	return (
		<div style={{ marginTop: "100px" }}>
			<CircularProgress size="100px" mt="50px" color="success" />
			<Typography variant="h3" mt="40px">
				' {cls?.title} '
			</Typography>

			<Typography variant="h4">Subject : {cls?.subject}</Typography>
			<Typography variant="h4" mb="20px">
				Class will be : {cls?.classDuration} min
			</Typography>
			<Typography variant="h2" mb="20px">
				Getting You In
			</Typography>
			<Button
				variant="contained"
				size="large"
				style={{ display: "none" }}
				onClick={() => call(cls._id)}
				ref={rf}
			>
				Join
			</Button>
		</div>
	);
}

export default Preloader;