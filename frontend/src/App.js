import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Chats from "./Pages/Chats";
import ResetPassword from "./components/Authentication/ResetPassword";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/reset-password/:userId" element={<ResetPassword />} />
      </Routes>
    </div>
  );
}

export default App;
