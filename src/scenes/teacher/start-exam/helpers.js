import axios from "axios";

export const makeTotal = (list, m) => {
	let newMar =
		list.reduce((mark, cmark) => {
			if (cmark.mark) {
				return mark + cmark.mark;
			} else {
				return mark;
			}
		}, 0) / list.length;
	let totalMark = Math.floor(newMar) + Number(m);
	return totalMark;
};

// document.cookie.split('=')[1]
export const SubmitMark = (result, cId, eId, cb) => {
	axios
		.post(
			process.env.REACT_APP_SERVER_URL + "/teacher/submit-mark",
			{
				...result,
				cId,
				eId,
			},

			{
				headers: {
					Authorization: `Bearer ${document.cookie.split("=")[1]}`,
				},
			}
		)
		.then((data) => {
			cb(null, data.data.msg);
		})
		.catch((err) => {
			cb(err, null);
		});
};
