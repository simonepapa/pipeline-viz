import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Navigation from "./components/Navigation"
import LoadTest from "./pages/LoadTest"
import Cases from "./pages/Cases"
import SingleCase from "./pages/SingleCase"
import History from "./pages/History"
import Generation from "./pages/Generation"
import Pipeline from "./pages/Pipeline"

function App() {
  return (
    <div className="bg-base-300 h-screen">
      <Router>
        <div className="bg-base-300">
          <Navigation />
          <Routes>
            <Route path="/" element={<Navigate replace to="/cases" />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/cases/:id" element={<SingleCase />} />
            <Route path="/cases/:id/history" element={<History />} />
            <Route path="/cases/:id/:generation" element={<Generation />} />
            <Route
              path="/cases/:id/:generation/:pipeline"
              element={<Pipeline />}
            />
            <Route path="/load" element={<LoadTest />} />
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </div>
  )
}

export default App
