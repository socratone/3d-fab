import { NavLink, Navigate, Route, Routes } from "react-router";
import Step01 from "./pages/Step01";
import Step02 from "./pages/Step02";
import Step03 from "./pages/Step03";
import Step04 from "./pages/Step04";
import Step05 from "./pages/Step05";
import Step06 from "./pages/Step06";
import Step07 from "./pages/Step07";
import Step08 from "./pages/Step08";
import Step09 from "./pages/Step09";

export default function App() {
  return (
    <main>
      <header>
        <h1>3D FAB</h1>
        <nav aria-label="학습 단계">
          <NavLink to="/steps/01">01 · 첫 번째 박스</NavLink>
          <NavLink to="/steps/02">02 · 바닥과 기준 격자</NavLink>
          <NavLink to="/steps/03">03 · 마우스로 둘러보기</NavLink>
          <NavLink to="/steps/04">04 · 조명과 재질</NavLink>
          <NavLink to="/steps/05">05 · 장비 한 대 조립</NavLink>
          <NavLink to="/steps/06">06 · 장비 배치와 통로</NavLink>
          <NavLink to="/steps/07">07 · 장비 선택</NavLink>
          <NavLink to="/steps/08">08 · 장비 상태</NavLink>
          <NavLink to="/steps/09">09 · 운반체 이동</NavLink>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Navigate to="/steps/01" replace />} />
        <Route path="/steps/01" element={<Step01 />} />
        <Route path="/steps/02" element={<Step02 />} />
        <Route path="/steps/03" element={<Step03 />} />
        <Route path="/steps/04" element={<Step04 />} />
        <Route path="/steps/05" element={<Step05 />} />
        <Route path="/steps/06" element={<Step06 />} />
        <Route path="/steps/07" element={<Step07 />} />
        <Route path="/steps/08" element={<Step08 />} />
        <Route path="/steps/09" element={<Step09 />} />
        <Route path="*" element={<Navigate to="/steps/01" replace />} />
      </Routes>
    </main>
  );
}
