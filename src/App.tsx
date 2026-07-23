import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import StoriesPage from "./pages/StoriesPage";
import StoryPage from "./pages/StoryPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/stories" element={<StoriesPage />} />
      <Route path="/stories/:slug" element={<StoryPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
