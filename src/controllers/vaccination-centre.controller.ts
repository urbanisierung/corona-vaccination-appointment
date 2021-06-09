import axios, { AxiosRequestConfig } from 'axios'
import { VaccinationCentres } from '../types/VaccinationCentre.type'
import { logger } from '../utils/Logger'

export class VaccinationCentreController {
  private config: AxiosRequestConfig = {
    method: `GET`,
    url: `https://www.impfterminservice.de/assets/static/impfzentren.json`,
  }

  public async get(): Promise<VaccinationCentres> {
    try {
      const response = await axios(this.config)
      const centres: VaccinationCentres = response.data
      return centres
    } catch (error) {
      logger.error(error)
    }
  }
}
