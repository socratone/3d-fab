import { NavLink, Navigate, Route, Routes } from "react-router";
import BoxPage from "./pages/step01/page";
import GroundGridPage from "./pages/step02/page";
import CameraControlsPage from "./pages/step03/page";
import LightingMaterialsPage from "./pages/step04/page";
import EquipmentAssemblyPage from "./pages/step05/page";
import EquipmentLayoutPage from "./pages/step06/page";
import EquipmentSelectionPage from "./pages/step07/page";
import EquipmentStatusPage from "./pages/step08/page";
import TransportPage from "./pages/step09/page";

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
        <Route path="/steps/01" element={<BoxPage />} />
        <Route path="/steps/02" element={<GroundGridPage />} />
        <Route path="/steps/03" element={<CameraControlsPage />} />
        <Route path="/steps/04" element={<LightingMaterialsPage />} />
        <Route path="/steps/05" element={<EquipmentAssemblyPage />} />
        <Route path="/steps/06" element={<EquipmentLayoutPage />} />
        <Route path="/steps/07" element={<EquipmentSelectionPage />} />
        <Route path="/steps/08" element={<EquipmentStatusPage />} />
        <Route path="/steps/09" element={<TransportPage />} />
        <Route path="*" element={<Navigate to="/steps/01" replace />} />
      </Routes>
    </main>
  );
}
