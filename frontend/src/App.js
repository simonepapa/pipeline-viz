import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navigation from "./components/Navigation"
import Home from "./pages/Home"
import LoadTest from "./pages/LoadTest"
import Cases from "./pages/Cases"
import SingleCase from "./pages/SingleCase"
import Generation from "./pages/Generation"

function App() {
  return (
    <div className="bg-base-300 h-screen">
      <Router>
        <div className="bg-base-300">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/cases/:id" element={<SingleCase />} />
            <Route path="/cases/:id/:generation" element={<Generation />} exact />
            <Route path="/load" element={<LoadTest />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </div>
  )
}

export default App
