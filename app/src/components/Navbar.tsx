import React from "react";
import "styles/components/navbar.css";
import Logo from "assets/cblogo.svg";
import {
  AccountBalanceWalletOutlined,
  LogoutOutlined,
  SettingsOutlined,
} from "@mui/icons-material";

import { useAuth } from "hooks/use-auth";
import { useNavigate } from "react-router-dom";

//Props interface. Defines all the required props by the component
interface Props {
  avatarImgSrc: string;
}

//Common Navbar Component
export const Navbar: React.FC<Props> = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="navbar-main">
      <div className="upper-icons">
        <img src={Logo} height={30} width={30}></img>
        <div onClick={() => navigate("/payments")}>
          <AccountBalanceWalletOutlined className="icon" />
        </div>
        <div onClick={() => navigate("/settings")}>
          <SettingsOutlined className="icon" />
        </div>
      </div>
      <div className="logout-div">
        <div onClick={() => logout()}>
          <LogoutOutlined className="icon" />
        </div>
      </div>
    </div>
  );
};
