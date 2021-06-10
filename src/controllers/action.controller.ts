import notifier from 'node-notifier'
import { AppointmentCheckFullResult } from '../types/AppointmentCheckResult.type'
import { logger } from '../utils/Logger'

export class ActionController {
  public static action(result: AppointmentCheckFullResult) {
    const url = `${result.centre.URL}impftermine/service?plz=${result.centre.PLZ}`

    if (result.service.termineVorhanden) {
      // APPOINTMENT AVAILABLE
      logger.info(
        `${result.centre.PLZ} / ${result.centre.Ort} | FREE!!! | URL: ${url}`
      )
      notifier.notify({
        title: `FREE Vaccination Centre Appointment!`,
        message: `${result.centre.PLZ} / ${result.centre.Ort} | URL: ${url}`,
        sound: true,
        wait: true,
      })
    } else if (result.waitingRoom) {
      // WAITING ROOM
      logger.info(
        `${result.centre.PLZ} / ${result.centre.Ort} | Waiting Room | URL: ${url}`
      )
    }
  }
}
