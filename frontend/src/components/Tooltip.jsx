import Tippy from "@tippyjs/react"
import "tippy.js/dist/tippy.css"

function Tooltip({ data }) {
  const printParams = (params) => {
    const elements = []
    for (const param in params) {
      elements.push(<li className="text-base"><span className="font-bold">{`${param}: `}</span>{`${params[param]}`}</li>)
    }
    return elements
  }
  console.log(data)

  return (
    <Tippy id="asdrubale" content="test">
      <div className="bg-info p-7 rounded-lg">
        <h3 className="font-bold text-center text-lg">ID: {data.id}</h3>
        {data.custom_params && (
          <ul className="list-disc mt-2">{printParams(data.custom_params)}</ul>
        )}
      </div>
    </Tippy>
  )
}

export default Tooltip
