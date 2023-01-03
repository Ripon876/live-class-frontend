import { useEffect } from "react";
import Timer from "./Timer";

function PDFViewer({ pdf, vf, ssp }) {
	useEffect(() => {
		setTimeout(() => {
			ssp(false);
		}, vf * 60 * 1000);
	}, []);

	return (
		<div className="mt-4">
			<h4 className="text-end">Visible for : {vf} min</h4>
			<iframe src={pdf + "#toolbar=0"} width="100%" height="500px" />
		</div>
	);
}

export default PDFViewer;
