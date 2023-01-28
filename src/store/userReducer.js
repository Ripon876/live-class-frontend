import jwt_decode from "jwt-decode";

let token = document.cookie.split("=")[1];

let initialData = {
  type: "",
  id: "",
  name: "",
};

if (token) {
  let user = jwt_decode(token);
  initialData.type = user.type;
  initialData.id = user.id;
  initialData.name = user.name;
}
const userReducer = (state = initialData, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        type: action.user.type,
      };
      break;
    default:
      return state;
  }
};

export default userReducer;
