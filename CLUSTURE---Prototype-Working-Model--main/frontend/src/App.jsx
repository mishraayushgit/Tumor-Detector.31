import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Detect from './pages/Detect'
import About from './pages/About'
import HowItWorks from './pages/HowItWorks'
import Documentation from './pages/Documentation'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detect" element={<Detect />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}
