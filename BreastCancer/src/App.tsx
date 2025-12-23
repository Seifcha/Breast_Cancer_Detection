import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PatientProvider } from "./context/PatientContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Results from "./pages/Results";
import AdvancedAnalysis from "./pages/AdvancedAnalysis";
import AdvancedResults from "./pages/AdvancedResults";

function App() {
  return (
    <PatientProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/advanced-analysis" element={<AdvancedAnalysis />} />
          <Route path="/advanced-results" element={<AdvancedResults />} />
        </Routes>
      </BrowserRouter>
    </PatientProvider>
  );
}

export default App;
