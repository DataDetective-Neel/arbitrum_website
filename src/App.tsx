import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import Home from './pages/Home/Home';
import Concepts from './pages/Concepts/Concepts';
import LivePrices from './pages/LivePrices/LivePrices';
import BlockSimulator from './pages/BlockSimulator/BlockSimulator';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/concepts" element={<Concepts />} />
        <Route path="/prices" element={<LivePrices />} />
        <Route path="/simulator" element={<BlockSimulator />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
