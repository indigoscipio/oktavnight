import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThresholdPage from "../pages/ThresholdPage";
import ChapelPage from "../pages/ChapelPage";
import AboutPage from "../pages/AboutPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ThresholdPage />} />
        <Route path="/chapel" element={<ChapelPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}
