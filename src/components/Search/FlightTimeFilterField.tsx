'use client'

import { FlightTimeFilterOption } from '@/types'
import { Stack, Typography } from '@mui/material'
import { useField, FieldHookConfig } from 'formik'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import NightlightRoundIcon from '@mui/icons-material/NightlightRound'
import WbTwilightIcon from '@mui/icons-material/WbTwilight'
import { ReactElement } from 'react'
import { styled } from '@mui/material/styles'

const FlightTimeOptionItem = styled(Stack)<{
  selected?: boolean
  disabled?: boolean
}>(({ theme, selected, disabled }) => ({
  borderRadius: '4px',
  gap: theme.spacing(1),
  alignItems: 'center',
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  width: '78px',
  borderColor: selected ? theme.palette.primary.main : 'transparent',
  backgroundColor: selected ? theme.palette.leclerc.blueNotif.main : theme.palette.grey[100],
  borderWidth: '2px',
  borderStyle: 'solid',
  boxSizing: 'border-box',
  '&:hover': {
    cursor: 'pointer',
    backgroundColor: disabled ? theme.palette.grey[100] : theme.palette.leclerc.blueNotif.main,
  },
  '& label:hover': {
    cursor: 'pointer',
  },
}))

const options = ({
  disabled,
}: {
  disabled?: boolean
}): {
  value: FlightTimeFilterOption
  label: string
  icon: ReactElement
  testId: string
}[] => [
  {
    value: '0-6',
    label: '0h - 6h',
    icon: <WbSunnyIcon data-testid={null} color={disabled ? 'disabled' : 'inherit'} />,
    testId: 'flightTime-0-6',
  },
  {
    value: '6-12',
    label: '6h - 12h',
    icon: <WbSunnyIcon data-testid={null} color={disabled ? 'disabled' : 'inherit'} />,
    testId: 'flightTime-6-12',
  },
  {
    value: '12-18',
    label: '12h - 18h',
    icon: <WbTwilightIcon data-testid={null} color={disabled ? 'disabled' : 'inherit'} />,
    testId: 'flightTime-12-18',
  },
  {
    value: '18-24',
    label: '18h - 24h',
    icon: <NightlightRoundIcon data-testid={null} color={disabled ? 'disabled' : 'inherit'} />,
    testId: 'flightTime-18-24',
  },
]

export const FlightTimeFilterField = ({ ...props }: FieldHookConfig<FlightTimeFilterOption>) => {
  const [field, { value }, { setValue }] = useField(props)

  const handleChange = (value: FlightTimeFilterOption) => {
    if (value === field.value) {
      setValue(null)
      return
    }
    setValue(value)
  }

  return (
    <Stack direction="row" gap={0.5} mt={0.5} data-testid="flightTimeField">
      {options({ disabled: props.disabled }).map((option) => (
        <FlightTimeOptionItem
          disabled={props.disabled}
          selected={option.value === value}
          onClick={() => {
            if (props.disabled === false) handleChange(option.value)
          }}
          key={option.value}
          data-testid={option.testId}>
          {option.icon}
          <Typography variant="labelMd" noWrap>
            {option.label}
          </Typography>
        </FlightTimeOptionItem>
      ))}
    </Stack>
  )
}
