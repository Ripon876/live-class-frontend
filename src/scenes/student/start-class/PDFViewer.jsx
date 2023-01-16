import { useEffect } from "react";
import Timer from "./Timer";

function PDFViewer({ pdf, vf, ssp ,s}) {
	useEffect(() => {
		setTimeout(() => {
			ssp(false);
		}, vf * 60 * 1000);
	}, []);

	return (
		<div className="mt-4">
			{/*<h4 className="text-end">Visible for : {vf} min</h4>*/}
		{s && <Timer  ct={Date.now()} rt={vf}/> }
			<iframe src={pdf + "#toolbar=0"} width="100%" height="600px" />
		</div>
	);
}

export default PDFViewer;
