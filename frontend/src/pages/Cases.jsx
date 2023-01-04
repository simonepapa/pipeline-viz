import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import Modal from "react-modal"
import Spinner from "../components/Spinner"
import Card from "../components/Card"
import { BsPlusCircle, BsXLg } from "react-icons/bs"
import { getCases, createCase, resetInfo } from "../features/case/caseSlice"


Modal.setAppElement("#root")

function Cases() {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [caseData, setCaseData] = useState({
    name: "",
    description: "",
  })

  const dispatch = useDispatch()
  const { cases, isLoading, isError, message } = useSelector(
    (state) => state.case
  )

  useEffect(() => {
    if (isError) {
      toast.error(message)
    }

    dispatch(resetInfo())
  }, [isError, message])

  useEffect(() => {
    dispatch(getCases())
  }, [dispatch])

  const onChange = (e) => {
    setCaseData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }
  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(createCase(caseData))
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
        contentLabel="Create case"
        className="w-fit top-1/2 left-1/2 bottom-auto right-auto -translate-y-2/4 -translate-x-2/4 relative inset-y-1/2 rounded-lg bg-base-100 p-6 border border-base-100"
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.65)" },
        }}
      >
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">New case</h2>
          <BsXLg className="ml-8 hover:cursor-pointer" onClick={closeModal} />
        </div>
        <div>
          <form onSubmit={onSubmit} className="flex flex-col items-center mt-2">
            <div className="flex flex-col w-screen max-w-xs">
              <p className="text-normal mb-1">Case name</p>
              <input
                onChange={onChange}
                required
                id="name"
                name="name"
                type="text"
                placeholder="Type case name here"
                className="input input-bordered w-screen max-w-xs"
              />
            </div>
            <div className="flex flex-col w-screen max-w-xs mt-2">
              <p className="text-normal mb-1">Case description</p>
              <textarea
                onChange={onChange}
                id="description"
                name="description"
                placeholder="Type case description here"
                className="textarea textarea-bordered w-screen max-w-xs"
              />
            </div>
            <div className="w-full flex justify-between mt-8">
              <button className="btn">Create</button>
              <button onClick={closeModal} className="btn">
                Go back
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <main>
        <div className="w-11/12 h-fit bg-base-100 mx-auto p-4 mt-4">
          <h1 className="text-xl text-current opacity-100 font-bold uppercase mb-2">
            Case studies
          </h1>
          <div className="flex flex-wrap">
            {!isLoading ? (
              cases.map((singleCase) => (
                <Card key={singleCase._id} singleCase={singleCase} />
              ))
            ) : (
              <Spinner />
            )}
          </div>
          <button onClick={openModal} className="btn gap-2 mt-8 mx-2">
            <BsPlusCircle className="w-6 h-6 mr-2" />
            Create new
          </button>
        </div>
      </main>
    </>
  )
}

export default Cases
