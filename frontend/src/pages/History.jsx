import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import cytoscape from "cytoscape"
import CytoscapeComponent from "react-cytoscapejs"
import dagre from "cytoscape-dagre"
import Modal from "react-modal"
import tippy from "tippy.js"
import "tippy.js/dist/tippy.css"
import Sidebar from "../components/Sidebar"
import SpinnerFull from "../components/SpinnerFull"
import PipelineModal from "../components/PipelineModal"
import { getCase } from "../features/case/caseSlice"
import {
  getGenerations,
  getGenerationCases,
  resetInfo,
} from "../features/case/caseSlice"

Modal.setAppElement("#root")
cytoscape.use(dagre)

function History() {
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [uid, setUid] = useState(false)

  const params = useParams()
  const dispatch = useDispatch()
  const cyRef = useRef(null)
  const elements = {
    nodes: [],
    edges: [],
  }

  const layout = { name: "preset" }

  const { singleCase, pipelines, isLoading } = useSelector(
    (state) => state.case
  )

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

        for (const param in ele._private.data.info) {
          var li = document.createElement("li")
          li.innerHTML = `<span style="font-weight:700">${param}:</span> ${ele._private.data.info[param]}`
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

  useEffect(() => {
    const loadPage = async () => {
      if (Object.keys(singleCase).length === 0) {
        await dispatch(getCase(params.id)).then((e) => {
          dispatch(
            getGenerations({ caseId: params.id, ids: e.payload.generations })
          ).then(async (event) => {
            const pipelineIDS = []
            for (const generation of event.payload) {
              pipelineIDS.push(generation.pipelines)
            }
            await dispatch(
              getGenerationCases({ caseId: params.id, ids: pipelineIDS })
            )
            const cy = cyRef.current

            cy.elements().unbind("mouseover")
            cy.elements().unbind("mouseout")

            cy.elements()
              .nodes()
              .forEach(function (ele) {
                if (
                  !ele._private.data.id.startsWith("container") &&
                  !ele._private.data.id.startsWith("generation")
                ) {
                  makePopper(ele)
                  ele.bind("mouseover", (event) => event.target.tippy.show())
                  ele.bind("mouseout", (event) => event.target.tippy.hide())
                  ele.bind("click", (event) => {
                    cy.elements().nodes().removeClass("successors")
                    cy.elements().nodes().removeClass("predecessors")
                    let successors = event.target.successors()
                    let i = 0

                    let highlightSuccessor = function () {
                      if (i < successors.length) {
                        if (!successors[i].hasClass("successors"))
                          successors[i].addClass("successors")
                        else successors[i].removeClass("successors")
                        i++
                        highlightSuccessor()
                      }
                    }

                    let predecessors = event.target.predecessors()
                    let j = 0

                    let highlightPredecessor = function () {
                      if (j < predecessors.length) {
                        if (!predecessors[j].hasClass("predecessors"))
                          predecessors[j].addClass("predecessors")
                        else predecessors[j].removeClass("predecessors")
                        j++
                        highlightPredecessor()
                      }
                    }
                    highlightSuccessor()
                    highlightPredecessor()
                  })
                  ele.bind("dblclick", (event) => {
                    setUid(event.target._private.data.info.fetch_id)
                    setModalIsOpen(true)
                  })
                }
              })
          })
        })
      } else {
        dispatch(
          getGenerations({ caseId: params.id, ids: singleCase.generations })
        ).then((e) => {
          const pipelineIDS = []
          for (const generation of e.payload) {
            pipelineIDS.push(generation.pipelines)
          }
          dispatch(getGenerationCases({ caseId: params.id, ids: pipelineIDS }))
        })
      }
    }

    loadPage()
  }, [])

  if (pipelines.length !== 0) {
    for (let i = 0; i < pipelines.length; i++) {
      elements.nodes.push({
        data: { id: "container-" + i, container: "true" },
        grabbable: false,
      })
      elements.nodes.push({
        data: {
          id: "generation_" + i + "_label",
          parent: "container-" + i,
          label: "Generation " + i,
          generation_label: "true",
        },
        grabbable: false,
        // to remove parent left margin: position: { x: 0, y: i * 18 },,
        position: { x: i * 10, y: i * 18 },
      })
      pipelines[i].map((pipeline, index) => {
        elements.nodes.push({
          data: {
            id: i + "-" + pipeline.uid,
            parent: "container-" + i,
            label: "pip_" + i + "_" + index,
            info: {
              fetch_id: pipeline._id,
              uid: pipeline.uid,
              native_generation: pipeline.native_generation,
              ...(pipeline.parent_operator !== null &&
                pipeline.parent_operator.operators.length !== 0 && {
                  parent_individual:
                    pipeline.parent_operator.parent_individuals[0],
                }),
              ...(pipeline.parent_operator !== null && {
                type: pipeline.parent_operator.type_,
              }),
            },
          },
          grabbable: false,
          position: {
            // to remove parent left margin: x: index === 0 ? 15 : index * 15,
            x: index === 0 ? i * 10 + 15 : i * 10 + index * 15,
            y: i * 18,
          },
        })
        if (
          pipeline.parent_operator !== null &&
          pipeline.parent_operator.operators.length !== 0
        ) {
          elements.edges.push({
            data: {
              source:
                i - 1 + "-" + pipeline.parent_operator.parent_individuals[0],
              target: i + "-" + pipeline.uid,
            },
          })
        }
      })
    }
    let length = elements.edges.length
    // Loop through the edges to delete the ones with an invalid source
    // We loop backwards to make sure that we delete all the edges (looping forwards causes the array to shrink, so we would miss some edges)
    while (length--) {
      // Check if the source node exists
      const status = elements.nodes.find(
        (element) => element.data.id === elements.edges[length].data.source
      )
      // If it doesn't exist
      if (status === undefined) {
        // First we tag the edgeless node
        const warningElement = elements.nodes.find(
          (element) => element.data.id === elements.edges[length].data.target
        )
        if (warningElement.data.info.hasOwnProperty("parent_individual")) {
          warningElement.data.warning = "true"
        }

        // Then we remove the edge
        const index = elements.edges.indexOf(elements.edges[length])
        elements.edges.splice(index, 1)
      }
    }
  }

  return (
    <>
      <Sidebar />
      <main>
        <div className="w-9/12 h-fit bg-base-100 mx-auto p-4 mt-2 ml-44 mr-4">
          <h1 className="text-2xl opacity-100">History of {singleCase.name}</h1>
          <p className="text-lg mt-1">{singleCase.description}</p>
          <p className="text-sm mt-1">
            You can zoom in and out with the scroll wheel.
          </p>
          <p className="text-sm mt-1">
            You can hover over each pipeline to see more additional information.
          </p>
          <p className="text-sm mt-1">
            You can single click a pipeline to highlight its predecessors (green border) and successors (red border).
          </p>
          <p className="text-sm mt-1">
            You can double click a pipeline to view its nodes (to close the modal just click outside of it)
          </p>
          <p className="text-sm mt-1">
            If you can't see nodes tooltip on hover or you can't click on pipelines, please refresh the page.
          </p>
          <p className="text-sm mt-1">
            Pipelines with a yellow background are those that are missing the
            parent pipeline. If you hover on them you can see their parent
            individual UID.
          </p>
        </div>
        <div className="flex flex-wrap mt-4">
          {!isLoading ? (
            <CytoscapeComponent
              cy={(cy) => {
                cyRef.current = cy
              }}
              elements={CytoscapeComponent.normalizeElements(elements)}
              stylesheet={[
                {
                  selector: "node[^container]",
                  css: {
                    content: "data(label)",
                    "text-valign": "center",
                    "text-halign": "center",
                    shape: "rectangle",
                    width: "10px",
                    height: "5px",
                    "font-size": "2px",
                    "background-color": "#9de1f4",
                    "border-color": "#999",
                    "border-width": "0.1px",
                    "border-style": "solid",
                    "overlay-opacity": 0,
                    "transition-delay": 0,
                    "transition-timing-function": "linear",
                    "transition-duration": "0.25s",
                    "transition-property": "border-color border-width",
                  },
                },
                {
                  selector: "node[generation_label]",
                  css: {
                    content: "data(label)",
                    "text-valign": "center",
                    "text-halign": "center",
                    shape: "round-rectangle",
                    width: "12px",
                    height: "5px",
                    "font-size": "1.5px",
                    "background-color": "#fff",
                    "border-color": "#999",
                    "border-width": "0.1px",
                    "border-style": "solid",
                    "overlay-opacity": 0,
                  },
                },
                {
                  selector: ".successors",
                  css: {
                    "border-color": "red",
                    "border-width": "0.5px",
                  },
                },
                {
                  selector: ".predecessors",
                  css: {
                    "border-color": "green",
                    "border-width": "0.5px",
                  },
                },
                {
                  selector: "node[warning]",
                  css: {
                    "background-color": "yellow",
                  },
                },
                {
                  selector: ":parent",
                  css: {
                    "text-valign": "top",
                    "text-halign": "center",
                    "background-color": "#d3d7e8",
                    "border-color": "#263238",
                    "border-width": "0.1px",
                    "border-style": "solid",
                    "overlay-opacity": 0,
                    padding: "2px",
                  },
                },
                {
                  selector: "edge",
                  css: {
                    "curve-style": "bezier",
                    "edge-distances": "node-position",
                    "target-arrow-shape": "triangle",
                    "arrow-scale": 0.1,
                    width: "0.1px",
                    "overlay-opacity": 0,
                    "line-color": "#007dff",
                    "target-arrow-color": "#007dff",
                  },
                },
              ]}
              layout={layout}
            />
          ) : (
            <SpinnerFull />
          )}
        </div>
      </main>

      <PipelineModal
        open={modalIsOpen}
        setState={() => setModalIsOpen(!modalIsOpen)}
        pipelineUid={uid}
      />
    </>
  )
}

export default History
