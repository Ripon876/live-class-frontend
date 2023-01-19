import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

function ExamDetail({ exam }) {
	return (
		<div>
			<CircularProgress size="100px" mt="50px" color="success" />
			<Typography variant="h3" mt="150px">
				' {exam.title} '
			</Typography>
			<Typography variant="h4" mb="20px">
				Each session will be : {exam.classDuration} min
			</Typography>
		</div>
	);
}

export default ExamDetail;
