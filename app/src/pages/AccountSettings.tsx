import { Header } from "components/Header";
import { Navbar } from "components/Navbar";
import "styles/pages/account-settings.css";
import {
  ArrowForwardIosOutlined,
  DeleteOutlineOutlined,
  EditOutlined,
  LockResetOutlined,
  NotInterestedOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Modal } from "components/Modal";
import { useAuth } from "hooks/use-auth";

export const AccountSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  return (
    <>
      <Header headerLabel="Account Settings" />
      <Navbar
        avatarImgSrc={`https://codebuddies-project.s3.amazonaws.com/profile-pictures/${user?.id}`}
      />
      <div className="account-settings">
        <div className="icon link-div" onClick={() => navigate("/profile")}>
          <EditOutlined />
          <p>Create/Update profile</p>
          <ArrowForwardIosOutlined />
        </div>
        <div className="icon link-div">
          <LockResetOutlined />
          <p>Reset Password</p>
          <ArrowForwardIosOutlined />
        </div>
        <div
          className="icon link-div"
          onClick={() => {
            setTitle("Deactivate Account");
            setMessage(
              "Are you sure you want to deactivate your account? This action is temporary and you can activate your account later."
            );
            setShowModal(true);
          }}
        >
          <NotInterestedOutlined />
          <p>Deactivate Account</p>
          <ArrowForwardIosOutlined />
        </div>
        <div
          className="icon link-div"
          onClick={() => {
            setTitle("Delete Account");
            setMessage(
              "Are you sure you want to delete your account? This action cannot be undone"
            );
            setShowModal(true);
          }}
        >
          <DeleteOutlineOutlined />
          <p>Delete Account</p>
          <ArrowForwardIosOutlined />
        </div>
      </div>
      {showModal && (
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={() => {}}
          message={message}
          title={title}
        />
      )}
    </>
  );
};
