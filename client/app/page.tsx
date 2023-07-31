"use client";

import React, { useState, useContext, useEffect } from "react";
import { API_URL, WEBSOCKET_URL } from "@/constants";
import { AuthContext } from "@/modules/auth_provider";
import { v4 as uuidv4 } from "uuid";
export default function Home() {
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const { user } = useContext(AuthContext);

  const [roomName, setRoomName] = useState("");

  const getRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/ws/getRooms`, {
        method: "GET",
      });

      const data = await res.json();
      if (res.ok) {
        setRooms(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRooms();
  }, []);
  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      setRoomName("");
      const res = await fetch(`${API_URL}/ws/createRoom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: uuidv4(),
          name: roomName,
        }),
      });

      if (res.ok) {
        getRooms();
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const joinRoom = (roomId: string) => {
  //   const ws = new WebSocket(
  //     `${WEBSOCKET_URL}/ws/joinRoom/${roomId}?userId=${user.id}&username=${user.username}`
  //   );
  //   if (ws.OPEN) {
  //     setConn(ws);
  //     router.push("/app");
  //     return;
  //   }
  // };

  return (
    <>
      <div className={"my-8 h-full w-full px-4 md:mx-32 "}>
        <div className={"mt-3 flex justify-center p-5"}>
          <input
            type={"text"}
            className={
              "rounded-md border border-gray-500 p-2 focus:border-blue-500 focus:outline-none"
            }
            placeholder={"room name"}
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button
            onClick={submitHandler}
            className={"rounded-md border bg-blue-500 p-2 text-white md:ml-4"}
          >
            Create Room
          </button>
        </div>
        <div className="mt-6">
          <div className="font-bold">Available Rooms</div>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-5">
            {rooms.map((room, index) => (
              <div
                key={index}
                className="flex w-full items-center rounded-md border border-blue-500 p-4"
              >
                <div className="w-full">
                  <div className="text-sm">room</div>
                  <div className="text-lg font-bold text-blue-500">
                    {room.name}
                  </div>
                </div>
                <div className="">
                  <button
                    className="rounded-md bg-blue-500 px-4 text-white"
                    // onClick={() => joinRoom(room.id)}
                  >
                    join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
