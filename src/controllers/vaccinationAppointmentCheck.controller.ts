/* eslint-disable no-await-in-loop */
import puppeteer from 'puppeteer'
import { AppointmentCheckFullResult } from '../types/AppointmentCheckResult.type'
import {
  VaccinationCentre,
  VaccinationCentres,
} from '../types/VaccinationCentre.type'
import { logger } from '../utils/Logger'
import { TimerUtils } from '../utils/TimerUtils'
import { ActionController } from './action.controller'

export interface CheckRequest {
  states: string[]
  vaccinationCentres: VaccinationCentres
}

export class VaccinationAppointmentCheck {
  private browser

  public async init() {
    if (!this.browser) {
      logger.info(`launching browser`)
      this.browser = await puppeteer.launch({
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--single-process'],
      })
    }
  }

  public async checkAllStates(request: CheckRequest) {
    await this.init()
    let newPage = true
    for (const state of request.states) {
      const centres: VaccinationCentre[] = request.vaccinationCentres[state]

      // for (const centre of centres) {
      //   const result = await this.check(centre, newPage)
      //   newPage = false
      //   ActionController.action(result)
      //   await TimerUtils.sleep(1)
      // }

      const batches: VaccinationCentre[][] = []
      const batchSize = 15
      let tempCentres: VaccinationCentre[] = []
      for (let i = 0; i < centres.length; i++) {
        if (i % batchSize === 0) {
          if (tempCentres.length > 0) {
            batches.push(tempCentres)
          }
          tempCentres = []
        } else {
          tempCentres.push(centres[i])
        }
      }
      for (const centresInBatch of batches) {
        const promises = centresInBatch.map((centre) => this.check(centre))
        const results = await Promise.all(promises)
        results.forEach((result) => {
          ActionController.action(result)
        })
        await TimerUtils.sleep(5)
      }
    }
  }

  public async check(
    centre: VaccinationCentre
  ): Promise<AppointmentCheckFullResult> {
    const base = 'https://www.impfterminservice.de/'
    const url = `${centre.URL}rest/suche/termincheck?plz=${centre.PLZ}&leistungsmerkmale=L920,L921,L922,L923`
    const page = await this.browser.newPage()
    await page.goto(base, { waitUntil: 'networkidle2' })
    await page.goto(url, { waitUntil: 'networkidle2' })
    const document = await page.evaluate(() => document.body.innerText)
    const result: AppointmentCheckFullResult = {
      centre,
      service: { termineVorhanden: false, vorhandeneLeistungsmerkmale: [] },
      executed: false,
      waitingRoom: false,
    }
    if (document.includes('Warteraum')) {
      result.waitingRoom = true
      result.executed = true
    } else if (!document.includes('Aufgrund') && document !== `{}`) {
      try {
        const service = JSON.parse(document)
        result.service = service
        result.executed = true
      } catch (error) {
        //
      }
    }
    await page.close()
    return result
  }

  // public async check(
  //   centre: VaccinationCentre,
  //   newPage: boolean = false
  // ): Promise<AppointmentCheckFullResult> {
  //   const base = 'https://www.impfterminservice.de/'
  //   const url = `${centre.URL}rest/suche/termincheck?plz=${centre.PLZ}&leistungsmerkmale=L920,L921,L922,L923`
  //   if (newPage) {
  //     this.page = await this.browser.newPage()
  //     await this.page.goto(base, { waitUntil: 'networkidle2' })
  //   }
  //   await this.page.goto(url, { waitUntil: 'networkidle2' })
  //   const document = await this.page.evaluate(() => document.body.innerText)
  //   const result: AppointmentCheckFullResult = {
  //     centre,
  //     service: { termineVorhanden: false, vorhandeneLeistungsmerkmale: [] },
  //     executed: false,
  //     waitingRoom: false,
  //   }
  //   if (document.includes('Warteraum')) {
  //     result.waitingRoom = true
  //     result.executed = true
  //   } else if (!document.includes('Aufgrund') && document !== `{}`) {
  //     try {
  //       const service = JSON.parse(document)
  //       result.service = service
  //       result.executed = true
  //     } catch (error) {
  //       //
  //     }
  //   }
  //   // await this.page.close()
  //   return result
  // }
}
