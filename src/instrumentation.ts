import * as Sentry from '@sentry/nextjs'
import { AppError } from '@/utils'
import { type Instrumentation } from 'next'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config')
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config')
  }
}

export const onRequestError: Instrumentation.onRequestError = async (
  err: Error | AppError | unknown,
) => {
  function isAppError(error: unknown): error is AppError {
    return (
      error !== null &&
      typeof error === 'object' &&
      '_type' in error &&
      (error as any)._type === 'AppError'
    )
  }

  if (isAppError(err)) {
    Sentry.captureException(err, {
      extra: err.extra,
    })
  } else {
    Sentry.captureException(err)
  }
}
