import { NavLink, useParams } from "react-router-dom"
import Spinner from "./Spinner"

function Sidebar({ generations, isLoading }) {
  const params = useParams()

  return (
    <div className="fixed w-40 h-screen flex flex-col items-center bg-base-100 left-0 overflow-y-auto pb-4">
      <h2 className="text-lg font-bold mt-2">Generations</h2>
      {!isLoading ? (
        generations &&
        generations.map((generation, index) => (
          <NavLink
            to={`/cases/${params.id}/${generation}`}
            className={({ isActive }) =>
              isActive
                ? "generation-active text-normal my-2 bg-base-300 hover:bg-primary transition-colors py-2 px-4 rounded"
                : "text-normal my-2 bg-base-300 hover:bg-primary transition-colors py-2 px-4 rounded"
            }
          >
            {index + 1}
          </NavLink>
        ))
      ) : (
        <Spinner />
      )}
    </div>
  )
}

export default Sidebar
