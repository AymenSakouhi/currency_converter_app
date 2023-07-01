import React from "react";
import CurrencyConverter from "./components/CurrencyConverter";
import Footer from "./components/assets/Footer";

function App() {
  return (
    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 min-h-screen sm:p-24">
      <CurrencyConverter />
      <Footer />
    </div>
  );
}

export default App;
