import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Home from "./pages/Home"
import LoadTest from "./pages/LoadTest"

function App() {
  return (
    <div className="bg-base-300 h-screen">
      <Router>
        <div className="bg-base-300">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/load" element={<LoadTest />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </div>
  )
}

export default App
