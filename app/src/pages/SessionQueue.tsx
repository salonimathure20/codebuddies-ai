import { useEffect, useState } from "react";
import "styles/pages/session-queue.css";
import AvatarImg from "assets/avatar.png";
import { Header } from "components/Header";
import { Navbar } from "components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "hooks/use-auth";
import { fetchSessionById, updateSesionStatus } from "services/session-service";
import { ISession } from "src/models/session";
import { Avatar } from "components/Avatar";

export const SessionQueue = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [buttonValue, setButtonValue] = useState("");
  const [fetchedSession, setFetchedSession] = useState<ISession>();

  const [handleClick, setHandleClick] = useState<() => Promise<void>>(
    () => async () => {}
  );

  const { session, proctor } = location.state || {};

  const onCallClick = async (channelName: string, userName: string) => {
    const query = new URLSearchParams({
      channelName,
      userName,
    }).toString();
    navigate("/video-call?" + query, {
      state: { sessionId: session?._id, coderName: session?.coderId?.name },
    });
  };

  const renderQueueMessages = () => {
    switch (fetchedSession?.status) {
      case "created":
        setMessage(`Waiting for ${proctor} to accept your request`);
        setButtonValue("Cancel");
        setHandleClick(() => async () => {
          await updateSesionStatus(session._id, "cancelled");
          navigate("/dashboard");
        });
        break;
      case "joined":
        setMessage(`${proctor} has accepted your request!`);
        setButtonValue("Start Session");
        setHandleClick(() => async () => {
          onCallClick(`channel-${session._id}`, `${proctor}`);
        });
        break;
      case "declined":
        setMessage(`Unfortunately ${proctor} has declined your request.`);
        setButtonValue("Find live proctors");
        setHandleClick(() => async () => {
          navigate("/live-coder");
        });
        break;

      default:
        setMessage(`Waiting for ${proctor} to accept your request`);
        setButtonValue("Cancel");
        setHandleClick(() => async () => {
          await updateSesionStatus(session._id, "cancelled");
          navigate("/dashboard");
        });
        break;
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const result = await fetchSessionById(session?._id);
      setFetchedSession(result);
    };
    const intervalId = setInterval(() => {
      fetchSession();
    }, 5000);
    renderQueueMessages();

    return () => {
      clearInterval(intervalId);
    };
  }, [fetchedSession?.status]);

  return (
    <>
      <Header
        headerLabel="Dashboard"
        showButton={true}
        buttonLabel="Dashboard"
        buttonClick={() => {}}
      />
      <Navbar avatarImgSrc={AvatarImg} />
      <div className="session-screen">
        <div className="avatars">
          <Avatar
            imgSrc={`https://codebuddies-project.s3.amazonaws.com/profile-pictures/${user?.id}`}
            avatarHeight="150px"
            avatarWidth="150px"
          ></Avatar>

          <div className="dotted-line"></div>
          <Avatar
            imgSrc={`https://codebuddies-project.s3.amazonaws.com/profile-pictures/${fetchedSession?.proctorId}`}
            avatarHeight="150px"
            avatarWidth="150px"
          ></Avatar>
        </div>
        <p className="confirmation-message">{message}</p>
        <button className="start-session-button" onClick={() => handleClick()}>
          {buttonValue}
        </button>
      </div>
    </>
  );
};
