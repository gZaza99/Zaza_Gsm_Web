import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Clients from "./pages/clients";
import ClientDetail from "./pages/client_details";
import ClientPhones from "./pages/client_phones";
import PhoneModels from "./pages/phone_models";

export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="mt-4">
        <Routes>
          <Route path="/clients" element={<Clients />} />
          <Route path="/client/:id" element={<ClientDetail />} />
          <Route path="/client_phones" element={<ClientPhones />} />
          <Route path="/phone_models" element={<PhoneModels />} />
          {/* default route */}
          <Route path="/" element={<Clients />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
