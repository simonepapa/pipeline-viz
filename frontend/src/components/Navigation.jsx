import { NavLink } from "react-router-dom"

function Navigation() {
  return (
    <div className="navbar bg-base-100 flex items-center">
      <div className="flex-1">
        <p className="uppercase text-xl font-bold pl-4">Pipeline Visualizer</p>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal pr-8">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "active flex items-center p-2 mr-3"
                  : "flex items-center p-2 mr-3"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/cases"
              className={({ isActive }) =>
                isActive
                  ? "active flex items-center p-2 mr-3"
                  : "flex items-center p-2 mr-3"
              }
            >
              Cases
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Navigation
