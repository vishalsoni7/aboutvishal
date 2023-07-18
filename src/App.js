import "./App.css";
import { Home } from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import { About } from "./About";
import { Header } from "./pages/Header";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
