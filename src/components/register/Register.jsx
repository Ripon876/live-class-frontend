import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const handleChange = (e) => {
		let value = e.target.value;
		setFormData({
			...formData,
			[e.target.name]: value,
		});
	};

const handleSubmit = (e) => {
	e.preventDefault();
	console.log(formData);
}

	return (
		<div>
			<div className="container">
				<div className="registerForm">
					<div className="border formContainer p-4 rounded-2 shadow-sm">
						<form>
							<h4 className="text-center fw-bold">Register</h4>
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
