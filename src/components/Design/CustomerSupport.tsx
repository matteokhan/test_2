import { Box, Stack, Typography } from '@mui/material'

export const CustomerSupport = () => {
  return (
    <Box>
      <Typography
        variant="headlineSm"
        pt={1}
        pb={1.5}
        sx={{ display: { xs: 'none', lg: 'block' } }}>
        Besoin d’aide pour réserver ?
      </Typography>
      <Typography
        variant="headlineMd"
        pt={1}
        pb={1.5}
        sx={{ display: { xs: 'block', lg: 'none' } }}>
        Besoin d’aide pour réserver ?
      </Typography>
      <Stack direction="row">
        <Box border="1px solid" borderColor="grey.400" py={0.7} px={1} borderRight="0px">
          <Typography variant="headlineMd" color="#A50F78">
            0 825 554 620
          </Typography>
        </Box>
        <Box bgcolor="#A50F78" py={0.7} px={1}>
          <Typography variant="bodySm" color="white" textAlign="right">
            Service 0,15€/min
            <br />+ prix appel
          </Typography>
        </Box>
      </Stack>
      <Typography variant="bodyMd" color="grey.800" pt={0.8}>
        Du lundi au samedi 9h-20h
      </Typography>
    </Box>
  )
}
