import React, { useState } from "react";
import "styles/components/code-details.css";
import AvatarImg from "assets/AvatarImg.png";

interface CoderDetailsProps {
  name: string;
  role: string;
  avatar: string;
  status: boolean;
  description: string;
  skills?: string[];
  time: string;
  message: string;
}

const CoderDetails: React.FC<CoderDetailsProps> = ({
  name,
  role,
  avatar,
  status,
  description,
  skills,
  time,
  message,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(avatar || AvatarImg);
  return (
    <div className="buddy-card">
      <div className="buddy-card-header">
        <img
          src={currentSrc}
          alt={`${name}'s avatar`}
          onError={() => setCurrentSrc(AvatarImg)}
          className="buddy-avatar"
        />
        <div className="buddy-info">
          <div className="buddy-name">
            {name}{" "}
            <span
              className={`status-dot ${status ? "online" : "offline"}`}
            ></span>
          </div>
          <p className="buddy-role">{role}</p>
        </div>
      </div>
      <div className="buddy-card-body">
        <p className="buddy-description">{description}</p>
        <p className="buddy-skills">
          <strong>Skills:</strong> {skills?.join(", ")}
        </p>
        <p className="buddy-time">
          <strong>Time:</strong> {time}
        </p>
        <p className="buddy-message">
          <strong>Message:</strong>
        </p>
        <textarea className="buddy-message-box" value={message} />
      </div>
    </div>
  );
};

export default CoderDetails;
