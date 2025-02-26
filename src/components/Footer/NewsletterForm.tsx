'use client'

import { useState } from 'react'
import * as Yup from 'yup'

const emailSchema = Yup.string().email('E-mail invalide').required("L'e-mail est requis")

export const NewsletterForm = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      await emailSchema.validate(email)
      setError('')
      setEmail('')
      const url = `https://www.leclercvoyages.com/account/signup/newsletter?email=${encodeURIComponent(email)}`
      window.open(url, '_blank')
    } catch (error: unknown) {
      if (error instanceof Yup.ValidationError) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex' }}>
        <input
          className="input-newsletter"
          type="text"
          name="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError('')
          }}
        />
        <button className="reset-button button--primary espacePriv" type="submit">
          OK
        </button>
      </div>
      {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
    </form>
  )
}
