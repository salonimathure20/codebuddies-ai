import { useNavigate } from "react-router-dom";
import { Header } from "components/Header";
import "styles/pages/landing-page.css";
import LandingPageImage from "assets/landing-page-image.svg";

export const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="landing-main">
      <Header
        isLandingPage
        showButton
        buttonLabel="Join"
        buttonClick={() => {
          navigate("/sign-up");
        }}
      />
      <div className="header-text">
        <h1>Redefining the future of</h1>
        <h1>collaborative coding excellence</h1>
      </div>
      <p className="header-desc">Code, Chat, Record and Thrive!</p>
      <img src={LandingPageImage}></img>
    </div>
  );
};
