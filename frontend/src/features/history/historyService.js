import axios from "axios"

const API_URL = "/api/history/"

// Get history
const getHistory = async () => {
  const response = await axios.get(API_URL)

  return response.data
}

const historyService = {
  getHistory,
}

export default historyService
