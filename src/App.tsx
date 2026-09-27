import { NavLink, Navigate, Route, Routes } from "react-router";
import Step01 from "./pages/Step01";
import Step02 from "./pages/Step02";

export default function App() {
  return (
    <main>
      <header>
        <h1>3D FAB</h1>
        <nav aria-label="학습 단계">
          <NavLink to="/steps/01">01 · 첫 번째 박스</NavLink>
          <NavLink to="/steps/02">02 · 바닥과 기준 격자</NavLink>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Navigate to="/steps/01" replace />} />
        <Route path="/steps/01" element={<Step01 />} />
        <Route path="/steps/02" element={<Step02 />} />
        <Route path="*" element={<Navigate to="/steps/01" replace />} />
      </Routes>
    </main>
  );
}
