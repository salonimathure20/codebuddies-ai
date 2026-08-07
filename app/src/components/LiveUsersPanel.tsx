import { Avatar } from "components/Avatar";
import React, { useEffect, useState } from "react";
import { IUser } from "src/models/user";
import "styles/components/liveuserspanel.css";
import { useAuth } from "hooks/use-auth";
import { VisibilityOutlined } from "@mui/icons-material";

interface Props {
  proctorList?: IUser[];
  setShowProfile?: any;
  setRequestedUser?: any;
}

export const LiveUsersPanel: React.FC<Props> = ({
  proctorList,
  setShowProfile,
  setRequestedUser,
}) => {
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>();
  const { user } = useAuth();
  const filterUsers = () => {
    if (user?.userType === "coder") {
      let filteredList: IUser[] | undefined;
      if (user?.organizationId) {
        filteredList = proctorList?.filter(
          (p: IUser) =>
            p.userType === "proctor" &&
            user?.organizationId === p?.organizationId
        );
      } else {
        filteredList = proctorList?.filter(
          (p) => p.userType === "proctor" && !p.organizationId
        );
      }
      setFilteredUsers(filteredList);
    } else {
      let filteredList: IUser[] | undefined;
      if (user?.organizationId) {
        filteredList = proctorList?.filter(
          (p) =>
            p.userType === "coder" && user?.organizationId === p.organizationId
        );
      } else {
        filteredList = proctorList?.filter(
          (p) => p.userType === "coder" && !p.organizationId
        );
      }
      setFilteredUsers(filteredList);
    }
  };

  useEffect(() => {
    filterUsers();
  }, [proctorList]);
  return (
    <div className="live-users-panel-main">
      <h3>Currently active</h3>
      {filteredUsers?.map((proctor, index) => (
        <div className="proctor-list-item" key={`${proctor}-${index}`}>
          <div className="live-user-left">
            <Avatar
              imgSrc={`https://codebuddies-project.s3.amazonaws.com/profile-pictures/${proctor?._id}`}
              avatarHeight="30px"
              avatarWidth="30px"
            />
            <div className="status-indicator-panel"></div>
            <p>{proctor.name}</p>
          </div>
          <div
            className="visibility-div"
            onClick={async () => {
              setRequestedUser(proctor);

              setShowProfile(true);
            }}
          >
            <VisibilityOutlined />
          </div>
        </div>
      ))}
    </div>
  );
};
