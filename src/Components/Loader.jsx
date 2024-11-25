import "./loader.css";
import logo from "../assets/logo.svg";
function Loader() {
  return (
    <>
      <img src={logo} alt="" className="loader" />
      <p className="loading-text">Connecting...</p>
    </>
  );
}
export default Loader;
