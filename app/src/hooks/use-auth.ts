import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../store/user-store";
import { login, logout, reloadReducer } from "../store/auth-actions";
import { AppDispatch } from "src/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    reload();
  }, []);

  const loginUser = async (email: string, password: string) => {
    await dispatch(login({ email, password }));
    navigate("/dashboard");
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");

    if (token && !user?.id) {
      reload();
    }

    return token;
  };

  const reload = () => {
    dispatch(reloadReducer({}));
  };
  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    isAuthenticated,
    user,
    login: loginUser,
    logout: logoutUser,
  };
};
