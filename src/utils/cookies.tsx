import Cookies from 'js-cookie'

export const setCookiesAgency = (agency: any) => {
  Cookies.set('leclercagencycode', agency.code, { expires: 360, path: '/' })
  Cookies.set('leclercagencyname', agency.name, { expires: 360, path: '/' })
}

export const getCookiesAgencyCode = () => {
  return Cookies.get('leclercagencycode')
}

export const getAgencyCodeForRequest = () => {
  return getCookiesAgencyCode() || '200'
}

export const getCookiesAgencyName = () => {
  return Cookies.get('leclercagencyname')
}
