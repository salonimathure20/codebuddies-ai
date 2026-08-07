import React, { useState } from "react";
import "styles/components/header.css";

import { ButtonComponent } from "./Button";
import Logo from "assets/logo-with-name.svg";
import { ArrowBackOutlined, NotificationsOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Avatar } from "components/Avatar";
import { useAuth } from "hooks/use-auth";

//Props interface. Defines all the required props by the component
interface Props {
  headerLabel?: string;
  showButton?: boolean;
  buttonLabel?: string;
  buttonClick?: () => void;
  isLandingPage?: boolean;
  showNotificationsRow?: boolean;
  showBackButton?: boolean;
}

//Common Header Component
export const Header: React.FC<Props> = ({
  headerLabel,
  showButton,
  buttonLabel,
  buttonClick,
  isLandingPage,
  showNotificationsRow,
  showBackButton,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showNotificationsRowVar, setNotificationsRowVar] = useState(
    showNotificationsRow ?? true
  );
  const [showBackArrow, setShowBackArrow] = useState(showBackButton ?? true);
  console.log(setNotificationsRowVar, setShowBackArrow);
  return (
    <div
      className="header-main"
      style={
        isLandingPage
          ? {
              border: "0px solid transparent",

              width: "100vw",
            }
          : { borderBottom: "0.2px solid rgba(255, 255, 255, 0.15)" }
      }
    >
      <div
        className="header-row"
        style={
          isLandingPage
            ? { marginLeft: 0, padding: "0 20px" }
            : {
                marginLeft: "90px",
                width: " calc(100% - 130px)",
                padding: "0 20px",
              }
        }
      >
        {isLandingPage && <img src={Logo} />}

        {!isLandingPage && (
          <div className="arrow-row">
            {showBackArrow && (
              <div
                onClick={() => {
                  navigate(-1);
                }}
              >
                <ArrowBackOutlined />
              </div>
            )}
            <p>{headerLabel}</p>
          </div>
        )}
        {isLandingPage && (
          <div className="quick-links">
            <p>About</p>
            <p>Blogs</p>
            <p>Careers</p>
          </div>
        )}
        {showNotificationsRowVar && (
          <div className="header-button-bell-div">
            {!isLandingPage && <NotificationsOutlined className="icon" />}
            {showButton && (
              <ButtonComponent
                id="header-button"
                value={buttonLabel ?? ""}
                handleClick={buttonClick ? buttonClick : () => {}}
              />
            )}
            {!isLandingPage && (
              <Avatar
                imgSrc={`https://codebuddies-project.s3.amazonaws.com/profile-pictures/${user?.id}`}
                avatarHeight={"40px"}
                avatarWidth={"40px"}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
