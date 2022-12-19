import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useCookies } from "react-cookie";

function StartClassAsTeacher() {
	const [cls, setCls] = useState({});
	const [searchParams, setSearchParams] = useSearchParams();
	const [cookies, setCookie] = useCookies([]);

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

	return (
		<div style={{ overflowY: "scroll", maxHeight: "90%" }}>
			<Box component="div" m="40px 40px " width="90%" p="0 0 0 20px">
				<Typography variant="h4" mb="20px">
					Start This class
				</Typography>
			</Box>
		</div>
	);
}

export default StartClassAsTeacher;
