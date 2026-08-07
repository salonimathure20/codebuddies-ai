import { Field, Form } from "components/Form";
import { Header } from "components/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "hooks/use-auth";

import "styles/pages/login.css";

export const Login = () => {
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleLogin = async (formData: Record<string, string>) => {
    const { EmailAddress: email, Password: password } = formData;

    try {
      login(email, password);
    } catch (err) {
      setError(`Error: ${err}`);
    }
  };
  const formFields: Array<Field> = [
    {
      name: "EmailAddress",
      type: "email",
      label: "Email Address",
      placeholder: "john.doe@example.com",
    },
    {
      name: "Password",
      type: "password",
      label: "Password",
      placeholder: "",
    },
  ];
  return (
    <div className="login-main">
      <Header isLandingPage showNotificationsRow={false} />
      <div className="login-div">
        <div className="login-text">
          <h1>Log in</h1>
          <span>
            Don't have an account?
            <span
              style={{ color: "var(--primaryOrange)", cursor: "pointer" }}
              onClick={() => navigate("/sign-up")}
            >
              {" "}
              Sign up here
            </span>
          </span>
        </div>
        <Form fields={formFields} onSubmit={handleLogin} />

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
};
