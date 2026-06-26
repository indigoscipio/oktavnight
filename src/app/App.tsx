import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThresholdPage from "../pages/ThresholdPage";
import ChapelPage from "../pages/ChapelPage";
import AboutPage from "../pages/AboutPage";

function NotFoundPage() {
  return (
    <div className="page-in flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="font-serif text-3xl text-gray-200 mb-4">Lost in the Dark</h1>
      <p className="text-sm text-gray-400 mb-6">No path leads to this place.</p>
      <a href="/" className="text-sm text-gray-500 hover:text-gray-300 underline transition-colors">
        Return to the Threshold
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ThresholdPage />} />
        <Route path="/chapel" element={<ChapelPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
