'use client'

import { useEffect } from 'react'

const useMetadata = (title: string) => {
  useEffect(() => {
    document.title = title
  }, [title])
}

export default useMetadata
