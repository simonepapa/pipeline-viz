import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Modal from "react-modal"
import Sidebar from "../components/Sidebar"
import { getCase } from "../features/case/caseSlice"
import { getGenerations, resetInfo } from "../features/case/caseSlice"

Modal.setAppElement("#root")

function History() {
  const params = useParams()
  const dispatch = useDispatch()

  const { singleCase, generations, isLoading, isError, message } = useSelector(
    (state) => state.case
  )

  useEffect(() => {
    const loadPage = async () => {
      if (Object.keys(singleCase).length === 0) {
        await dispatch(getCase(params.id))
      }
      await dispatch(getGenerations({ caseId: params.id, ids: singleCase.generations }))
    }
    
    loadPage()
  }, [])

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
