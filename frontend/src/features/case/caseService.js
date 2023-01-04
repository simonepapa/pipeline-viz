import axios from "axios"

const API_URL = "/api/case/"

// Get case
const getCases = async () => {
  const response = await axios.get(API_URL)

  return response.data
}

// Create case
const createCase = async (name, description) => {
  const response = await axios.post(API_URL, { name: name, description: description })

  return response.data
}

const historyService = {
  getCases,
  createCase,
}

export default historyService
