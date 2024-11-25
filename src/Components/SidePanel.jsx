import "./SidePanel.css";
function SidePanel({
  onQuit,
  setPremove,
  setAutoPromote,
  isPremove,
  isAutoPromote,
}) {
  return (
    <div className="side-panel">
      <button onClick={onQuit}>Quit</button>
      <button
        className={isPremove ? "active-btn" : "primary-btn"}
        onClick={() => setPremove((p) => !p)}
      >
        Pre Move
      </button>
      <button
        className={isAutoPromote ? "active-btn" : "primary-btn"}
        onClick={() => setAutoPromote((a) => !a)}
      >
        Auto promote to Queen
      </button>
    </div>
  );
}
export default SidePanel;
