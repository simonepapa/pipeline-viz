import axios from "axios"

const API_URL = "/api/pipeline/"

// Get history
const getPipeline = async (pipelineId) => {
  const response = await axios.get(API_URL + pipelineId)

  return response.data
}

// Put history
const putPipeline = async (pipelines, caseId, generation) => {
  const response = await axios.post(API_URL, { pipelines: pipelines, caseId: caseId, generation: generation })

  return response.data
}

const historyService = {
  getPipeline,
  putPipeline,
}

export default historyService
