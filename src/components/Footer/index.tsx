'use client'

import { SectionContainer } from '@/components'
import './Footer.css'
import Box from '@mui/material/Box'
import { Stack } from '@mui/material'
import { useState } from 'react'
import * as Yup from 'yup'

const emailSchema = Yup.string().email('E-mail invalide').required("L'e-mail est requis")

export const Footer = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    try {
      await emailSchema.validate(email)
      setError('')
      setEmail('')
      const url = `https://www.leclercvoyages.com/account/signup/newsletter?email=${encodeURIComponent(email)}`
      window.open(url, '_blank')
    } catch (error: unknown) {
      if (error instanceof Yup.ValidationError) {
        setError(error.message)
      } else {
        setError('An unexpected error occurred.')
      }
    }
  }

  return (
    <SectionContainer>
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <footer className="footer">
          <section className="footer-links" style={{ backgroundColor: '#e6e6e6' }}>
            <form className="subscribe" onSubmit={handleSubmit}>
              <div className="inner-footer-links">
                <div className="footer-links-list">
                  <div className="links-item">
                    <h2 className="primary">&Agrave; Propos</h2>
                    <ul className="reset-list unlink-group" style={{ marginBottom: '10px' }}>
                      <li className="item">
                        <a
                          target="_blank"
                          rel="noopener"
                          href="https://www.recrutement.leclerc/les-metiers/agent-de-voyage/">
                          Recrutement
                        </a>
                      </li>
                    </ul>
                    <div>
                      <h2 className="primary">Suivez-nous sur</h2>
                      <div>
                        <a href="https://www.facebook.com/e.leclercvoyages">
                          <img
                            style={{ width: '30px', height: '30px' }}
                            alt="Facebook"
                            src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/styles/social-icons/facebook.svg"
                          />
                        </a>
                        <a
                          style={{ marginLeft: '5px' }}
                          href="https://www.instagram.com/voyagesleclerc/">
                          <img
                            style={{ width: '30px', height: '30px' }}
                            alt="Facebook"
                            src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/styles/social-icons/instagram.svg "
                          />
                        </a>
                        <a
                          style={{ marginLeft: '5px' }}
                          href="https://www.tiktok.com/@voyagesleclerc">
                          <img
                            style={{ width: '30px', height: '30px' }}
                            alt="Tik Tok"
                            src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/styles/social-icons/tiktok.svg"
                          />
                        </a>
                        <a
                          style={{ marginLeft: '5px' }}
                          href="https://www.linkedin.com/company/leclerc-voyages/">
                          <img
                            style={{ width: '30px', height: '30px' }}
                            alt="LinkedIn"
                            src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/styles/social-icons/linkedin.svg"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="links-item">
                    <h2 className="primary">Informations l&eacute;gales</h2>
                    <ul className="reset-list unlink-group">
                      <li className="item">
                        <a
                          target="_blank"
                          rel="noopener"
                          href="https://www.leclercvoyages.com/editoPage?code=conditions_generales_de_vente">
                          Formulaire d'information standard
                        </a>
                      </li>
                      <li className="item">
                        <a
                          target="_blank"
                          rel="noopener"
                          href="https://www.leclercvoyages.com/editoContent?code=conditions_particulieres_elv">
                          Conditions Particuli&egrave;res de Vente
                        </a>
                      </li>
                      <li className="item">
                        <a
                          target="_blank"
                          rel="noopener"
                          href="https://www.leclercvoyages.com/editoPage?code=MentionsLegales">
                          Mentions l&eacute;gales
                        </a>
                      </li>
                      <li className="item">
                        <a
                          target="_blank"
                          rel="noopener"
                          href="https://www.leclercvoyages.com/editoPage?code=conditions_utilisation">
                          Conditions g&eacute;n&eacute;rales d'utilisation du site internet
                        </a>
                      </li>
                      <li className="item">
                        <a
                          target="_blank"
                          rel="noopener"
                          href="https://www.leclercvoyages.com/editoPage?code=Charte_RGPD">
                          Charte de protection des donn&eacute;es personnelles
                        </a>
                      </li>
                      <li className="item">
                        <a href="https://www.leclercvoyages.com/editoPage?code=tourisme-responsable">
                          Charte &eacute;thique du voyageur
                        </a>
                      </li>
                      <li className="item">
                        <a
                          target="_blank"
                          rel="noopener"
                          href="https://www.leclercvoyages.com/editoPage?code=paiement">
                          Moyens de paiement
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="links-item">
                    <h2 className="primary">Le mouvement E.Leclerc</h2>
                    <ul className="reset-list unlink-group">
                      <li className="item">
                        <a target="_blank" rel="noopener" href="http://www.e-leclerc.com">
                          Portail E.Leclerc
                        </a>
                      </li>
                      <li className="item">
                        <a target="_blank" rel="noopener" href="http://www.alloleclerc.com">
                          Allo E.Leclerc
                        </a>
                      </li>
                      <li className="item">
                        <a
                          target="_blank"
                          rel="noopener"
                          href="https://www.leclercbilletterie.com/">
                          Billetterie et spectacles
                        </a>
                      </li>
                      <li className="item">
                        <a
                          target="_blank"
                          rel="noopener"
                          href="http://www.e-cartecadeauleclerc.fr/">
                          Carte cadeau E.Leclerc
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="footer-contact">
                  <div className="caption primary">
                    <img
                      alt=""
                      src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/footer/picto-mail-contact.png"
                    />
                    Inscription newsletter
                  </div>
                  <label className="label">
                    J'accepte de recevoir les offres commerciales et newsletters de Voyages
                    E.Leclerc
                  </label>
                  <div style={{ marginTop: '10px', marginBottom: '4px', display: 'flex' }}>
                    <input
                      className="input-newsletter"
                      type="text"
                      name="email"
                      placeholder="Votre email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        setError('')
                      }}
                    />
                    <button className="reset-button button--primary espacePriv" type="submit">
                      OK
                    </button>
                  </div>
                  {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
                  <div className="phone-legal-image">
                    <img
                      alt=""
                      src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/footer/contact.png"
                    />
                  </div>
                </div>
              </div>
              <p>
                <br />
                <br />
              </p>
              <div className="inner-footer-links">
                <p>
                  Les cat&eacute;gories de clubs et h&ocirc;tels sont indiqu&eacute;es en normes
                  locales. Les tarifs de nos voyages incluent les taxes a&eacute;roports
                  obligatoires et surcharges carburants connues &agrave; ce jour. Les tarifs sont
                  sous r&eacute;serve de disponibilit&eacute;s et s'entendent "&agrave; partir de".
                  Ces tarifs n'incluent ni les taxes locales ou administratives &eacute;ventuelles
                  (taxes de s&eacute;jours, taxes d&rsquo;entr&eacute;e ou de sortie de certains
                  pays, frais de visa&hellip;), ni les suppl&eacute;ments sp&eacute;cifiques
                  susceptibles de s'appliquer &agrave; certaines destinations, ni les variations
                  &eacute;ventuelles de prix ult&eacute;rieures &agrave; l'achat relatifs aux
                  hausses carburant ou variation de taxes. Les tarifs affich&eacute;s tiennent
                  d&eacute;j&agrave; compte des remises et promotions &eacute;ventuelles. Les
                  promotions sont non cumulables et non r&eacute;troactives.<span></span>
                </p>
              </div>
            </form>
          </section>
        </footer>
      </Box>

      <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
        <Stack py="20px" gap={1}>
          <img
            alt=""
            src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/footer/contact.png"
            style={{ width: '90%', margin: 'auto' }}
          />
          <form onSubmit={handleSubmit}>
            <Stack bgcolor="primary" gap={1} py={2}>
              <Stack direction="row" alignItems="center" gap={1}>
                <img
                  alt=""
                  src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/footer/picto-mail-contact.png"
                />
                <label style={{ fontSize: '20px' }} className="primary">
                  Inscription newsletter
                </label>
              </Stack>
              <p style={{ fontSize: '12px', color: 'grey.900' }}>
                J'accepte de recevoir les offres commerciales et newsletters de Voyages E.Leclerc
              </p>
              <Stack>
                <Stack direction="row">
                  <input
                    className="input-newsletter"
                    type="email"
                    name="email"
                    placeholder="Votre email"
                    style={{ width: '100%' }}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError('')
                    }}
                  />
                  <button className="reset-button button--primary espacePriv" type="submit">
                    OK
                  </button>
                </Stack>
                {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
              </Stack>
            </Stack>
          </form>
          <Box fontSize="12px" color="grey.600" textAlign="center">
            <a
              target="_blank"
              rel="noopener"
              href="https://www.recrutement.leclerc/les-metiers/agent-de-voyage/">
              Recrutement
            </a>{' '}
            |{' '}
            <a
              target="_blank"
              rel="noopener"
              href="https://www.leclercvoyages.com/editoPage?code=conditions_generales_de_vente">
              Formulaire d'information standard
            </a>{' '}
            |{' '}
            <a
              target="_blank"
              rel="noopener"
              href="https://www.leclercvoyages.com/editoContent?code=conditions_particulieres_elv">
              Conditions Particuli&egrave;res de Vente
            </a>{' '}
            |{' '}
            <a
              target="_blank"
              rel="noopener"
              href="https://www.leclercvoyages.com/editoPage?code=MentionsLegales">
              Mentions l&eacute;gales
            </a>{' '}
            |{' '}
            <a
              target="_blank"
              rel="noopener"
              href="https://www.leclercvoyages.com/editoPage?code=conditions_utilisation">
              Conditions g&eacute;n&eacute;rales d'utilisation du site internet
            </a>{' '}
            |{' '}
            <a
              target="_blank"
              rel="noopener"
              href="https://www.leclercvoyages.com/editoPage?code=Charte_RGPD">
              Charte de protection des donn&eacute;es personnelles
            </a>{' '}
            |{' '}
            <a href="https://www.leclercvoyages.com/editoPage?code=tourisme-responsable">
              Charte &eacute;thique du voyageur
            </a>{' '}
            |{' '}
            <a
              target="_blank"
              rel="noopener"
              href="https://www.leclercvoyages.com/editoPage?code=paiement">
              Moyens de paiement
            </a>{' '}
            |{' '}
            <a target="_blank" rel="noopener" href="http://www.e-leclerc.com">
              Portail E.Leclerc
            </a>{' '}
            |{' '}
            <a target="_blank" rel="noopener" href="http://www.alloleclerc.com">
              Allo E.Leclerc
            </a>{' '}
            |{' '}
            <a target="_blank" rel="noopener" href="https://www.leclercbilletterie.com/">
              Billetterie et spectacles
            </a>{' '}
            |{' '}
            <a target="_blank" rel="noopener" href="http://www.e-cartecadeauleclerc.fr/">
              Carte cadeau E.Leclerc
            </a>
          </Box>

          <p style={{ textAlign: 'center', fontSize: '12px', color: 'grey.600' }}>
            Les cat&eacute;gories de clubs et h&ocirc;tels sont indiqu&eacute;es en normes locales.
            Les tarifs de nos voyages incluent les taxes a&eacute;roports obligatoires et surcharges
            carburants connues &agrave; ce jour. Les tarifs sont sous r&eacute;serve de
            disponibilit&eacute;s et s'entendent "&agrave; partir de". Ces tarifs n'incluent ni les
            taxes locales ou administratives &eacute;ventuelles (taxes de s&eacute;jours, taxes
            d&rsquo;entr&eacute;e ou de sortie de certains pays, frais de visa&hellip;), ni les
            suppl&eacute;ments sp&eacute;cifiques susceptibles de s'appliquer &agrave; certaines
            destinations, ni les variations &eacute;ventuelles de prix ult&eacute;rieures &agrave;
            l'achat relatifs aux hausses carburant ou variation de taxes. Les tarifs affich&eacute;s
            tiennent d&eacute;j&agrave; compte des remises et promotions &eacute;ventuelles. Les
            promotions sont non cumulables et non r&eacute;troactives.<span></span>
          </p>

          <Stack alignItems="center" gap={2}>
            <h4 className="primary">Suivez-nous sur</h4>
            <Stack direction="row" gap={1}>
              <a href="https://www.facebook.com/e.leclercvoyages">
                <img
                  style={{ width: '48px', height: '48px' }}
                  alt="Facebook"
                  src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/styles/social-icons/facebook.svg"
                />
              </a>
              <a style={{ marginLeft: '5px' }} href="https://www.instagram.com/voyagesleclerc/">
                <img
                  style={{ width: '48px', height: '48px' }}
                  alt="Facebook"
                  src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/styles/social-icons/instagram.svg "
                />
              </a>
              <a style={{ marginLeft: '5px' }} href="https://www.tiktok.com/@voyagesleclerc">
                <img
                  style={{ width: '48px', height: '48px' }}
                  alt="Tik Tok"
                  src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/styles/social-icons/tiktok.svg"
                />
              </a>
              <a
                style={{ marginLeft: '5px' }}
                href="https://www.linkedin.com/company/leclerc-voyages/">
                <img
                  style={{ width: '48px', height: '48px' }}
                  alt="LinkedIn"
                  src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/styles/social-icons/linkedin.svg"
                />
              </a>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </SectionContainer>
  )
}
