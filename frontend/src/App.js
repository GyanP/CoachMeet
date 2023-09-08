import React, {useEffect} from "react"
import io from "socket.io-client"
import "./App.css"


const socket = io.connect('http://localhost:5000')

function App() {

	useEffect(() => {
		socket.emit("connection", "frontend connected")
	}, [])

	return (
		<>
			HEllo
		</>
	)
}

export default App
