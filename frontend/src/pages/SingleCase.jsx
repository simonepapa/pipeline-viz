import { useState, useEffect } from "react"
import { NavLink, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import Modal from "react-modal"
import Sidebar from "../components/Sidebar"
import { BsPlusCircle, BsXLg } from "react-icons/bs"
import { putHistory } from "../features/history/historySlice"
import { getCase, resetInfo } from "../features/case/caseSlice"

Modal.setAppElement("#root")

function SingleCase() {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const params = useParams()
  const dispatch = useDispatch()
  const { singleCase, isError, message } = useSelector((state) => state.case)

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    dispatch(resetInfo())
  }, [isError, message])

  useEffect(() => {
    dispatch(getCase(params.id))
  }, [dispatch])

  const onSubmit = async (e) => {
    e.preventDefault()
    const results = []
    await Promise.all(
      [...e.target[0].files].map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              try {
                resolve(results.push(JSON.parse(reader.result)))
              } catch (err) {
                // Return a blank value; ignore non-JSON (or do whatever else)
                console.log("Please use .json!")
                resolve()
              }
            }
            reader.readAsText(file)
          })
      )
    )
    await dispatch(
      putHistory({
        history: results[0],
        caseId: params.id,
      })
    )
  }

  const openModal = () => {
    setModalIsOpen(true)
  }
  const closeModal = () => setModalIsOpen(false)

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Create generation"
        className="w-fit top-1/2 left-1/2 bottom-auto right-auto -translate-y-2/4 -translate-x-2/4 relative inset-y-1/2 rounded-lg bg-base-100 p-6 border border-base-100"
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.65)" },
        }}
      >
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">New history</h2>
          <BsXLg className="ml-8 hover:cursor-pointer" onClick={closeModal} />
        </div>
        <div>
          <form onSubmit={onSubmit} className="flex flex-col mt-2">
            <p className="text-lg mb-1">
              Upload a single .json history file
            </p>
            <input
              type="file"
              className="file-input file-input-bordered w-full max-w-xs mt-2"
            ></input>
            <div className="w-full flex justify-between mt-8">
              <button type="submit" className="btn">
                Submit
              </button>
              <button onClick={closeModal} className="btn">
                Go back
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <Sidebar />
      <main>
        <div className="w-9/12 h-fit bg-base-100 mx-auto p-4 mt-2 ml-44 mr-4">
          <h1 className="text-2xl opacity-100">{singleCase.name}</h1>
          <p className="text-lg mt-1">{singleCase.description}</p>
          <div className="flex items-center mt-4">
            <NavLink
              to={`${singleCase.history}`}
              className="btn btn-primary mr-4"
            >
              History
            </NavLink>
            <button onClick={openModal} className="btn btn-primary gap-2">
              <BsPlusCircle className="w-6 h-6 mr-2" />
              Upload history
            </button>
          </div>
        </div>
      </main>
    </>
  )
}

export default SingleCase
