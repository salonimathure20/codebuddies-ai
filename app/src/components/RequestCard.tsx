import { ButtonComponent } from "components/Button";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateSesionStatus } from "services/session-service";
import "styles/components/request-card.css"; // Import the corresponding CSS file
import AvatarImg from "assets/AvatarImg.png";

interface RequestCardProps {
  sessionId: string;
  name: string;
  time: string;
  avatarUrl: string;
  proctorName: string;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  name,
  time,
  avatarUrl,
  sessionId,
  proctorName,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(avatarUrl || AvatarImg);
  const navigate = useNavigate();
  const onCallClick = async (channelName: string, userName: string) => {
    const query = new URLSearchParams({
      channelName,
      userName,
    }).toString();
    navigate("/video-call?" + query, {
      state: {
        proctorName,
        sessionId,
      },
    });
  };
  const handleClick = async (answer: string) => {
    switch (answer) {
      case "accept":
        await updateSesionStatus(sessionId, "joined");
        await onCallClick(`channel-${sessionId}`, `${name}`);
        break;
      case "decline":
        await updateSesionStatus(sessionId, "declined");
        break;
      default:
        break;
    }
  };
  return (
    <div className="request-card">
      <div className="card-left">
        <img
          src={currentSrc}
          onError={() => setCurrentSrc(AvatarImg)}
          alt={`${name}'s avatar`}
          className="avatar"
        />
        <span className="name">{name}</span>
      </div>
      <div className="card-right">
        <span className="time">{time}</span>
        <ButtonComponent
          value={"Accept"}
          handleClick={() => handleClick("accept")}
          id={"accept-button"}
        />
        <button className="close-button" onClick={() => handleClick("decline")}>
          ✕
        </button>
      </div>
    </div>
  );
};
