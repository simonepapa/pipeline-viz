import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import cytoscape from "cytoscape"
import klay from "cytoscape-klay"
import CytoscapeComponent from "react-cytoscapejs"
import popper from "cytoscape-popper"
import { getHistory } from "../features/history/historySlice"
import tippy from "tippy.js"
import "tippy.js/dist/tippy.css"

cytoscape.use(klay)
cytoscape.use(popper)

function Home() {
  const cyRef = useRef(null)
  const layout = { name: "klay" }

  const { history, isLoading, isError, message } = useSelector(
    (state) => state.history
  )
  const dispatch = useDispatch()

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
          ele._private.data.id + ": " + ele._private.data.operation_type

        for (const param in ele._private.data.custom_params) {
          var li = document.createElement("li")
          li.innerHTML = `${param}: ${ele._private.data.custom_params[param]}`
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
    const getElements = async () => {
      await dispatch(getHistory())
      for (const property in history) {
        console.log(`${property}: ${history[property]}`)
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
