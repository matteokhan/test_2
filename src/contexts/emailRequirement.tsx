// This context is used to keep track of the email requirement for each passenger form
// At least, one adult should provide an email

'use client'

import React, { createContext, useContext, useState } from 'react'

type EmailRequirementContextType = {
  isEmailProvided: boolean[]
  setIsEmailProvided: React.Dispatch<React.SetStateAction<boolean[]>>
  atLeastOneEmail: boolean
}

const EmailRequirementContext = createContext<EmailRequirementContextType | undefined>(undefined)

export const EmailRequirementProvider: React.FC<
  React.PropsWithChildren<{ totalPassengers: number }>
> = ({ children, totalPassengers }) => {
  const [isEmailProvided, setIsEmailProvided] = useState<boolean[]>(
    Array(totalPassengers).fill(false),
  )
  const atLeastOneEmail = isEmailProvided.some((value) => value)

  return (
    <EmailRequirementContext.Provider
      value={{ isEmailProvided, setIsEmailProvided, atLeastOneEmail }}>
      {children}
    </EmailRequirementContext.Provider>
  )
}

export const useEmailRequirement = () => {
  const context = useContext(EmailRequirementContext)
  if (context === undefined) {
    throw new Error('useEmailRequirement must be used within a EmailRequirementProvider')
  }
  return context
}
