import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
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
      .post(process.env.REACT_APP_SERVER_URL + "/register", {
        ...formData,
      })
      .then((data) => {
        // console.log(data.data.message);
        // setSucMsg("Account Registered Successfully");
        setSucMsg(data.data.message +  ", Use demo credentials to login");
        setTimeout(() => {
          navigate("/login");
        }, 3500);
      })
      .catch((err) => {
        setErrMsg(err.response.data.message);
      });
  };

  return (
    <div>
      <div className="container">
        <div className="registerForm pt-5">
          <div className="formHeader">
            <div>
              <div className="align-items-center row justify-content-center">
                <div className="col-3">
                  <img
                    src="./logo-form.png"
                    alt=""
                    className="img-fluid"
                    style={{
                      maxWidth: "130px",
                    }}
                  />
                </div>
                <div className="col-6 text-center">
                  <div>
                    <h1 className="display-4 fw-bold mb-0">
                      Welcome to RFA Tutors
                    </h1>
                    <h5 className="mb-0 text-secondary">
                      Your practice partner for your exams
                    </h5>
                  </div>
                </div>
                <div className="col-3">
                  <div></div>
                </div>
              </div>
            </div>
            <hr className="mx-auto mt-1  " />
          </div>

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
                <label htmlFor="password" className="form-label">
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
                  <Link to="/login" className="formFooterLink">
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
