import { Outlet } from "react-router";
import "./App.css";
import SnackbarNotification from "components/SnackBarNotification";

function App() {
  return (
    <div className="app-main">
      <SnackbarNotification />
      <Outlet></Outlet>
    </div>
  );
}

export default App;
