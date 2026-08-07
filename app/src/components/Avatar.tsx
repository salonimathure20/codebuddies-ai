import React, { useState } from "react";
import "styles/components/avatar.css";
import AvatarImg from "assets/AvatarImg.png";

//Props interface. Defines all the required props by the component
interface Props {
  avatarHeight?: string;
  avatarWidth?: string;
  imgSrc?: string;
}

//Common Avatar Component
export const Avatar: React.FC<Props> = ({
  avatarHeight,
  avatarWidth,
  imgSrc,
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(imgSrc || AvatarImg);

  return (
    <div
      className="avatar-main"
      style={{ height: avatarHeight ?? "50px", width: avatarWidth ?? "50px" }}
    >
      <img src={currentSrc} onError={() => setCurrentSrc(AvatarImg)}></img>
    </div>
  );
};
