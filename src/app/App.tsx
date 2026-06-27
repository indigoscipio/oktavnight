import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import ThresholdPage from "../pages/ThresholdPage";
import ChapelPage from "../pages/ChapelPage";
import AboutPage from "../pages/AboutPage";
import Button from "../components/Button";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="page-in flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <h1 className="font-serif text-3xl text-gray-200 mb-4">Lost in the Dark</h1>
      <p className="text-sm text-gray-400 mb-6">No path leads to this place.</p>
      <Button variant="link" onClick={() => navigate("/")}>
        Return to the Threshold
      </Button>
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
