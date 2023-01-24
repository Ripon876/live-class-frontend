import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function PdfPopUp({ op, setOp, pdf }) {
	const [open, setOpen] = useState(false);
	const [scroll, setScroll] = useState("paper");

	const handleClose = () => {
		setOp(false);
	};

	return (
		<div>
			<Dialog
				fullWidth={true}
				maxWidth="md"
				open={true}
				onClose={() => {
					setOp(false);
				}}
				scroll="paper"
				aria-labelledby="scroll-dialog-title"
				aria-describedby="scroll-dialog-description"
			>
				<DialogTitle id="scroll-dialog-title">PDF</DialogTitle>
				<DialogContent dividers={true} sx={{height: '55vh'}}>
					<div className='h-100 w-100'>
						<iframe
							src={pdf + "#toolbar=0"}
							width="100%"
							height="100%"
						/>
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Close</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default PdfPopUp;
