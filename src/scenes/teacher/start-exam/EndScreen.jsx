import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MoodIcon from "@mui/icons-material/Mood";

function EndScreen() {
	return (
		<div>
			<div>
				<MoodIcon
					style={{ fontSize: "200px" }}
					mt="50px"
					color="success"
				/>
				<Typography variant="h2" mb="20px">
					All the candidates have given the exam
				</Typography>
				<a href="/" style={{ textDecoration: "none" }}>
					<Button variant="contained" size="large">
						Back to dashboard
					</Button>
				</a>
			</div>
		</div>
	);
}

export default EndScreen;
