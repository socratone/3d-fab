import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/home/page";
import BoxPage from "./pages/step01/page";
import GroundGridPage from "./pages/step02/page";
import CameraControlsPage from "./pages/step03/page";
import LightingMaterialsPage from "./pages/step04/page";
import EquipmentAssemblyPage from "./pages/step05/page";
import EquipmentLayoutPage from "./pages/step06/page";
import EquipmentSelectionPage from "./pages/step07/page";
import EquipmentStatusPage from "./pages/step08/page";
import TransportPage from "./pages/step09/page";
import FactoryPage from "./pages/factory/page";

const App = () => {
  return (
    <main className="flex h-dvh flex-col">
      <Routes>
        <Route path="/factory" element={<FactoryPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/steps/01" element={<BoxPage />} />
        <Route path="/steps/02" element={<GroundGridPage />} />
        <Route path="/steps/03" element={<CameraControlsPage />} />
        <Route path="/steps/04" element={<LightingMaterialsPage />} />
        <Route path="/steps/05" element={<EquipmentAssemblyPage />} />
        <Route path="/steps/06" element={<EquipmentLayoutPage />} />
        <Route path="/steps/07" element={<EquipmentSelectionPage />} />
        <Route path="/steps/08" element={<EquipmentStatusPage />} />
        <Route path="/steps/09" element={<TransportPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  );
};

export default App;
