import { useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

function CheckList({ fd, sfd }) {
	let initialList = [
		{
			title: "Speaking Quality",
			required: false,
		},
		{
			title: "Explanations",
			required: false,
		},
		{
			title: "Appearance",
			required: false,
		},
		{
			title: "Answers Quality",
			required: false,
		},
	];

	const [checkList, setCheckList] = useState(initialList);

	const handleChange = (e) => {
		if (e.target.checked) {
			let list = [...checkList];
			let itemIndex = list.findIndex(
				(item) => item.title === e.target.name
			);
			list[itemIndex].required = true;
			setCheckList(list);
		}
		let requiredItems = checkList.filter((item) => item.required);

		sfd({
			...fd,
			checklist: requiredItems,
		});
	};

	const clear = () => {
		setCheckList(initialList);
	};

	return (
		<div className="ms-2 d-flex">
			<FormGroup>
				{checkList?.slice(0, 2)?.map((item) => (
					<FormControlLabel
						control={
							<Checkbox
								color="success"
								name={item.title}
								onChange={handleChange}
							/>
						}
						label={item.title}
					/>
				))}
			</FormGroup>
			<FormGroup>
				{checkList?.slice(2, 4)?.map((item) => (
					<FormControlLabel
						control={
							<Checkbox
								color="success"
								name={item.title}
								onChange={handleChange}
							/>
						}
						label={item.title}
					/>
				))}
			</FormGroup>
		</div>
	);
}

export default CheckList;
