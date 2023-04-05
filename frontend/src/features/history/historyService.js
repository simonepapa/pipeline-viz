import axios from "axios"

const API_URL = "/api/history/"

// Get history
const getHistory = async (historyId) => {
  const response = await axios.get(API_URL + historyId)

  return response.data
}

// Put history
const putHistory = async (history, caseId) => {
  const response = await axios.post(API_URL, { history: history, caseId: caseId })

  return response.data
}

const historyService = {
  getHistory,
  putHistory,
}

export default historyService
