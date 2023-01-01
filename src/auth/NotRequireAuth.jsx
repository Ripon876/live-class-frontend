import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { Outlet, Navigate } from "react-router-dom";

function RequireAuth() {
	const [cookies, setCookie] = useCookies([]);

	// console.log(cookies.token);

	return cookies.token ?  <Navigate to="/" /> : <Outlet />;
}

export default RequireAuth;
