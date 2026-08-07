import { Header } from "components/Header";
import { LiveUsersPanel } from "components/LiveUsersPanel";
import { Navbar } from "components/Navbar";
import Tabs from "components/Tabs";
import Thumbnail from "components/Thumbnail";
import SessionPreviewImg from "assets/sessionpreview.png";
import "styles/pages/dashboard.css";
import { useAuth } from "hooks/use-auth";
import { useEffect, useState } from "react";
import { IUser } from "src/models/user";
import { fetchActiveUsers } from "services/user-service";
import { fetchSessionsForCoder } from "services/session-service";
import { useNavigate } from "react-router-dom";
import { ButtonComponent } from "components/Button";
import { Modal } from "components/Modal";
import { SignUp } from "./SignUp";

export const Dashboard = () => {
  const navigate = useNavigate();
  const [activeUsers, setActiveUsers] = useState<IUser[]>([]);
  const [sessions, setSessions] = useState<any>([]);
  const [showModal, setShowModal] = useState(false);

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
  }, [user]);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        if (!user?.id) {
          return;
        }
        const sessionData = await fetchSessionsForCoder(user?.id!);
        setSessions(sessionData || []); // Set the fetched users
      } catch (err) {
        console.log(err);
      }
    };

    loadSessions(); // Call the function to fetch users
  }, [user?.id]);
  const tabData = [
    {
      label: "Videos",
      content: (
        <>
          {sessions
            .filter((f: any) => f.videoUrl !== undefined)
            .map((s: any) => (
              <Thumbnail
                buddy={s?.proctorId?.name}
                date={s.date}
                language={s.language}
                videoUrl={s.videoUrl!}
                codePreviewUrl={SessionPreviewImg}
              />
            ))}
        </>
      ),
    },
    {
      label: "Code",
      content: <div>Here is your Code.</div>,
    },
  ];

  const handleGoLiveClick = async () => {
    if (user?.userType === "coder") {
      navigate("/live-coder");
    } else {
      navigate("/session-requests");
    }
  };

  const handleAddUser = () => {
    setShowModal(true);
  };
  return (
    <>
      <div className="dashboard-main">
        <Header
          headerLabel={
            user?.isOrganizationUser ? "Admin Dashboard" : "Dashboard"
          }
          showButton={true}
          buttonLabel="Go live"
          buttonClick={handleGoLiveClick}
          showBackButton={false}
        />
        <Navbar
          avatarImgSrc={`https://codebuddies-project.s3.amazonaws.com/profile-pictures/${user?.id}`}
        />
        {!user?.isOrganizationUser && (
          <>
            <LiveUsersPanel proctorList={activeUsers} />

            <div className="dashboard-content">
              <Tabs tabs={tabData} />
            </div>
          </>
        )}
        {user?.isOrganizationUser && (
          <ButtonComponent
            value="Add User"
            id="add-user"
            handleClick={handleAddUser}
          />
        )}
      </div>
      {showModal && (
        <Modal
          style={{ background: "#030315" }}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={() => {}}
          children={<SignUp inModal />}
        />
      )}
    </>
  );
};
