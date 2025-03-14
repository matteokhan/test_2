'use client'

import React from 'react'
import { Roboto } from 'next/font/google'
import { LinkProps as RouterLinkProps } from 'next/link'
import Link from 'next/link'
import { createTheme, responsiveFontSizes, SimplePaletteColorOptions } from '@mui/material/styles'
import { LinkProps } from '@mui/material/Link'
import { frFR } from '@mui/x-date-pickers/locales'

/* eslint-disable @typescript-eslint/no-unused-vars */
type LeclercPalette = {
  red: SimplePaletteColorOptions
  blueLabel: SimplePaletteColorOptions
  blueNotif: SimplePaletteColorOptions
  redNotif: SimplePaletteColorOptions
}
declare module '@mui/material/styles' {
  interface Palette {
    leclerc: LeclercPalette
  }
  interface PaletteOptions {
    leclerc: LeclercPalette
  }
}
declare module '@mui/material/IconButton' {
  interface IconButtonPropsColorOverrides {
    leclerc: true
  }
}
declare module '@mui/material/styles' {
  interface TypographyVariants {
    headlineMd: React.CSSProperties
    headlineSm: React.CSSProperties
    headlineXs: React.CSSProperties
    titleLg: React.CSSProperties
    titleMd: React.CSSProperties
    titleSm: React.CSSProperties
    bodyLg: React.CSSProperties
    bodyMd: React.CSSProperties
    bodySm: React.CSSProperties
    labelLg: React.CSSProperties
    labelMd: React.CSSProperties
    labelSm: React.CSSProperties
  }

  interface TypographyVariantsOptions {
    headlineMd?: React.CSSProperties
    headlineSm?: React.CSSProperties
    headlineXs?: React.CSSProperties
    titleLg?: React.CSSProperties
    titleMd?: React.CSSProperties
    titleSm?: React.CSSProperties
    bodyLg?: React.CSSProperties
    bodyMd?: React.CSSProperties
    bodySm?: React.CSSProperties
    labelLg?: React.CSSProperties
    labelMd?: React.CSSProperties
    labelSm?: React.CSSProperties
  }
}
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    headlineMd: true
    headlineSm: true
    headlineXs: true
    titleLg: true
    titleMd: true
    titleSm: true
    bodyLg: true
    bodyMd: true
    bodySm: true
    labelLg: true
    labelMd: true
    labelSm: true
  }
}
declare module '@mui/material/styles' {
  interface ZIndex {
    searchBar: number
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
let theme = createTheme(
  {
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 900,
        lg: 1280, // Changed from 1200
        xl: 1536,
      },
    },
    zIndex: {
      searchBar: 500,
    },
    palette: {
      leclerc: {
        red: palette.augmentColor({
          color: {
            main: '#BE003C',
            light: '#BD4B6F',
          },
        }),
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
        redNotif: palette.augmentColor({
          color: {
            main: '#F8E5EB',
          },
        }),
      },
      primary: {
        main: '#0066CC',
        light: '#00A5E1',
        dark: '#075099',
        contrastText: '#FFFFFF',
      },
      common: {
        black: 'black',
        white: 'white',
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
          root: {
            borderRadius: '100px',
            textTransform: 'none',
            textWrap: 'nowrap',
          },
          outlined: {
            borderColor: palette.grey[400],
          },
          sizeMedium: ({ theme }) => ({
            height: theme.spacing(5),
          }),
          sizeLarge: ({ theme }) => ({
            height: theme.spacing(7),
            padding: theme.spacing(2, 6),
          }),
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
      MuiTypography: {
        defaultProps: {
          variantMapping: {
            headlineMd: 'h2',
            headlineSm: 'h2',
            headlineXs: 'h3',
            titleLg: 'h2',
            titleMd: 'h3',
            titleSm: 'h4',
            bodyLg: 'p',
            bodyMd: 'p',
            bodySm: 'p',
            labelLg: 'label',
            labelMd: 'label',
            labelSm: 'label',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: '6px',
          },
        },
        defaultProps: {
          elevation: 0,
        },
      },
      MuiFormGroup: {
        styleOverrides: {
          root: {
            gap: '6px',
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: palette.grey[500],
            padding: theme.spacing(0.5),
          }),
        },
      },
      MuiCheckbox: {
        styleOverrides: {
          root: ({ theme }) => ({
            color: palette.grey[500],
            padding: theme.spacing(0.5),
          }),
        },
      },
      MuiSlider: {
        styleOverrides: {
          root: {
            height: '3px',
          },
          rail: {
            color: palette.grey[400],
          },
          thumb: {
            height: '20px',
            width: '20px',
          },
        },
      },
    },
  },
  frFR,
)

theme = createTheme(theme, {
  typography: {
    headlineMd: {
      fontFamily: roboto.style.fontFamily,
      fontSize: theme.typography.pxToRem(28),
      fontWeight: 500,
      lineHeight: 1.2,
    },
    headlineSm: {
      fontFamily: roboto.style.fontFamily,
      fontSize: theme.typography.pxToRem(24),
      fontWeight: 500,
      lineHeight: 1.5,
    },
    headlineXs: {
      fontFamily: roboto.style.fontFamily,
      fontSize: theme.typography.pxToRem(20),
      fontWeight: 500,
      lineHeight: 1.2,
    },
    titleLg: {
      fontFamily: roboto.style.fontFamily,
      fontSize: theme.typography.pxToRem(22),
      fontWeight: 500,
      lineHeight: 1.2,
    },
    titleMd: {
      fontFamily: roboto.style.fontFamily,
      fontSize: theme.typography.pxToRem(16),
      fontWeight: 500,
      lineHeight: 1.3,
      letterSpacing: '0.15px',
    },
    titleSm: {
      fontFamily: roboto.style.fontFamily,
      fontSize: theme.typography.pxToRem(14),
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.1px',
    },
    bodyLg: {
      fontFamily: roboto.style.fontFamily,
      fontSize: theme.typography.pxToRem(16),
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: '0.5px',
    },
    bodyMd: {
      fontFamily: roboto.style.fontFamily,
      fontSize: theme.typography.pxToRem(14),
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: '0.25px',
    },
    bodySm: {
      fontFamily: roboto.style.fontFamily,
      fontSize: theme.typography.pxToRem(12),
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: '0.4px',
    },
    labelLg: {
      fontFamily: roboto.style.fontFamily,
      fontSize: theme.typography.pxToRem(14),
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.1px',
    },
    labelMd: {
      fontFamily: roboto.style.fontFamily,
      fontSize: theme.typography.pxToRem(12),
      fontWeight: 500,
      lineHeight: 1.2,
      letterSpacing: '0.5px',
    },
    labelSm: {
      fontFamily: roboto.style.fontFamily,
      fontSize: theme.typography.pxToRem(11),
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0.5px',
    },
  },
})

theme = createTheme(theme, {
  components: {
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          textWrap: 'nowrap',
          color: theme.palette.grey[700],
          fontWeight: 500,
          fontSize: theme.typography.titleSm.fontSize,
          lineHeight: theme.typography.titleSm.lineHeight,
          padding: 0,
          minWidth: 'min-content',
          '&.Mui-selected': {
            color: theme.palette.primary.main,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          width: 'fit-content',
          height: theme.spacing(5),
          minHeight: theme.spacing(5),
        },
        indicator: {
          height: 3,
          backgroundColor: theme.palette.primary.main,
        },
        flexContainer: {
          gap: theme.spacing(4),
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          fontSize: '12px',
          [theme.breakpoints.up('lg')]: {
            fontSize: '14px',
          },
          variants: [
            {
              props: { severity: 'info' },
              style: {
                backgroundColor: theme.palette.leclerc.blueNotif.main,
                color: theme.palette.primary.main,
              },
            },
            {
              props: { severity: 'error' },
              style: {
                backgroundColor: theme.palette.leclerc.redNotif.main,
                color: theme.palette.leclerc.red.main,
              },
            },
          ],
        },
        icon: {
          alignItems: 'center',
        },
      },
    },
  },
})

theme = responsiveFontSizes(theme, {
  variants: [
    'headlineMd',
    'headlineSm',
    'headlineXs',
    'titleLg',
    'titleMd',
    'titleSm',
    'bodyLg',
    'bodyMd',
    'bodySm',
    'labelLg',
    'labelMd',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'subtitle1',
    'subtitle2',
    'body1',
    'body2',
    'caption',
    'overline',
  ],
})

export default theme
