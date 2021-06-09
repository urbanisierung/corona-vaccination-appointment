import pino from 'pino'
import * as dotenv from 'dotenv'

dotenv.config()

// locally using pretty config: https://github.com/pinojs/pino-pretty
const localConfig = {
  name: 'bootstrap',
  level: 'debug',
  prettyPrint: { colorize: true },
}

const config = {
  name: 'bootstrap',
  level: 'debug',
}

export const logger =
  process.env.NODE_ENV === 'local' ? pino(localConfig) : pino(config)
