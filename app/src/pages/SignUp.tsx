import { Field, Form } from "components/Form";
import { Header } from "components/Header";
import { useAuth } from "hooks/use-auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { signUp } from "services/user-service";
import { showSnackbar } from "store/snackbar-store";
import "styles/pages/sign-up.css";

interface SignUpProps {
  inModal?: boolean;
}

export const SignUp: React.FC<SignUpProps> = ({ inModal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [isOrganization, setIsOrganization] = useState(false);
  const { user } = useAuth();

  const handleToggle = () => {
    setIsOrganization(!isOrganization);
  };

  const handleSignUp = async (formData: Record<string, string>) => {
    const {
      Name: name,
      EmailAddress: email,
      Password: password,
      UserType: userType,
      OrganizationName: organizationName,
    } = formData;

    try {
      await signUp({
        name,
        email,
        password,
        userType,
        isOrganizationUser: inModal ? false : isOrganization,
        organizationName,
        organizationId: user?.organizationId,
      });

      if (inModal) {
        dispatch(
          showSnackbar({ message: "Sign up successful!", severity: "success" })
        );
      }
      navigate("/dashboard");
    } catch (err) {
      setError("Signup failed. Please try again.");
    }
  };

  const baseFormFields: Array<Field> = [
    { name: "Name", type: "text", label: "Name", placeholder: "John Doe" },
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
      placeholder: "Enter a strong password",
    },
    {
      name: "UserType",
      type: "text",
      label: "User Type",
      placeholder: "Coder/Proctor/Admin",
    },
  ];

  const orgField: Field = {
    name: "OrganizationName",
    type: "text",
    label: "Organization Name",
    placeholder: "e.g., Google",
  };

  // Dynamically add the organization field if `isOrganization` is true
  const formFields =
    isOrganization && !inModal ? [...baseFormFields, orgField] : baseFormFields;

  return !inModal ? (
    <div className="sign-up-main">
      <Header isLandingPage showNotificationsRow={false} />
      <div className="sign-up-div">
        <div className="sign-up-text">
          <h1>Create a new account</h1>
          <span>
            Already have an account?
            <span
              style={{ color: "var(--primaryOrange)", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              {" "}
              Log in
            </span>
          </span>
        </div>

        <Form
          fields={formFields}
          onSubmit={handleSignUp}
          toggleSwitch={true}
          handleToggle={handleToggle}
          toggleText="Join as organization"
        />

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  ) : (
    <div className="sign-up-div">
      <div className="sign-up-text">
        <h1>Create a new account</h1>
        <span>
          Already have an account?
          <span
            style={{ color: "var(--primaryOrange)", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            {" "}
            Log in
          </span>
        </span>
      </div>

      <Form
        fields={formFields}
        onSubmit={handleSignUp}
        toggleSwitch={inModal ? false : true}
        handleToggle={handleToggle}
        toggleText="Join as organization"
      />

      {error && <p className="error-text">{error}</p>}
    </div>
  );
};
