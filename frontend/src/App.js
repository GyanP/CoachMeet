import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PhoneIcon from "@material-ui/icons/Phone";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Peer from "simple-peer";
import io from "socket.io-client";
import "./App.css";

const socket = io.connect("http://localhost:5000");
function App() {
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [recieverName, setRecieverName] = useState("");
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isMicMuted, setIsMicMuted] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    socket.on("me", (id) => {
      setMe(id);
    });

    socket.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setRecieverName(data.name);
      // setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  useEffect(() => {
    socket.on("chatMessage", (message) => {
      setMessages([...messages, message]);
    });
  }, [me, messages])

  const sendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("chatMessage", {
        text: newMessage,
        sender: me,
        senderName: name,
      });
      setNewMessage("");
    }
  };

  const onKeyDown = (e) => {
    if(e.key === 'Enter'){
      e.preventDefault(); 
      sendMessage(); 
    }
  }

  const callUser = (id) => {
    if (name && idToCall) {
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });
      peer.on("signal", (data) => {
        const payload = {
          userToCall: id,
          signalData: data,
          from: me,
          name: name,
        };
        socket.emit("callUser", payload);
      });
      peer.on("stream", (stream) => {
        userVideo.current.srcObject = stream;
      });
      socket.on("callAccepted", (data) => {
        setRecieverName(data.ans);
        setCallAccepted(true);
        peer.signal(data.signal);
      });

      connectionRef.current = peer;
    }
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller, ans: name });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
  };

  const toggleMic = () => {
    const audioTracks = stream.getAudioTracks();
    audioTracks.forEach((track) => (track.enabled = !isMicMuted));
    setIsMicMuted(!isMicMuted);
  }; 

  const toggleCamera = () => {
    const videoTracks = stream.getVideoTracks();
    videoTracks.forEach((track) => (track.enabled = !isCameraOn));
    setIsCameraOn(!isCameraOn);
  };

  return (
    <>
      <h1
        style={{
          textAlign: "center",
          color: "rgb(24 24 24)",
          marginTop: "30px",
          marginBottom: "30px",
        }}
      >
        Video Conferencing
      </h1>
      <div className="container">
        <div className="d-flex">
          <div className="left-container">
            <div className="video-container">
              <div className="video">
                {stream && (
                  <video
                    playsInline
                    // muted
                    muted={isMicMuted}
                    ref={myVideo}
                    autoPlay
                    style={{ width: "100%" }}
                  />
                )}
                <h3>{name}</h3>
                {messages.length > 0 && messages[messages.length -1].senderName === name && messages[messages.length -1].text}
              </div>
              {callAccepted && !callEnded ? (
                <div className="video">
                  <video
                    playsInline
                    ref={userVideo}
                    autoPlay
                    style={{ width: "100%" }}
                  />
                  <h3>{recieverName}</h3>
                  {messages.length > 0 && messages[messages.length -1].senderName === recieverName && messages[messages.length -1].text}
                </div>
              ) : null}
            </div>
            <div className="receivingCall">
              {receivingCall && !callAccepted ? (
                <div className="caller">
                  <h1 style={{ color: "black" }}>
                    {recieverName} is calling...
                  </h1>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={!name}
                    onClick={answerCall}
                  >
                    Answer
                  </Button>
                </div>
              ) : null}
            </div>

            <div className="myId">
              <div className="TextField-box">
                <TextField
                  id="filled-basic"
                  label="Name"
                  variant="filled"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={!receivingCall ? idToCall && !name : !name}
                  helperText={"Please Enter Name"}
                />

                <TextField
                  id="filled-basic"
                  label="ID to call"
                  variant="filled"
                  value={idToCall}
                  onChange={(e) => setIdToCall(e.target.value)}
                  // error={receivingCall && name}
                  // helperText={"Please Enter ID"}
                />
              </div>

              <div className="CopyToClipboard">
                <CopyToClipboard text={me}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AssignmentIcon fontSize="large" />}
                  >
                    Copy ID
                  </Button>
                </CopyToClipboard>

                <div className="call-button">
                  {callAccepted && !callEnded ? (
                    <>
                      <Button
                        variant="contained"
                        color={isMicMuted ? "primary" : "secondary"}
                        onClick={toggleMic}
                      >
                        {isMicMuted ?  <MicIcon/>  : <MicOffIcon />}
                      </Button>
                      <Button
                        variant="contained"
                        color={isCameraOn ? "primary" : "secondary"}
                        onClick={toggleCamera}
                      >
                        {isCameraOn ? <VideocamIcon /> : <VideocamOffIcon />}
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={leaveCall}
                      >
                        End Call
                      </Button>
                    </>
                  ) : (
                    <IconButton
                      color="primary"
                      aria-label="call"
                      onClick={() => callUser(idToCall)}
                    >
                      <PhoneIcon fontSize="large" />
                    </IconButton>
                  )}
                  {/* {idToCall} */}
                </div>
              </div>
            </div>
          </div>

          <div className="right-chat-container">
            {callAccepted && !callEnded && (
              <div className="chat-container">
                <div className="chat">
                  <div className="chat-messages">
                    {messages.map((message, index) => (
                      <div
                        className={`message ${
                          message.sender === me ? "my-message" : "other-message"
                        }`}
                        key={index}
                      >
                        <p>
                          {message.senderName}: {message.text}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="chat-input">
                    <TextField
                      label="Type a message..."
                      variant="filled"
                      fullWidth
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => onKeyDown(e)}

                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={sendMessage}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
