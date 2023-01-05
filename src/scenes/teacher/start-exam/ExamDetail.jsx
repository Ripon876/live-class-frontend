import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function ExamDetail({ exam, se }) {
	return (
		<div>
			<Typography variant="h3" mt="150px">
				' {exam.title} '
			</Typography>
			<Typography variant="h4" mb="20px">
				Each session will be : {exam.classDuration} min
			</Typography>

			{exam.hasToJoin !== 0 && (
				<Button variant="contained" size="large" onClick={se}>
					Start Exam
				</Button>
			)}
		</div>
	);
}

export default ExamDetail;
