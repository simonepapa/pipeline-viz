import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import Modal from "react-modal"
import Sidebar from "../components/Sidebar"

Modal.setAppElement("#root")

function History() {
  const params = useParams()
  const dispatch = useDispatch()

  return (
    <>
      <Sidebar />
      <main>
        <div className="w-9/12 h-fit bg-base-100 mx-auto p-4 mt-2 ml-44 mr-4">
          <h1 className="text-2xl opacity-100">Case 1</h1>
          <p className="text-lg mt-1">Case description</p>
        </div>
      </main>
    </>
  )
}

export default History
