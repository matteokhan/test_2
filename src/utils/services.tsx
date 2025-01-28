import { env } from 'next-runtime-env'

export const getEnvVar = ({ name }: { name: string }) => {
  const variable = env(name) || ''
  if (!variable) {
    throw new Error(`${name} env var missing`)
  }
  return variable
}
