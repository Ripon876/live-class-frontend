import axios from "axios";

const initialFormData = {
	title: "",
	subject: "",
	teacher: "",
	classDuration: "",
	startTime: "10:30",
};

// handle form submit
export const Submit = (fd, token, cls, setClss, setFd, setAlt, setCS, rI) => {
	axios
		.post(
			process.env.REACT_APP_SERVER_URL + "/admin/create-new-class",
			fd,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		)
		.then((data) => {
			// console.log(data.data);
			setFd({
				...initialFormData,
			});
			setClss([data.data.class, ...cls]);
			checkExams([data.data.class], setCS);
			setAlt({
				show: true,
				type: "success",
				msg: data.data.message,
			});
			rI();
			closeAlert(setAlt);
		})
		.catch((err) => {
			console.log("err : ", err);
			setAlt({
				show: true,
				type: "error",
				msg: err.data.message,
			});
			closeAlert(setAlt);
		});
};

// handle exam delete
export const Delete = (id, cls, setClss, setAlt, setCS, gr) => {
	axios
		.delete(process.env.REACT_APP_SERVER_URL + "/admin/delete-class", {
			data: {
				id: id,
			},
		})
		.then((data) => {
			let newCLasses = cls.filter((cl) => cl._id !== id);
			setClss(newCLasses);
			checkExams(newCLasses, setCS);
			gr();
			setAlt({
				show: true,
				type: "success",
				msg: data.data.message,
			});
			closeAlert(setAlt);
		})
		.catch((err) => {
			console.log("err : ", err);
			setAlt({
				show: true,
				type: "error",
				msg: err.data.message,
			});
			closeAlert(setAlt);
		});
};

// handle exams start
export const Start = (socket, setClss, setAlt, setSp, data) => {
	socket.emit("startClasses", data, (msg, err) => {
		if (msg) {
			setSp(true);
			setAlt({
				show: true,
				type: "success",
				msg: msg,
			});
			closeAlert(setAlt);
		} else {
			setAlt({
				show: true,
				type: "error",
				msg: err,
			});
			closeAlert(setAlt);
		}
	});

	setTimeout(() => {
		axios
			.get(process.env.REACT_APP_SERVER_URL + "/admin/get-classes")
			.then((data) => setClss([...data.data.classes].reverse()))
			.catch((err) => console.log("err :", err));
	}, 13000);
};

//  handleing renewing exam
export const Renew = (token, setExams, setAlt, time) => {
	axios
		.get(
			process.env.REACT_APP_SERVER_URL +
				"/admin/renew-exams?time=" +
				time,
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		)
		.then((data) => {
			setAlt({
				show: true,
				type: "success",
				msg: "Exams renewed",
			});
			closeAlert(setAlt);
			setExams([...data.data.exams].reverse());
		})
		.catch((err) => {
			console.log("err :", err);
			setAlt({
				show: true,
				type: "error",
				msg: "something went wrong",
			});
			closeAlert(setAlt);
		});
};

export const subjects = [
	{
		value: "English",
		label: "English",
	},
	{
		value: "Math",
		label: "Math",
	},
	{
		value: "Physics",
		label: "Physics",
	},
	{
		value: "Biology",
		label: "Biology",
	},
];

export const checkExams = (clses, setCS) => {
	if (clses.length === 0) {
		setCS(false);
		return;
	}
	for (let cls of clses) {
		if (cls.status === "Not Started") {
			setCS(true);
			return;
		}
	}
};
export const closeAlert = (setAlt) => {
	setTimeout(() => {
		setAlt({
			show: false,
			type: "",
			msg: "",
		});
	}, 3500);
};

export const getExams = (setExms, setCS) => {
	axios
		.get(process.env.REACT_APP_SERVER_URL + "/admin/get-classes")
		.then((data) => {
			setExms([...data.data.classes].reverse());
			checkExams(data.data.classes, setCS);
		})
		.catch((err) => console.log("err :", err));
};

export const getExaminers = (setE) => {
	axios
		.get(process.env.REACT_APP_SERVER_URL + "/admin/get-examiners")
		.then((data) => {
			setE([...data.data.roles]);
			// console.log(data.data.roles);
		})
		.catch((err) => console.log("err :", err));
};

export const getRoleplayers = (setR) => {
	axios
		.get(process.env.REACT_APP_SERVER_URL + "/admin/get-roleplayers")
		.then((data) => {
			setR([...data.data.roles]);
			// console.log(data.data.roles);
		})
		.catch((err) => console.log("err :", err));
};

export const fileToBase64 = (file, cb) => {
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = function () {
		cb(null, reader.result);
	};
	reader.onerror = function (error) {
		cb(error, null);
	};
};
