import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MoodIcon from "@mui/icons-material/Mood";
import Box from "@mui/material/Box";
import VerifiedIcon from "@mui/icons-material/Verified";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DownloadIcon from "@mui/icons-material/Download";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import SingleResult from "./SingleResult";
import { useTheme } from "@mui/material";

function Result() {
	const theme = useTheme();
	const resultContainer = useRef(null);
	const [marks, setMarks] = useState([]);
	const [result, setResult] = useState(0);

	useEffect(() => {
		 

		axios
			.get(process.env.REACT_APP_SERVER_URL + "/student/get-result", {
				headers: {
					Authorization: `Bearer ${document.cookie.split("=")[1]}`,
				},
			})
			.then((data) => {
				setMarks(data.data.marks);
			})
			.catch((err) => console.log("err :", err));
	}, []);

	useEffect(() => {
		let totalMark =
			Number(
				marks.reduce((total, exam) => {
					return total + exam.mark;
				}, 0)
			) / Number(marks.length);

		setResult(Math.floor(totalMark));
	}, [marks]);

	const getPDF = async () => {
		await downloadComponentInPDF(resultContainer.current);
	};
	async function downloadComponentInPDF(Component) {
		await html2canvas(Component, { scale: 2, quality: 1 }).then(
			(canvas) => {
				const componentWidth = Component.offsetWidth;
				const componentHeight = Component.offsetHeight;

				const orientation =
					componentWidth >= componentHeight ? "l" : "p";

				const imgData = canvas.toDataURL("image/png");
				const pdf = new jsPDF({
					orientation,
					unit: "px",
				});

				pdf.internal.pageSize.width = componentWidth;
				pdf.internal.pageSize.height = componentHeight;

				pdf.addImage(
					imgData,
					"PNG",
					0,
					0,
					componentWidth,
					componentHeight
				);
				pdf.save("result.pdf");
			}
		);
	}
	return (
		<div
			style={{
				overflowY: "auto",
				maxHeight: "90%",
			}}
		>
			<Button
				size="normal"
				variant="filled"
				sx={{
					boxShadow: 3,
					ml: 5,
				}}
				onClick={getPDF}
			>
				<DownloadIcon /> Download
			</Button>
			<Box
				component="div"
				m="40px 40px "
				width="90%"
				height="auto"
				p="0 0 0 20px"
				ref={resultContainer}
			>
				<div>
					{marks.length == 0 && (
						<div>
							<Typography style={{ textAlign: "center" }}>
								<span
									style={{
										fontSize: "40px",
										textAlign: "center",
										position: "relative",
									}}
								>
									Result Not Available Right Now
								</span>
							</Typography>
						</div>
					)}

					{marks.length !== 0 &&
						marks?.map((data, i) => (
							<SingleResult
								key={"sdfasd343dfd" + i}
								data={data}
								count={i + 1}
							/>
						))}
				</div>
			</Box>
		</div>
	);
}

export default Result;
