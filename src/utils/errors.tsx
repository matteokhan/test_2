export class AppError extends Error {
  constructor(userMessage: string, detailedMessage: string, extra?: Record<string, any>) {
    super(userMessage)
    this.name = `AppError: ${detailedMessage}`
    this.extra = extra
  }
  readonly _type = 'AppError'
  extra?: Record<string, any>

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      extra: this.extra,
    }
  }
}
