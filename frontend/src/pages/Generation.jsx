import { useEffect } from "react"
import { NavLink, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import Sidebar from "../components/Sidebar"
import Spinner from "../components/Spinner"
import {
  getGeneration,
  resetInfo,
} from "../features/generation/generationSlice"

function Generation() {
  const params = useParams()
  const dispatch = useDispatch()
  const { singleCase, isLoading } = useSelector((state) => state.case)
  const {
    generation,
    isLoading: isLoadingGeneration,
    isError,
    message,
  } = useSelector((state) => state.generation)

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    dispatch(resetInfo())
  }, [isError, message])

  useEffect(() => {
    dispatch(getGeneration(params.generation))
  }, [dispatch])

  console.log(generation)

  return (
    <>
      <Sidebar
        generations={singleCase && singleCase.generations}
        isLoading={isLoading}
      />
      <main className="flex flex-wrap">
        <div className="w-fit max-w-5xl h-fit bg-base-100 ml-44 p-4 mt-4">
          <h1 className="text-xl text-current opacity-100 font-bold uppercase mb-2">
            Generation
          </h1>
          <p>Please note that the pipelines are not in order. The number is shown only to identify each pipeline</p>
          <div className="flex flex-wrap mt-4">
            {(!isLoadingGeneration && Object.keys(generation).length !== 0) ? (
              generation.pipelines.map((pipeline, index) => (
                <NavLink key={pipeline}>
                  <div className="px-8 py-4 mr-8 bg-secondary rounded hover:bg-secondary-focus transition-colors">
                    <p className="text-lg font-bold">{index}</p>
                  </div>
                </NavLink>
              ))
            ) : (
              <Spinner />
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default Generation
