// import { useEffect, useState } from "react";
import ChatBot from "./components/ChatBot";
// import { Button } from "./components/ui/button";

function App() {
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetch("/api/hello")
  //     .then((res) => res.json())
  //     .then((data) => setMessage(data.message));
  // }, []);

  return (
    <div className="p-3">
      <ChatBot></ChatBot>
    </div>
  );
}

export default App;
