import axios from "axios"

const API_URL = "/api/generation/"

// Create generation
const createGeneration = async (caseId, number) => {
  const response = await axios.post(API_URL, { caseId: caseId, number: number })

  return response.data
}

// Get generation
const getGeneration = async (generationId) => {
  const response = await axios.get(API_URL + generationId)

  return response.data
}

const historyService = {
  createGeneration,
  getGeneration,
}

export default historyService
