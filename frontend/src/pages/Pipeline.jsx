import { useEffect, useRef } from "react"
import { NavLink, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import cytoscape from "cytoscape"
import klay from "cytoscape-klay"
import CytoscapeComponent from "react-cytoscapejs"
import popper from "cytoscape-popper"
import tippy from "tippy.js"
import "tippy.js/dist/tippy.css"
import Sidebar from "../components/Sidebar"
import Spinner from "../components/Spinner"
import { getPipeline, resetInfo } from "../features/pipeline/pipelineSlice"

cytoscape.use(klay)
cytoscape.use(popper)

function Generation() {
  const params = useParams()
  const dispatch = useDispatch()
  const cyRef = useRef(null)

  const layout = { name: "klay" }

  const { singleCase, isLoading } = useSelector((state) => state.case)
  const {
    generation,
    isLoading: isLoadingGeneration,
    isError: isErrorGeneration,
    message: generationMessage,
  } = useSelector((state) => state.generation)
  const {
    pipeline,
    isLoading: isLoadingPipeline,
    isError: isErrorPipeline,
    message: pipelineMessage,
  } = useSelector((state) => state.pipeline)

  useEffect(() => {
    if (isErrorGeneration) {
      toast.error(generationMessage)
    }

    if (isErrorPipeline) {
      toast.error(pipelineMessage)
    }

    dispatch(resetInfo())
  }, [isErrorGeneration, generationMessage, isErrorPipeline, pipelineMessage])

  useEffect(() => {
    const getElements = async () => {
      await dispatch(getPipeline(params.pipeline))
      for (const property in pipeline) {
        console.log(`${property}: ${pipeline[property]}`)
      }
      const cy = cyRef.current

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

    getElements()
  }, [dispatch])

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

        h3.innerHTML =
          //ele._private.data.id + ": " + ele._private.data.operation_type
          ele._private.data.name

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
          <p>
            Please note that the pipelines are not in order. The number is shown
            only to identify each pipeline
          </p>
          <div className="flex flex-wrap mt-4">
            {(!isLoadingPipeline && pipeline) ? (
              <CytoscapeComponent
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
                    },
                  },
                  {
                    selector: "edge",
                    style: {
                      "curve-style": "bezier",
                      "target-arrow-shape": "triangle",
                    },
                  },
                ]}
                layout={layout}
              />
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
