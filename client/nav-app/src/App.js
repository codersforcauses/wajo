import "./App.css";
import LoginArea from "./LoginArea.jsx";
import LoginButton from "./LoginButton.jsx";
import NavBar from "./NavBar.jsx";

function App() {
  return (
    <>
      <div className="app-container">
        <div className="navbar-container">
          <img src="/surface315.svg" alt="WAJO Logo" />
          <NavBar />
          <LoginButton />
        </div>
        <div className="loginArea-container">
          <LoginArea />
        </div>
      </div>
    </>
  );
}

export default App;
