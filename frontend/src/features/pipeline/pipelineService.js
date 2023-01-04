import axios from "axios"

const API_URL = "/api/history/"

// Get history
const getHistory = async () => {
  const response = await axios.get(API_URL)

  return response.data
}

// Put history
const putHistory = async (historyArray) => {
  const response = await axios.post(API_URL, { historyArray: historyArray })

  return response.data
}

const historyService = {
  getHistory,
  putHistory,
}

export default historyService
