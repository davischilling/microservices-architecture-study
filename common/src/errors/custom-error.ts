import { ErrorProtocol } from '../protocols'

export abstract class CustomError extends Error implements ErrorProtocol {
  abstract statusCode: number

  constructor (message: string) {
    super(message)
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  abstract serializeErrors(): {
    message: string; field?: string
  }[]
}