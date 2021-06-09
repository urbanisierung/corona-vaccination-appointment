export interface VaccinationCentre {
  Zentrumsname: string
  PLZ: string
  Ort: string
  Bundesland: string
  URL: string
  Adresse: string
}

export interface VaccinationCentres {
  'Baden-Württemberg': VaccinationCentre[]
  Brandenburg: VaccinationCentre[]
  Hamburg: VaccinationCentre[]
  Hessen: VaccinationCentre[]
  'Nordrhein-Westfalen': VaccinationCentre[]
  'Sachsen-Anhalt': VaccinationCentre[]
}
