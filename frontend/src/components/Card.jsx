import { Link } from "react-router-dom"

function Card({ singleCase }) {
  return (
    <div className="card w-96 bg-base-200 shadow-xl mx-2 mt-4">
      <div className="card-body">
        <h2 className="card-title">{singleCase.name}</h2>
        <p>{singleCase.description && singleCase.description}</p>
        <div className="card-actions justify-end">
          <Link
            key={singleCase && singleCase._id}
            to={`/cases/${singleCase._id}`}
            className="btn btn-primary"
          >
            Open
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Card
