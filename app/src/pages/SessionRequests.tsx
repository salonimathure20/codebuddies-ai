import { useEffect, useState } from "react";
import "styles/pages/session-requests.css";
import AvatarImg from "assets/avatar.png";
import { Header } from "components/Header";
import { Navbar } from "components/Navbar";
import { RequestCard } from "components/RequestCard";
import "styles/components/request-card.css";
import { fetchActiveRequestsForProctor } from "services/session-service";
import { useAuth } from "hooks/use-auth";

export const SessionRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any>();
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchRequests();
    }, 5000);
    const fetchRequests = async () => {
      const result = await fetchActiveRequestsForProctor(user?.id!);
      setRequests(result);
    };
    return () => {
      clearInterval(intervalId);
    };
  }, [user?.id]);
  return (
    <>
      <Header
        headerLabel="Session Requests"
        showButton={true}
        buttonLabel="Dashboard"
        buttonClick={() => {}}
      />
      <Navbar avatarImgSrc={AvatarImg} />
      <div className="session-requests-screen">
        <div className="requests">
          {requests?.map((request: any, index: number) => (
            <RequestCard
              key={index}
              name={request.coderId?.name}
              time={request.allottedTime}
              avatarUrl={request.avatarUrl}
              sessionId={request._id}
              proctorName={user?.name!}
            />
          ))}
        </div>
      </div>
    </>
  );
};
