import { ButtonComponent } from "components/Button";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSessionService } from "services/session-service";
import { ISession } from "src/models/session";
import "styles/components/profile-card.css";
import AvatarImg from "assets/AvatarImg.png";

interface ProfileCardProps {
  name?: string;
  role: string;
  avatar: string;
  about: string;
  techStack: string[];
  company: string;
  sessions: number;
  payload: any;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role,
  avatar,
  about,
  techStack,
  company,
  sessions,
  payload,
}) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<ISession>();
  const [currentSrc, setCurrentSrc] = useState<string>(avatar || AvatarImg);

  console.log(session);

  const handleCreateSession = async () => {
    const result = await createSessionService(payload);
    setSession(result);
    navigate("/queue", {
      state: {
        session: result,
        proctor: name,
      },
    });
  };
  return (
    <div className="profile-card">
      <div className="profile-header">
        <img
          src={currentSrc}
          onError={() => setCurrentSrc(AvatarImg)}
          alt={`${name}'s avatar`}
          className="profile-avatar"
        />

        <h2 className="profile-name">{name}</h2>
        <p className="profile-role">{role}</p>
      </div>
      <div className="profile-body">
        <h3>About me</h3>
        <p className="profile-about">{about}</p>
        <h3>My Tech Stack</h3>
        <p className="profile-tech-stack">{techStack.join(", ")}</p>
        <h3>Currently working at</h3>
        <p className="profile-company">{company}</p>
        <h3>Number of successful sessions</h3>
        <p className="profile-sessions">{sessions}</p>
      </div>
      <ButtonComponent
        id={`name-${name}`}
        value="Request"
        handleClick={async () => {
          await handleCreateSession();
        }}
      />
    </div>
  );
};

export default ProfileCard;
