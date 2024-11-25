import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import useSocket from "./hooks/useSocket.js";
import SidePanel from "./Components/SidePanel.jsx";
import "./App.css";
import Header from "./Components/Header.jsx";
import GameButtons from "./Components/GameButtons.jsx";
import { Chess } from "chess.js";
import Loader from "./Components/Loader.jsx";
function App() {
  const [gameId, setGameId] = useState(null);
  const [loadGame, setLoadGame] = useState(false);
  const [boardWidth, setBoardWidth] = useState(
    Math.min(window.innerWidth, 500)
  );
  const [isPremove, setPremove] = useState(false);
  const [isAutoPromote, setAutoPromote] = useState(false);
  const [connected, setConnection] = useState(false);
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  );
  const [role, setRole] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const quitGame = () => {
    window.location.reload();
  };
  const socket = useSocket(
    setFen,
    setGameId,
    setRole,
    setIsPlayerTurn,
    setLoadGame,
    setConnection,
    quitGame
  );

  useEffect(() => {
    const handleResize = () => {
      setBoardWidth(Math.min(window.innerWidth, 500));
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(gameId);
    alert(gameId + " copied to clipboard");
  };

  const createGame = () => socket.emit("createGame");
  const joinGame = (id) => socket.emit("joinGame", id);
  const joinRandom = () => socket.emit("joinRandom");

  const onPieceDrop = (sourceSquare, targetSquare) => {
    if (!isPlayerTurn) return false;
    const move = { from: sourceSquare, to: targetSquare };
    if (isAutoPromote) move["promotion"] = "q";
    let result = null;
    const chess = new Chess(fen);
    try {
      result = chess.move(move);
    } catch (e) {}

    if (result) {
      setFen(chess.fen());
      socket.emit("makeMove", { gameId, move });
      return true;
    }
    return false;
  };
  const handlePromotionPiece = (piece, promoteFromSquare, promoteToSquare) => {
    console.log("promotion is called");
    if (!isPlayerTurn) return false;
    const move = {
      from: promoteFromSquare,
      to: promoteToSquare,
      promotion: piece[1].toLowerCase(),
    };

    let result = null;
    const chess = new Chess(fen);
    try {
      result = chess.move(move);
    } catch (e) {}
    if (result) {
      setFen(chess.fen());
      socket.emit("makeMove", { gameId, move });
      return true;
    }
    return false;
  };

  return (
    <div className="game-container">
      {!connected ? (
        <Loader></Loader>
      ) : (
        <>
          <div className="header-container">
            <Header quitGame={quitGame}></Header>
          </div>
          {!loadGame && (
            <div className="game-button-container">
              <GameButtons
                createGame={createGame}
                joinGame={joinGame}
                copyToClipboard={copyToClipboard}
                gameId={gameId}
                joinRandom={joinRandom}
              />
            </div>
          )}
          {loadGame && (
            <div className="main-game-content">
              <div className="chess-board-container">
                <Chessboard
                  className="chess-board"
                  position={fen}
                  onPieceDrop={onPieceDrop}
                  boardWidth={boardWidth - 19}
                  boardOrientation={role}
                  arePremovesAllowed={isPremove}
                  autoPromoteToQueen={isAutoPromote}
                  onPromotionPieceSelect={handlePromotionPiece}
                />
              </div>
              <div className="side-panel-container">
                <SidePanel
                  onQuit={quitGame}
                  setPremove={setPremove}
                  isPremove={isPremove}
                  isAutoPromote={isAutoPromote}
                  setAutoPromote={setAutoPromote}
                ></SidePanel>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
export default App;
