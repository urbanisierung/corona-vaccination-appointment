import { VaccinationCentre } from './VaccinationCentre.type'

export interface AppointmentCheckResult {
  termineVorhanden: boolean
  vorhandeneLeistungsmerkmale: string[]
}

export interface AppointmentCheckFullResult {
  service: AppointmentCheckResult
  centre: VaccinationCentre
  executed: boolean
  waitingRoom: boolean
}
