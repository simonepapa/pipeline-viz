import axios from "axios"

const API_URL = "/api/case/"

// Get cases
const getCases = async () => {
  const response = await axios.get(API_URL)

  return response.data
}

// Create case
const createCase = async (name, description) => {
  const response = await axios.post(API_URL, { name: name, description: description })

  return response.data
}

// Get case
const getCase = async (caseId) => {
  const response = await axios.get(API_URL + caseId)

  return response.data
}

// Get generations
const getGenerations = async (caseId, ids) => {
  const response = await axios.post(API_URL + caseId + "/generations", {ids: ids})

  return response.data
}

const historyService = {
  getCases,
  createCase,
  getCase,
  getGenerations,
}

export default historyService
