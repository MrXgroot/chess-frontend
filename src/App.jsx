import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import io from "socket.io-client";
import "./App.css";
const socket = io("http://localhost:5000");
function App() {
  const [gameId, setGameId] = useState(null);
  const [loadGame, setLoadGame] = useState(false);
  const [fen, setFen] = useState("start");
  const [role, setRole] = useState(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const copyToClipboard = () => {
    if (gameId) {
      navigator.clipboard
        .writeText(gameId)
        .then(() => {
          alert("Game ID copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err);
        });
    }
  };
  useEffect(() => {
    socket.on("error", (e) => {
      console.error(e);
    });
    socket.on("loadBoard", () => {
      setLoadGame(true);
    });
    socket.on("gameCreated", ({ gameId, role }) => {
      setGameId(gameId);
      setRole(role);
      setIsPlayerTurn(role == "white");
    });

    socket.on("roleAssigned", ({ role }) => {
      setRole(role);
      setIsPlayerTurn(role === "white");
      console.log("role is ", role, "    isPlayerTurn", isPlayerTurn);
    });
    socket.on("playerJoined", ({ players, gameId }) => {
      setGameId(gameId);
      console.log("player joined", players, gameId);
    });

    socket.on("moveMade", ({ fen }) => {
      console.log(fen);
      setFen(fen);
      setIsPlayerTurn((p) => !p);
    });
    return () => socket.off();
  }, []);

  const createGame = () => {
    socket.emit("createGame");
  };
  const joinGame = (id) => {
    socket.emit("joinGame", id);
  };

  //ended this i have to create the make move in server .js
  const onPieceDrop = (sourceSquare, targetSquare) => {
    console.log(isPlayerTurn);
    if (!isPlayerTurn) {
      // alert("Wait for your turn..");
      return false;
    }
    // console.log("moving");
    const move = { from: sourceSquare, to: targetSquare };
    socket.emit("makeMove", { gameId, move });
    // console.log("returned");
    return true;
  };

  return (
    <div className="game-container">
      <h1>CHESS MANIA</h1>
      {!loadGame && <button onClick={createGame}>Create Game</button>}
      {!loadGame && (
        <button onClick={() => joinGame(prompt("Enter Game ID"))}>
          Join Game
        </button>
      )}
      {!loadGame && gameId && <label onClick={copyToClipboard}>{gameId}</label>}

      {loadGame && (
        <Chessboard
          position={fen}
          onPieceDrop={onPieceDrop}
          boardWidth={500}
          boardOrientation={role}
        />
      )}
    </div>
  );
}

export default App;
