import { NavLink, useParams } from "react-router-dom"

function Sidebar() {
  const params = useParams()
  const generations = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30,
  ]

  return (
    <div className="fixed w-40 h-screen flex flex-col items-center bg-base-100 left-0 overflow-y-auto pb-4">
      <h2 className="text-lg font-bold mt-2">Generations</h2>
      {generations.map((generation) => (
        <NavLink
          to={`/cases/${params.id}/${generation}`}
          className={({ isActive }) =>
            isActive
              ? "generation-active text-normal my-2 bg-base-300 hover:bg-primary transition-colors py-2 px-4 rounded"
              : "text-normal my-2 bg-base-300 hover:bg-primary transition-colors py-2 px-4 rounded"
          }
        >
          {generation}
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar