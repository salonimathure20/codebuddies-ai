import { Header } from "components/Header";
import { LiveUsersPanel } from "components/LiveUsersPanel";
import { Navbar } from "components/Navbar";
import AvatarImg from "assets/avatar.png";
import "styles/pages/live-coder.css";
import ProfileCard from "components/ProfileCard";
import CoderDetails from "components/CoderDetails";
import { useState, useEffect } from "react";
import { fetchActiveUsers } from "services/user-service";
import { IUser } from "src/models/user";
import { useAuth } from "hooks/use-auth";
import { Select, MenuItem } from "@mui/material";
import { ISession } from "src/models/session";
import { ExpandMoreOutlined } from "@mui/icons-material";
import { IProfile } from "src/models/profiles";
import { fetchUserProfile } from "services/profile-service";

export const LiveCoder = () => {
  const [activeUsers, setActiveUsers] = useState<IUser[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [profileDetails, setProfileDetails] = useState<IProfile>();
  const [requestedUser, setRequestedUser] = useState<IUser>();
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const { user } = useAuth();
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const userData = await fetchActiveUsers(user?.organizationId);

        setActiveUsers(userData); // Set the fetched users
      } catch (err) {
        console.log(err);
      }
    };

    loadUsers(); // Call the function to fetch users
  }, []);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profileData = await fetchUserProfile(user?.id!);
        console.log(profileData);
        setProfileDetails(profileData); // Set the fetched users
      } catch (err) {
        console.log(err);
      }
    };
    if (user?.id) {
      loadUserProfile();
    }

    // Call the function to fetch users
  }, [user]);

  const payload: ISession = {
    coderId: user?.id!,
    proctorId: requestedUser?._id!,
    videoUrl: "",
    code: "",
    allottedTime: selectedTime,
    language: selectedLanguage,
    status: "created",
    date: Date.now(),
  };

  return (
    <div className="live-coder-main">
      <Header
        headerLabel="You are currently live"
        showButton={true}
        buttonLabel="Go Live"
        buttonClick={() => {}}
      />
      <Navbar avatarImgSrc={AvatarImg} />
      <LiveUsersPanel
        proctorList={activeUsers}
        setShowProfile={setShowProfile}
        setRequestedUser={setRequestedUser}
      />

      <div className="live-coder-content">
        <div className="live-code-left-panel">
          <div className="dropdown-div">
            <p className="textfield-label">Select Language</p>
            <Select
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
              }}
              className="textfield-select"
              sx={{
                color: "#ffffff",

                padding: "0 10px",
              }}
              IconComponent={() => (
                <ExpandMoreOutlined sx={{ color: "#ffffff" }} />
              )}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#0b0b1e",
                    color: "var(--primaryWhite)",
                  },
                },
              }}
            >
              <MenuItem value={"Javascript"} className="menu-item">
                Javascript
              </MenuItem>
              <MenuItem value={"Python"} className="menu-item">
                Python
              </MenuItem>
              <MenuItem value={"Java"} className="menu-item">
                Java
              </MenuItem>
            </Select>
          </div>

          <div className="dropdown-div">
            <p className="textfield-label">Select Duration</p>
            <Select
              value={selectedTime}
              onChange={(e) => {
                setSelectedTime(e.target.value);
              }}
              className="textfield-select"
              sx={{
                color: "#ffffff",

                padding: "0 10px",
              }}
              IconComponent={() => (
                <ExpandMoreOutlined sx={{ color: "#ffffff" }} />
              )}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#0b0b1e",
                    color: "var(--primaryWhite)",
                  },
                },
              }}
            >
              <MenuItem value={"30 minutes"} className="menu-item">
                30 minutes
              </MenuItem>
              <MenuItem value={"60 minutes"} className="menu-item">
                60 minutes
              </MenuItem>
              <MenuItem value={"90 minutes"} className="menu-item">
                90 minutes
              </MenuItem>
            </Select>
          </div>

          <CoderDetails
            name={user?.name ?? ""}
            role="Full Stack Developer"
            avatar={`https://codebuddies-project.s3.amazonaws.com/profile-pictures/${user?.id}`}
            status={true}
            description={profileDetails?.bio!}
            skills={profileDetails?.techSkills!}
            time={selectedTime}
            message={`Hey Buddy! Are you free to connect for a ${selectedTime} session?`}
          />
        </div>

        {showProfile && (
          <ProfileCard
            name={requestedUser?.name}
            role={"Senior Developer"}
            avatar={`https://codebuddies-project.s3.amazonaws.com/profile-pictures/${requestedUser?._id}`}
            about={
              "Experienced Senior Full Stack Developer with expertise in building scalable web applications and leading development teams. Currently freelancing as a proctor for a buddy programming platform, mentoring developers, assessing technical skills, and fostering collaborative coding environments to help programmers achieve their goals."
            }
            techStack={[
              "Java",
              "Python",
              "C++",
              "Ruby",
              "Web Development",
              "MERN",
            ]}
            company={"Google"}
            sessions={3}
            payload={payload}
          />
        )}
      </div>
    </div>
  );
};
