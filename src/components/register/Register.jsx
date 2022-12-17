import React from "react";

function Register() {
	return (
		<div>
			<form>
				<div className="mb-3">
					<label htmlFor="email" className="form-label">
						Email address
					</label>
					<input
						type="email"
						className="form-control"
						id="email"
						aria-describedby="emailHelp"
					/>
				</div>
				<div className="mb-3">
					<label htmlFor="password" className="form-label">
						Password
					</label>
					<input
						type="password"
						className="form-control"
						id="password"
					/>
				</div>
				<button  className="btn btn-primary">
					Submit
				</button>
			</form>
		</div>
	);
}

export default Register;
