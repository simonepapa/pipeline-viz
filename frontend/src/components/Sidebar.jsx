import { useEffect } from "react"
import { NavLink, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Spinner from "./Spinner"
import { getCase } from "../features/case/caseSlice"

function Sidebar() {
  const params = useParams()
  const dispatch = useDispatch()

  const { singleCase, isLoading, isError, message } = useSelector(
    (state) => state.case
  )
  useEffect(() => {
    const loadPage = async () => {
      if (Object.keys(singleCase).length === 0) {
        await dispatch(getCase(params.id))
      }
    }
    
    loadPage()
  })

  return (
    <div className="fixed w-40 h-screen flex flex-col items-center bg-base-100 left-0 overflow-y-auto pb-4">
      <NavLink to={`/cases/${params.id}/history`} className="text-lg font-bold mt-2">
        History
      </NavLink>
      <h2 className="text-normal mt-2">Generations</h2>
      {!isLoading ? (
        singleCase.generations &&
        singleCase.generations.map((generation, index) => (
          <NavLink
            key={index}
            to={`/cases/${params.id}/${generation}`}
            className={({ isActive }) =>
              isActive
                ? "generation-active text-normal my-2 bg-base-300 hover:bg-primary transition-colors py-2 px-4 rounded"
                : "text-normal my-2 bg-base-300 hover:bg-primary transition-colors py-2 px-4 rounded"
            }
          >
            {index}
          </NavLink>
        ))
      ) : (
        <Spinner />
      )}
    </div>
  )
}

export default Sidebar
