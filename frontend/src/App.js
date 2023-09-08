import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PhoneIcon from "@material-ui/icons/Phone";
import React, { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import io from "socket.io-client";
import "./App.css";

const socket = io.connect("http://localhost:5000");

function App() {
	
const [ me, setMe ] = useState("")
const [ receivingCall, setReceivingCall ] = useState(false)
const [ idToCall, setIdToCall ] = useState("")
const [ name, setName ] = useState("")
const myVideo = useRef()

  useEffect(() => {
    socket.emit("connection", "frontend connected");
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center", color: "#fff" }}>Coach Meet up </h1>
      <div className="container">
        <div className="video-container">
          <div className="video">
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                style={{ width: "300px" }}
              />
          </div>

        </div>
        <div className="myId">
          <TextField
            id="filled-basic"
            label="Name"
            variant="filled"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
          <CopyToClipboard text={me} style={{ marginBottom: "2rem" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AssignmentIcon fontSize="large" />}
            >
              Copy ID
            </Button>
          </CopyToClipboard>

          <TextField
            id="filled-basic"
            label="ID to call"
            variant="filled"
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
          />
          <div className="call-button">
              <Button variant="contained" color="secondary">
                End Call
              </Button>
            
              <IconButton
                color="primary"
                aria-label="call"
              >
                <PhoneIcon fontSize="large" />
              </IconButton>
            
            {idToCall}
          </div>
        </div>
        <div>
          {receivingCall ? (
            <div className="caller">
              <h1>{name} is calling...</h1>
              <Button variant="contained" color="primary">
                Answer
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default App;
