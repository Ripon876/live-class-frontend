import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CircleIcon from "@mui/icons-material/Circle";

function SingleResult({ data, count }) {

	return (
		<div className='mb-5'>
			<Box component="div" m="40px 40px " width="90%" p="0 0 0 20px">
				<Typography variant="h3" align="center">
					Staion #{count}
				</Typography>
				<div className="my-4 border-bottom pb-3">
					<p className="mb-0">
						Comment: <strong>{data?.comment}</strong>
					</p>
					<p className="mb-0">
						Mark: <strong>{data?.mark}</strong>
					</p>
				</div>
				<div className="row justify-content-between">
					{data?.list?.map((category, i) => (
						<div className="col-md-6">
							<h5>
								{i + 1}. {category?.title}
							</h5>

							{category?.questions?.map((question, i) => (
								<div className="ms-4">
									<h5>
										<CircleIcon
											sx={{
												fontSize: "15px",
												paddingRight: "5px",
											}}
										/>{" "}
										{question?.title}{" "}
										{question.passed ? (
											<CheckCircleIcon
												color="success"
												sx={{
													fontSize: "20px",
												}}
												className="me-2"
											/>
										) : (
											<CancelIcon
												color="error"
												sx={{
													fontSize: "20px",
												}}
												className="me-2"
											/>
										)}
									</h5>
								</div>
							))}
						</div>
					))}
				</div>
			</Box>
		</div>
	);
}

export default SingleResult;
