import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import Modal from "react-modal"
import cytoscape from "cytoscape"
import klay from "cytoscape-klay"
import CytoscapeComponent from "react-cytoscapejs"
import popper from "cytoscape-popper"
import tippy from "tippy.js"
import "tippy.js/dist/tippy.css"
import Spinner from "../components/Spinner"
import { getPipeline } from "../features/pipeline/pipelineSlice"

cytoscape.use(klay)
cytoscape.use(popper)

function PipelineModal({ open, setState, pipelineUid }) {
  const [modalIsOpen, setModalIsOpen] = useState(open)
  const [uid, setUid] = useState("")

  const params = useParams()
  const dispatch = useDispatch()
  const cyRef = useRef(null)

  const layout = { name: "klay" }

  const { pipeline, isLoading: isLoadingPipeline } = useSelector(
    (state) => state.pipeline
  )

  // Open the modal by using the state taken as input
  useEffect(() => {
    setModalIsOpen(open)
  }, [open])

  // Populate modalData using the state taken as input
  useEffect(() => {
    setUid(pipelineUid)
  }, [pipelineUid])

  useEffect(() => {
    const getElements = async () => {
      await dispatch(getPipeline(uid))
      const cy = cyRef.current
      if (cy !== null) {
        cy.elements()
          .nodes()
          .forEach(function (ele) {
            makePopper(ele)
          })

        cy.elements().unbind("mouseover")
        cy.elements().bind("mouseover", (event) => event.target.tippy.show())

        cy.elements().unbind("mouseout")
        cy.elements().bind("mouseout", (event) => event.target.tippy.hide())
      }
    }

    getElements()
  }, [dispatch, uid])

  function makePopper(ele) {
    let ref = ele.popperRef()
    let dummyDomEle = document.createElement("div")

    ele.tippy = tippy(dummyDomEle, {
      // tippy options:
      content: () => {
        var div = document.createElement("div")
        div.classList.add("tooltip-div")
        var h3 = document.createElement("h3")
        var ul = document.createElement("ul")

        h3.innerHTML = ele._private.data.name

        for (const param in ele._private.data.params) {
          var li = document.createElement("li")
          li.innerHTML = `${param}: ${ele._private.data.params[param]}`
          ul.appendChild(li)
        }
        div.appendChild(h3)
        div.appendChild(ul)

        return div
      },
      getReferenceClientRect: ref.getBoundingClientRect,
      arrow: true,
      allowHTML: true,
      trigger: "manual", //when use program to handle
    })
  }

  const closeModal = () => {
    setState(false)
    setModalIsOpen(false)
  }

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel={`Pipeline ${pipelineUid}`}
      className="w-fit top-1/2 left-1/2 bottom-auto right-auto -translate-y-2/4 -translate-x-2/4 relative inset-y-1/2 rounded-lg bg-base-100 p-6 border border-base-100"
      style={{
        overlay: { backgroundColor: "rgba(0,0,0,0.65)", zIndex: "50" },
      }}
    >
      <div className="w-fit max-w-5xl h-fit bg-base-100 ml-44 p-4 mt-4">
        {!isLoadingPipeline && pipeline ? (
          <CytoscapeComponent
            className="bg-base-300 rounded-lg"
            cy={(cy) => {
              cyRef.current = cy
            }}
            elements={CytoscapeComponent.normalizeElements(pipeline)}
            userZoomingEnabled={true}
            minZoom={3}
            maxZoom={3}
            stylesheet={[
              {
                selector: "node",
                style: {
                  content: "data(name)",
                  "text-valign": "center",
                  "font-size": "8px",
                  width: "50px",
                  height: "50px",
                  "overlay-opacity": 0,
                },
              },
              {
                selector: "edge",
                style: {
                  "curve-style": "bezier",
                  "target-arrow-shape": "triangle",
                  "overlay-opacity": 0,
                },
              },
            ]}
            layout={layout}
          />
        ) : (
          <Spinner />
        )}
      </div>
    </Modal>
  )
}

export default PipelineModal
