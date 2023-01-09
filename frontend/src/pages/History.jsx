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
import Spinner from "../components/Spinner"
import { getCase } from "../features/case/caseSlice"
import {
  getGenerations,
  getGenerationCases,
  resetInfo,
} from "../features/case/caseSlice"

Modal.setAppElement("#root")
cytoscape.use(dagre)

function History() {
  const params = useParams()
  const dispatch = useDispatch()
  const cyRef = useRef(null)
  const elements = {
    nodes: [],
    edges: [],
  }

  const layout = { name: "preset" }

  const { singleCase, pipelines, isLoading, isError, message } = useSelector(
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
        position: { x: 0, y: i * 18 },
      })
      pipelines[i].map((pipeline, index) => {
        elements.nodes.push({
          data: {
            id: i + "-" + pipeline.uid,
            parent: "container-" + i,
            label: "pip_" + i + "_" + index,
            info: {
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
          position: { x: index === 0 ? 15 : index * 15, y: i * 18 },
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
    //for (let i = 0; i < elements.edges.length; i++) {
    //  const status = elements.nodes.find(
    //    (element) => element.data.id === elements.edges[i].data.source
    //  )
    //  //console.log(status)
    //  if (status === undefined) {
    //    //console.log("Edge: ", elements.edges[i])
    //    const index = elements.edges.indexOf(elements.edges[i])
    //    console.log(index)
    //    //console.log("Index: ", elements.edges.findIndex(x => x.data.id === elements.edges[i].data.id))
    //    elements.edges.splice(index, 1)
    //  }
    //}
  }

  return (
    <>
      <Sidebar />
      <main>
        <div className="w-9/12 h-fit bg-base-100 mx-auto p-4 mt-2 ml-44 mr-4">
          <h1 className="text-2xl opacity-100">History</h1>
          <p className="text-lg mt-1">Case description</p>
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
                    shape: "square",
                    width: "10px",
                    height: "5px",
                    "font-size": "2px",
                    "background-color": "#9de1f4",
                    "border-color": "#999",
                    "border-width": "0.1px",
                    "border-style": "solid",
                    "overlay-opacity": 0,
                  },
                },
                {
                  selector: "node[generation_label]",
                  css: {
                    content: "data(label)",
                    "text-valign": "center",
                    "text-halign": "center",
                    shape: "square",
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
            <Spinner />
          )}
        </div>
      </main>
    </>
  )
}

export default History
