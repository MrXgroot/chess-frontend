import logo from "../assets/logo.svg";
import "./Header.css";
function Header({ quitGame }) {
  return (
    <div className="header">
      <div className="logo-container">
        <img src={logo} alt="" className="game-logo" onClick={quitGame} />
      </div>

      <h1>CHESS MANIA</h1>
    </div>
  );
}
export default Header;
