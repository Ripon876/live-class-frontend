import { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import "./Register.css";

function Register() {
	const [formData, setFormData] = useState({
		name: '',
		email: "",
		password: "",
	});
	const [errMsg, setErrMsg] = useState("");
	const [sucMsg, setSucMsg] = useState("");
	const navigate = useNavigate();
const [cookies, setCookie] = useCookies([]);

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
			.post("http://localhost:5000/register", {
				...formData,
			})
			.then((data) => {
				setSucMsg("Account Registered Successfully");
				setTimeout(()=> {
					navigate('/login');
				},1500);
			})
			.catch((err) => {
				setErrMsg(err.response.data.message);
			});
	};

	return (
		<div>
			<div className="container">
				<div className="registerForm">
					<div className="border formContainer p-4 rounded-2 shadow-sm">
						{sucMsg && !errMsg && (
							<div className="alert alert-success" role="alert">
								{sucMsg}
							</div>
						)}
						{errMsg && !sucMsg && (
							<div className="alert alert-danger" role="alert">
								{errMsg}
							</div>
						)}

						<form>
							<h4 className="text-center fw-bold">Register</h4>
							<div className="mb-3">
								<label htmlFor="name" className="form-label">
									Name
								</label>
								<input
									type="name"
									className="form-control"
									id="name"
									name="name"
									onChange={handleChange}
								/>
							</div>
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
									Register
								</button>
								<p className="mb-0">
									Already have an account ?
									<Link
										to="/login"
										className="formFooterLink"
									>
										Login now
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

export default Register;
