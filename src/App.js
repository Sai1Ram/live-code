import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import EditorPage from "./page/EditorPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right"></Toaster>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:roomId/:name" element={<EditorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
