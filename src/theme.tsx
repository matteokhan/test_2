'use client'

import React from 'react'
import { Roboto } from 'next/font/google'
import { LinkProps as RouterLinkProps } from 'next/link'
import Link from 'next/link'
import { createTheme, PaletteColorOptions } from '@mui/material/styles'
import { LinkProps } from '@mui/material/Link'

/* eslint-disable @typescript-eslint/no-unused-vars */
declare module '@mui/material/styles' {
  interface Palette {
    blueLabel: PaletteColorOptions
    blueNotif: PaletteColorOptions
    leclercRed: PaletteColorOptions
  }
  interface PaletteOptions {
    blueLabel: PaletteColorOptions
    blueNotif: PaletteColorOptions
    leclercRed: PaletteColorOptions
  }
}
declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    blueLabel: true
    blueNotif: true
    leclercRed: true
  }
}
/* eslint-enable @typescript-eslint/no-unused-vars */

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin-ext'],
  display: 'swap',
})

const LinkBehavior = React.forwardRef<HTMLAnchorElement, RouterLinkProps>((props, ref) => {
  return <Link ref={ref} {...props} />
})

const { palette } = createTheme()
const theme = createTheme({
  palette: {
    blueLabel: palette.augmentColor({
      color: {
        main: '#60A0D9',
      },
    }),
    blueNotif: palette.augmentColor({
      color: {
        main: '#E4EFF9',
      },
    }),
    leclercRed: palette.augmentColor({
      color: {
        main: '#BE003C',
      },
    }),
    primary: {
      main: '#0066CC',
      light: '#00A5E1',
      dark: '#075099',
      contrastText: '#FFFFFF',
    },
    common: {
      black: '#010101',
      white: '#FAFAFA',
    },
    grey: {
      50: '#FAFAFA',
      100: '#F2F2F2',
      200: '#E6E6E6',
      300: '#D9D9D9',
      400: '#CCCCCC',
      500: '#B3B3B3',
      600: '#999999',
      700: '#808080',
      800: '#666666',
      900: '#333333',
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: '100px',
          textTransform: 'none',
          height: theme.spacing(5),
          textWrap: 'nowrap',
        }),
        outlined: {
          borderColor: palette.grey[400],
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
})

export default theme
