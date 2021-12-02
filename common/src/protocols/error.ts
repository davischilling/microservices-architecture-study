export interface ErrorProtocol {
  statusCode: number
  serializeErrors(): {
    message: string
    field?: string
  }[]
}
