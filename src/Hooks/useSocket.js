import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("https://chess-backend-1-728q.onrender.com");

function useSocket(
  setFen,
  setGameId,
  setRole,
  setIsPlayerTurn,
  setLoadGame,
  setConnection,
  quitGame
) {
  useEffect(() => {
    socket.on("error", (e) => {
      console.error(e);
    });

    if (socket.connected) {
      console.log("Socket already connected:", socket.id);
      socket.emit("clientReady");
    }

    socket.on("connect", () => {
      socket.emit("clientReady");
    });

    socket.on("connected", () => {
      setConnection(true);
    });

    socket.on("gameCreated", ({ gameId, role }) => {
      setGameId(gameId);
      setRole(role);
      setIsPlayerTurn(role == "white");
    });

    socket.on("roleAssigned", ({ role }) => {
      setRole(role);
      setIsPlayerTurn(role === "white");
    });

    socket.on("playerJoined", ({ players, gameId }) => {
      setGameId(gameId);
    });

    socket.on("moveMade", ({ fen }) => {
      setFen(fen);

      setIsPlayerTurn((p) => !p);
    });
    socket.on("loadBoard", () => {
      console.log("board is loaded");
      setLoadGame(true);
    });
    socket.on("waitingForOpponent", (message) => alert(message));

    socket.on("matchClosed", (message) => {
      console.log("checkmate");
      quitGame();
    });
    return () => {
      socket.off();
    };
  }, []);

  return socket;
}
export default useSocket;
