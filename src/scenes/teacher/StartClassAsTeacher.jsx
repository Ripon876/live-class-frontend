import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function StartClassAsTeacher() {
	const [cls, setCls] = useState({});
	const [searchParams, setSearchParams] = useSearchParams();
	const [cookies, setCookie] = useCookies([]);
	const [clsStarted, setClsStarted] = useState(false);

	useEffect(() => {
		axios
			.get(
				"http://localhost:5000/teacher/get-class/" +
					searchParams.get("id"),
				{
					headers: { Authorization: `Bearer ${cookies.token}` },
				}
			)
			.then((data) => setCls({ ...data.data.cls }))
			.catch((err) => console.log("err :", err));
	}, []);

	const startClass = () => {
		document.querySelector(".MuiButtonBase-root").click();
		setClsStarted(true);
	};

	return (
		<div style={{ overflowY: "scroll", maxHeight: "90%" }}>
			<Box
				component="div"
				m="40px 40px "
				width="90%"
				p="0 0 0 20px"
				align="center"
			>
				{!clsStarted && (
					<>
						<Typography variant="h3" mt="150px">
							' {cls.title} '
						</Typography>
						<Typography variant="h4" mb="20px">
							Each class will be : {cls.classDuration} min
						</Typography>
						<Button
							variant="contained"
							size="large"
							onClick={startClass}
						>
							Launch
						</Button>
					</>
				)}
			</Box>
		</div>
	);
}

export default StartClassAsTeacher;
