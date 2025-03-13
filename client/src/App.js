import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles

// Connect to the Socket.io server
const socket = io.connect("http://localhost:3001");

function App() {
  // Room State
  const [room, setRoom] = useState("");

  // Messages States
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Stores message history

  // Join Room Function
  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      toast.success(`Joined Room: ${room}`, {
        position: "top-center",
        autoClose: 2000,
      });
    } else {
      toast.error("Please enter a room number!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  // Send Message Function
  const sendMessage = () => {
    if (message.trim() !== "") {
      const messageData = { message, room };
      socket.emit("send_message", messageData);
      setMessages((prev) => [...prev, messageData]); // Add sent message to history
      setMessage(""); // Clear input after sending
    } else {
      toast.warning("Message cannot be empty!", {
        position: "top-center",
        autoClose: 2000,
      });
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]); // Add received message to history
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "30%",
          margin: "20px auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          background: "#f9f9f9",
        }}
      >
        {/* Room Input */}
        <input
          placeholder="Enter Room Number..."
          value={room}
          onChange={(event) => setRoom(event.target.value)}
          style={{
            marginBottom: "10px",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={joinRoom}
          style={{
            marginBottom: "10px",
            padding: "8px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Join Room
        </button>

        {/* Message Input */}
        <input
          placeholder="Type a message..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          style={{
            marginBottom: "10px",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginBottom: "10px",
            padding: "8px",
            backgroundColor: "#008CBA",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Send Message
        </button>

        {/* Message History */}
        <h3>Chat Messages:</h3>
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "5px",
            background: "white",
          }}
        >
          {messages.map((msg, index) => (
            <p
              key={index}
              style={{ padding: "5px", borderBottom: "1px solid #ddd" }}
            >
              <strong>Room {room}:</strong> {msg.message}
            </p>
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      <ToastContainer />
    </div>
  );
}

export default App;
