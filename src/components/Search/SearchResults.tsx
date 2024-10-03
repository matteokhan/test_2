import { Stack } from '@mui/material'
import { Solution } from '@/types'
import { FlightResult } from '@/components'

export const SearchResults = ({ results }: { results?: Solution[] }) => {
  return (
    <Stack gap={2}>
      {results && results.map((result) => <FlightResult key={result.id} result={result} />)}
      {/* TODO: Need some styling */}
      {!results && <p>No results found</p>}
    </Stack>
  )
}
