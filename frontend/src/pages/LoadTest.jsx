import { useDispatch } from "react-redux"
import { putHistory } from "../features/history/historySlice"

function LoadTest() {
  const dispatch = useDispatch()

  const onSubmit = async (e) => {
    const results = []
    e.preventDefault()
    await Promise.all(
      [...e.target[0].files].map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => {
              try {
                resolve(results.push(JSON.parse(reader.result)))
              } catch (err) {
                // Return a blank value; ignore non-JSON (or do whatever else)
                console.log("Please use .json!")
                resolve()
              }
            }
            reader.readAsText(file)
          })
      )
    )

    // Do Stuff
    console.log(results)
    const asd = await dispatch(putHistory(results))
    console.log(asd)
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="file" multiple></input>
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
      <div id="json"></div>
    </>
  )
}

export default LoadTest
