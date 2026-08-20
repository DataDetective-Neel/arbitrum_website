import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home/Home';
import Concepts from './pages/Concepts/Concepts';
import LivePrices from './pages/LivePrices/LivePrices';
import BlockSimulator from './pages/BlockSimulator/BlockSimulator';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/concepts" element={<Concepts />} />
        <Route path="/prices" element={<LivePrices />} />
        <Route path="/simulator" element={<BlockSimulator />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
