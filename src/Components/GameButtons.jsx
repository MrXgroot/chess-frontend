import "./GameButtons.css";
function GameButtons({
  createGame,
  joinGame,
  joinRandom,
  gameId,
  copyToClipboard,
}) {
  return (
    <div className="game-buttons">
      <button onClick={createGame}>Create Game</button>

      <button onClick={() => joinGame(prompt("Enter Game ID"))}>
        Join Game
      </button>

      <button onClick={joinRandom}>join Random</button>
      {gameId && (
        <label onClick={copyToClipboard}>
          <span>{`click to copy ID`}</span>
        </label>
      )}
    </div>
  );
}
export default GameButtons;
