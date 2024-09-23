'use client'

import { SalutationOption } from '@/types'
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  FormHelperText,
  FormControl,
  Box,
} from '@mui/material'
import { useField } from 'formik'

const options: { value: SalutationOption; label: string; testId: string }[] = [
  { value: 'Mr', label: 'Mr', testId: 'salutationField-mr' },
  { value: 'Mme', label: 'Mme', testId: 'salutationField-mme' },
]

export const SalutationField = ({ name }: { name: string }) => {
  const [field, meta] = useField(name)

  return (
    <FormControl error={meta.touched && !!meta.error} data-testid="salutationField">
      <Stack direction="row">
        <RadioGroup {...field}>
          <Box py={1.3}>
            <Stack
              direction="row"
              gap={0.5}
              alignItems="center"
              sx={{ position: 'relative', left: 8 }}>
              {options.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio data-testid={option.testId} />}
                  label={option.label}
                  sx={{ height: 28 }}
                />
              ))}
            </Stack>
            {meta.touched && meta.error && (
              <FormHelperText error data-testid="salutationField-error">
                {meta.error}
              </FormHelperText>
            )}
          </Box>
        </RadioGroup>
      </Stack>
    </FormControl>
  )
}
