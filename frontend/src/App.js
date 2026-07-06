import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Admin from "@/pages/Admin";
import { Toaster } from "sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="bottom-center"
        theme="dark"
        toastOptions={{
          style: { background: "#0F1E2E", color: "#E8F1F5", border: "1px solid rgba(232,241,245,0.1)" },
        }}
      />
    </div>
  );
}

export default App;
