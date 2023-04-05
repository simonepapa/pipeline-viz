import { useEffect, useState, useRef } from "react"
import Modal from "react-modal"
import cytoscape from "cytoscape"
import klay from "cytoscape-klay"
import CytoscapeComponent from "react-cytoscapejs"
import popper from "cytoscape-popper"
import tippy from "tippy.js"
import "tippy.js/dist/tippy.css"
import Spinner from "../components/Spinner"

cytoscape.use(klay)
cytoscape.use(popper)

function PipelineModal({ open, setState, pipelineUid, history }) {
  const [modalIsOpen, setModalIsOpen] = useState(open)
  const [uid, setUid] = useState("")
  const [pipeline, setPipeline] = useState({})
  const elements = {
    nodes: [],
    edges: [],
  }

  const cyRef = useRef(null)

  const layout = { name: "klay" }

  // Open the modal by using the state taken as input
  useEffect(() => {
    setModalIsOpen(open)
  }, [open])

  // Populate modalData using the state taken as input
  useEffect(() => {
    setUid(pipelineUid)
  }, [pipelineUid])

  useEffect(() => {
    if (Object.keys(history).length !== 0) {
      const found = history.individuals_pool.find(
        (pipeline) => pipeline.uid === uid
      )
      setPipeline(found)
    }
  }, [uid, history])

  useEffect(() => {
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
  }, [uid])

  if (history !== undefined && Object.keys(history).length !== 0) {
    if (pipeline !== undefined && Object.keys(pipeline).length !== 0) {
      for (let i = 0; i < pipeline.graph.operator._nodes.length; i++) {
        elements.nodes.push({
          data: {
            id: pipeline.graph.operator._nodes[i].uid,
            label: pipeline.graph.operator._nodes[i].content.name,
            ...(pipeline.graph.operator._nodes[i].content.params !==
              undefined && {
              params: pipeline.graph.operator._nodes[i].content.params,
            }),
          },
          grabbable: false,
        })
        for (
          let j = 0;
          j < pipeline.graph.operator._nodes[i]._nodes_from.length;
          j++
        ) {
          elements.edges.push({
            data: {
              source: pipeline.graph.operator._nodes[i]._nodes_from[j],
              target: pipeline.graph.operator._nodes[i].uid,
            },
          })
        }
      }
    }
  }

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

        h3.innerHTML = ele._private.data.label

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
        {pipeline !== undefined && Object.keys(history).length !== 0 ? (
          <CytoscapeComponent
          className="bg-base-300 rounded-lg"
          cy={(cy) => {
            cyRef.current = cy
          }}
          elements={CytoscapeComponent.normalizeElements(elements)}
          userZoomingEnabled={true}
          minZoom={3}
          maxZoom={3}
          stylesheet={[
            {
              selector: "node",
              style: {
                content: "data(label)",
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
