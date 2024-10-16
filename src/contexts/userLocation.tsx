'use client'

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'

const positionOptions = {
  enableHighAccuracy: true,
}

type UserLocationContextType = {
  canAccessPosition: boolean
  position?: { lat: number; lng: number }
  askUserForPermission: () => void
}

const UserLocationContext = createContext<UserLocationContextType | undefined>(undefined)

export const UserLocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [position, setPosition] = useState<{ lat: number; lng: number }>()
  const [canAccessPosition, setCanAccessPosition] = useState<boolean>(false)

  const askUserForPermission = () => {
    // This will trigger the permission dialog unless permission denied
    fetchUserPosition()
  }

  const fetchUserPosition = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      (error: GeolocationPositionError) => {
        console.error(`ERROR(${error.code}): ${error.message}`) // TODO: log this somehow
        setCanAccessPosition(false)
      },
      positionOptions,
    )
  }, [])

  const checkPermissions = () => {
    navigator.permissions.query({ name: 'geolocation' }).then((permissions) => {
      switch (permissions.state) {
        case 'granted':
          setCanAccessPosition(true)
          break
        case 'prompt':
          setCanAccessPosition(false)
          break
        case 'denied':
          setCanAccessPosition(false)
          break
        default: {
          const _exhaustiveCheck: never = permissions.state
          return _exhaustiveCheck
        }
      }
    })
  }

  useEffect(() => {
    if ('geolocation' in navigator) {
      checkPermissions()
    } else {
      console.warn('Geolocation IS NOT available') // TODO: log this somehow
    }
  })

  useEffect(() => {
    if (canAccessPosition) {
      fetchUserPosition()
    }
  }, [canAccessPosition, fetchUserPosition])

  return (
    <UserLocationContext.Provider
      value={{
        canAccessPosition,
        position,
        askUserForPermission,
      }}>
      {children}
    </UserLocationContext.Provider>
  )
}

export const useUserLocation = () => {
  const context = useContext(UserLocationContext)
  if (context === undefined) {
    throw new Error('useUserLocation must be used within a UserLocationProvider')
  }
  return context
}
