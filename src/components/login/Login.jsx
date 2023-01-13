import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import "./Login.css";

function Login() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [errMsg, setErrMsg] = useState("");
	const [sucMsg, setSucMsg] = useState("");
	const navigate = useNavigate();
	const [cookies, setCookie] = useCookies([]);
	const dispatch = useDispatch();

	useEffect(() => {
		if (cookies.token) {
			navigate("/");
		}
	}, []);

	const handleChange = (e) => {
		let value = e.target.value;
		setFormData({
			...formData,
			[e.target.name]: value,
		});
	};

	const handleSubmit = (e) => {
		setSucMsg("");
		setErrMsg("");
		e.preventDefault();

		axios
			.post(process.env.REACT_APP_SERVER_URL + "/login", {
				...formData,
			})
			.then((data) => {
				setSucMsg("Logged In Successfully");
				setCookie("token", data.data.token, { path: "/" });

				dispatch({
					type: "SET_USER",
					user: {
						type: data.data.type,
					},
				});

				setTimeout(() => {
					// navigate("/");
					window.location.href = "/";
				}, 1000);
			})
			.catch((err) => {
				setErrMsg(err.response.data.message);
			});
	};
	return (
		<div>
			<div className="container">
				<div className="loginForm">
					<div className="border formContainer p-4 rounded-2 shadow-sm">
						{sucMsg && !errMsg && (
							<div className="alert alert-success" role="alert">
								{sucMsg}. Taking you to the dashboard
							</div>
						)}
						{errMsg && !sucMsg && (
							<div className="alert alert-danger" role="alert">
								{errMsg}
							</div>
						)}

						<form>
							<h4 className="text-center fw-bold">Login</h4>
							<div className="mb-3">
								<label htmlFor="email" className="form-label">
									Email address
								</label>
								<input
									type="email"
									className="form-control"
									id="email"
									name="email"
									onChange={handleChange}
								/>
							</div>
							<div className="mb-3">
								<label
									htmlFor="password"
									className="form-label"
								>
									Password
								</label>
								<input
									type="password"
									className="form-control"
									id="password"
									name="password"
									onChange={handleChange}
								/>
							</div>
							<div className="text-center">
								<button
									className="btn btn-primary btnSubmit mb-2"
									onClick={handleSubmit}
								>
									Login
								</button>
								<p className="mb-0">
									Don't have an account ?
									<Link
										to="/register"
										className="formFooterLink"
									>
										Register now
									</Link>
								</p>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
