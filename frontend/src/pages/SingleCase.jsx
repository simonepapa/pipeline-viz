import { useState } from "react"
import Modal from "react-modal"
import Sidebar from "../components/Sidebar"
import { BsPlusCircle, BsXLg } from "react-icons/bs"

Modal.setAppElement("#root")

function SingleCase() {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
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
          <h2 className="text-2xl font-bold">New generation</h2>
          <BsXLg className="ml-8 hover:cursor-pointer" onClick={closeModal} />
        </div>
        <div>
          <form onSubmit={onSubmit} className="flex flex-col mt-2">
            <p className="text-lg mb-1">Pipelines (upload all the .json files of a generation)</p>
            <input type="file" className="file-input file-input-bordered w-full max-w-xs mt-2" multiple></input>
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
          <h1 className="text-2xl opacity-100">Case 1</h1>
          <p className="text-lg mt-1">Case description</p>
          <button onClick={openModal} className="btn btn-primary gap-2 mt-4">
            <BsPlusCircle className="w-6 h-6 mr-2" />
            Create new generation
          </button>
        </div>
      </main>
    </>
  )
}

export default SingleCase
