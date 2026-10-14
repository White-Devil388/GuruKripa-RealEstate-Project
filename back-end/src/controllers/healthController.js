import { getHealthStatus } from '../services/api/index.js'

export function getHealth(_request, response) {
  response.json(getHealthStatus())
}
