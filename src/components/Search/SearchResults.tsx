import { Stack } from '@mui/material'
import { Solution } from '@/types'
import { FlightResult } from '@/components'

export const SearchResults = ({
  results,
  correlationId,
}: {
  results?: Solution[]
  correlationId: string
}) => {
  return (
    <Stack gap={2}>
      {results &&
        results.map((result) => (
          <FlightResult key={result.id} result={result} correlationId={correlationId} />
        ))}
      {/* TODO: Need some styling */}
      {!results && <p>No results found</p>}
    </Stack>
  )
}
