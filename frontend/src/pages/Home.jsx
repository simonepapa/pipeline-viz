import { useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"
import { useDispatch, useSelector } from "react-redux"
import cytoscape from "cytoscape"
import klay from "cytoscape-klay"
import CytoscapeComponent from "react-cytoscapejs"
import popper from "cytoscape-popper"
import Tooltip from "../components/Tooltip"
import { getHistory } from "../features/history/historySlice"

cytoscape.use(klay)
cytoscape.use(popper)

function Home() {
  const cyRef = useRef(null)
  const cyPopperRef = useRef(null)
  const layout = { name: "klay" }

  const { history, isLoading, isError, message } = useSelector(
    (state) => state.history
  )
  const dispatch = useDispatch()

  useEffect(() => {
    const getElements = async () => {
      await dispatch(getHistory())
      for (const property in history) {
        console.log(`${property}: ${history[property]}`)
      }
      const cy = cyRef.current

      cy.nodes().on("mouseover", (event) => {
        cyPopperRef.current = event.target.popper({
          content: createContentFromComponent(<Tooltip data={event.target._private.data} />),
          popper: {
            placement: "top",
            removeOnDestroy: true,
          },
        })
      })

      cy.nodes().on("mouseout", () => {
        if (cyPopperRef) {
          cyPopperRef.current.destroy()
        }
      })
    }

    getElements()
  }, [dispatch])

  console.log(history)

  const createContentFromComponent = (component) => {
    const dummyDomEle = document.createElement("div")
    const rootElement = dummyDomEle
    const root = createRoot(rootElement)
    root.render(component)
    document.body.appendChild(dummyDomEle)
    return dummyDomEle
  }

  return (
    <>
      {!isLoading && (
        <CytoscapeComponent
          cy={(cy) => {
            cyRef.current = cy
          }}
          elements={CytoscapeComponent.normalizeElements(history)}
          userZoomingEnabled={true}
          minZoom={3}
          maxZoom={3}
          stylesheet={[
            {
              selector: "node",
              style: {
                content: "data(operation_type)",
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
      )}
    </>
  )
}

export default Home
