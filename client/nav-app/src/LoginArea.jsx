import LoginButton from "./LoginButton.jsx";
import "./LoginArea.css";

function LoginArea() {
  return (
    <div className="LoginAreaContainer">
      <h1>Welcome</h1>
      <h2>Please log in to continue</h2>
      <label htmlFor="username">Username</label>
      <input type="text" id="username" placeholder="Placeholder" />
      <label htmlFor="password">Password</label>
      <div className="password-eye-container">
        <input type="password" id="password" placeholder="Placeholder" />
        <img className="eye" src="/eye.svg" alt="eye" />
      </div>
      <p>
        It must be a combination of minimum 8 letters, numbers, and symbols.
      </p>
      <div>
        <div>
          <input type="checkbox" id="rememberMe" />
          <label htmlFor="rememberMe">Remember me</label>
        </div>
        <a href="#ForgotPassword">Forgot Password?</a>
      </div>
      <LoginButton className="test" />
      <hr />
    </div>
  );
}

export default LoginArea;
