import axios from "axios";

const initialFormData = {
	title: "",
	subject: "",
	teacher: "",
	classDuration: "",
	startTime: "10:30",
};

// handle form submit
export const Submit = (fd, token, cls, setClss, setFd, setAlt, setCS) => {
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
			checkClasses([data.data.class], setCS);
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

// handle exam delete
export const Delete = (id, cls, setClss, setAlt, setCS) => {
	axios
		.delete(process.env.REACT_APP_SERVER_URL + "/admin/delete-class", {
			data: {
				id: id,
			},
		})
		.then((data) => {
			let newCLasses = cls.filter((cl) => cl._id !== id);
			setClss(newCLasses);
			checkClasses(newCLasses, setCS);
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

export const checkClasses = (clses, setCS) => {
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

export const getExams = (setExms, setCS) => {
	axios
		.get(process.env.REACT_APP_SERVER_URL + "/admin/get-classes")
		.then((data) => {
			setExms([...data.data.classes].reverse());
			checkClasses(data.data.classes, setCS);
		})
		.catch((err) => console.log("err :", err));
};

export const getExaminers = (setE) => {
	axios
		.get(process.env.REACT_APP_SERVER_URL + "/admin/get-teachers")
		.then((data) => setE([...data.data.teachers]))
		.catch((err) => console.log("err :", err));
};

export const Start = (socket, setClss, setAlt, setSp) => {
	axios
		.get(process.env.REACT_APP_SERVER_URL + "/admin/get-classes")
		.then((data) => setClss([...data.data.classes].reverse()))
		.catch((err) => console.log("err :", err));
	socket.emit("startClasses", (msg, err) => {
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
};
