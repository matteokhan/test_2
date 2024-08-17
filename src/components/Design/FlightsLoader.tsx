import { Box } from '@mui/material'

export const FlightsLoader = () => {
  return (
    <Box
      width="80px"
      height="80px"
      minHeight="80px"
      minWidth="80px"
      bgcolor="white"
      borderRadius="80px"
      overflow="hidden"
      position="relative">
      <img
        src="cloud.svg"
        width="32px"
        height="21px"
        style={{ position: 'absolute', top: '12px', left: '40px' }}
      />
      <img
        src="cloud.svg"
        width="32px"
        height="21px"
        style={{ position: 'absolute', top: '47px', left: '-6px' }}
      />
    </Box>
  )
}
