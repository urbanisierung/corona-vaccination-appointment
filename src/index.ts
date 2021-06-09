/* eslint-disable no-await-in-loop */
import { VaccinationCentreToCheck } from './const/VaccinationCentreToCheck.const'
import { VaccinationCentreController } from './controllers/vaccination-centre.controller'
import { VaccinationAppointmentCheck } from './controllers/vaccinationAppointmentCheck.controller'
import { logger } from './utils/Logger'
import { TimerUtils } from './utils/TimerUtils'

async function run() {
  const vaccinationCentreController = new VaccinationCentreController()
  const vaccinationAppointmentCheck: VaccinationAppointmentCheck = new VaccinationAppointmentCheck()
  let iteration = 0
  const waitingSeconds = 10 * 60

  // eslint-disable-next-line no-constant-condition
  while (true) {
    logger.info(`========== Iteration ${iteration} ==========`)
    const centres = await vaccinationCentreController.get()
    await vaccinationAppointmentCheck.checkAllStates({
      states: VaccinationCentreToCheck,
      vaccinationCentres: centres,
    })
    logger.info(
      `========== Iteration ${iteration} done, waiting for ${waitingSeconds} seconds (${new Date().toISOString()}) ==========`
    )
    await TimerUtils.sleep(waitingSeconds)
  }
}

run()
