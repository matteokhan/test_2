import React from 'react'
import './OldNavbar.css'
import { SectionContainer } from '@/components'
import { Box } from '@mui/material'

export const OldNavbar = () => {
  const [isFlashSalesHovered, setIsFlashSalesHovered] = React.useState(false)
  const [isLastMinuteHovered, setIsLastMinuteHovered] = React.useState(false)
  const [isPromosHovered, setIsPromosHovered] = React.useState(false)
  const [isHolidaysHovered, setIsHolidaysHovered] = React.useState(false)
  const [isSkisHovered, setIsSkisHovered] = React.useState(false)
  const [isFranceLinkHovered, setIsFranceLinkHovered] = React.useState(false)
  const [isClubLinkHovered, setIsClubLinkHovered] = React.useState(false)
  const [isWeekendLinkHovered, setIsWeekendLinkHovered] = React.useState(false)
  const [isDisneylandLinkHovered, setIsDisneylandLinkHovered] = React.useState(false)
  const [isLocationsLinkHovered, setIsLocationsLinkHovered] = React.useState(false)
  const [isCircuitsLinkHovered, setIsCircuitsLinkHovered] = React.useState(false)
  const [isInspirationLinkHovered, setIsInspirationLinkHovered] = React.useState(false)
  const [isDestinationsHovered, setIsDestinationsHovered] = React.useState(false)
  const [isFranceHovered, setIsFranceHovered] = React.useState(false)
  const [isEuropeHovered, setIsEuropeHovered] = React.useState(false)
  const [isMiddleEastHovered, setIsMiddleEastHovered] = React.useState(false)
  const [isAntillesHovered, setIsAntillesHovered] = React.useState(false)
  const [isAmericasHovered, setIsAmericasHovered] = React.useState(false)
  const [isAsiaHovered, setIsAsiaHovered] = React.useState(false)
  const [isAfricaHovered, setIsAfricaHovered] = React.useState(false)
  const [isPacificHovered, setIsPacificHovered] = React.useState(false)
  return (
    <Box
      sx={{
        borderTop: 1,
        borderColor: 'grey.200',
        boxSizing: 'border-box',
        bgcolor: 'common.white',
      }}>
      <SectionContainer sx={{ height: 60, justifyContent: 'space-between' }}>
        <nav className="nav-redoutable clearfix hovered" style={{ width: '100%', margin: 0 }}>
          <ul className="inner-nav-redoutable reset-list">
            <li
              id="navItem_35682"
              className={`nav-item-redoutable single multiline ${isFlashSalesHovered ? 'hovered' : ''}`}
              style={{
                borderLeft: '1px solid rgb(230, 230, 230)',
                borderBottomColor: '#BE003C',
                fontWeight: 500,
                color: isFlashSalesHovered ? '#FFFFFF' : '#BE003C',
              }}
              onMouseEnter={() => setIsFlashSalesHovered(true)}
              onMouseLeave={() => setIsFlashSalesHovered(false)}>
              <div
                className="tab"
                style={{
                  borderBottom: '3px solid #BE003C',
                }}>
                <a href="https://www.leclercvoyages.com/ventes-flash/Offres-Speciales">
                  <strong>
                    Ventes
                    <br />
                    Flash
                  </strong>
                </a>
              </div>
            </li>
            <li
              id="navItem_35694"
              className={`nav-item-redoutable single multiline ${isLastMinuteHovered ? 'hovered' : ''}`}
              style={{
                borderBottomColor: '#BE003C',
                fontWeight: 500,
                color: isLastMinuteHovered ? '#FFFFFF' : '#BE003C',
              }}
              onMouseEnter={() => setIsLastMinuteHovered(true)}
              onMouseLeave={() => setIsLastMinuteHovered(false)}>
              <div
                className="tab"
                style={{
                  borderBottom: '3px solid #BE003C',
                }}>
                <a href="https://www.leclercvoyages.com/Derniere_Minute">
                  <strong>
                    Dernière
                    <br />
                    Minute
                  </strong>
                </a>
              </div>
            </li>
            <li
              id="navItem_35693"
              className={`nav-item-redoutable single ${isPromosHovered ? 'hovered' : ''}`}
              style={{
                borderBottomColor: '#BE003C',
                fontWeight: 500,
                color: isPromosHovered ? '#FFFFFF' : '#BE003C',
              }}
              onMouseEnter={() => setIsPromosHovered(true)}
              onMouseLeave={() => setIsPromosHovered(false)}>
              <div
                className="tab"
                style={{
                  borderBottom: '3px solid #BE003C',
                }}>
                <a href="https://www.leclercvoyages.com/promo">
                  <strong>Promos</strong>
                </a>
              </div>
            </li>
            <li
              id="navItem_35692"
              className={`nav-item-redoutable single multiline ${isHolidaysHovered ? 'hovered' : ''}`}
              style={{
                borderBottomColor: '#BE003C',
                fontWeight: 500,
                color: isHolidaysHovered ? '#FFFFFF' : '#BE003C',
              }}
              onMouseEnter={() => setIsHolidaysHovered(true)}
              onMouseLeave={() => setIsHolidaysHovered(false)}>
              <div
                className="tab"
                style={{
                  borderBottom: '3px solid #BE003C',
                }}>
                <span>
                  <strong style={{ position: 'relative' }}>
                    <strong>
                      Vacances
                      <br />
                      Scolaires
                    </strong>
                  </strong>
                </span>
              </div>

              <div className="sub-panel" style={{ backgroundColor: '#FFF', top: '57px' }}>
                <div id="Menu_Vacances_Hiver">
                  <div
                    className="col-x-6 left clearfix border-right"
                    style={{ lineHeight: 'normal', textDecoration: 'underline' }}>
                    <a
                      href="https://www.leclercvoyages.com/vacances_fevrier?cat=menu_vacances_scolaires&amp;lab=menu_vacances_fevrier"
                      title="Vacances scolaires de Février">
                      <img
                        src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/Menu/Image-vacances-fevrier_165x190.jpg"
                        alt="Vacances scolaires d'hiver de Février"
                        title="Vacances scolaires d'hiver de Février"
                        width="165"
                        height="190"
                      />
                    </a>
                  </div>
                </div>
                <div id="Menu_Vacances_Paques">
                  <div
                    className="col-x-6 left clearfix border-right"
                    style={{ lineHeight: 'normal', textDecoration: 'underline' }}>
                    <a
                      href="https://www.leclercvoyages.com/vacances_Paques?cat=menu_vacances_scolaires&amp;lab=menu_vacances_paques"
                      title="Vacances scolaires de Paques">
                      <img
                        src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/Menu/Image-vacances-paques_165x190.jpg"
                        alt="Vacances scolaires de Paques"
                        title="Vacances scolaires de Paques"
                        width="165"
                        height="190"
                      />
                    </a>
                  </div>
                </div>
                <div id="Menu_Vacances_Ponts">
                  <div
                    className="col-x-6 left clearfix border-right"
                    style={{ lineHeight: 'normal', textDecoration: 'underline' }}>
                    <a
                      href="https://www.leclercvoyages.com/Weekend_Mai?cat=menu_vacances_scolaires&amp;lab=menu_vacances_pont_mai"
                      title="Ponts de Mai">
                      <img
                        src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/Menu/Image-vacances-ponts_165x190.jpg"
                        alt="Ponts de Mai"
                        title="Ponts de Mai"
                        width="165"
                        height="190"
                      />
                    </a>
                  </div>
                </div>
                <div id="Menu_Vacances_Ete">
                  <div
                    className="col-x-6 left clearfix border-right"
                    style={{ lineHeight: 'normal', textDecoration: 'underline' }}>
                    <a href="https://www.leclercvoyages.com/vacances_ete?cat=menu_vacances_scolaires&amp;lab=menu_vacances_ete">
                      <img
                        src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/Menu/Image-vacances-ete_165x190.jpg"
                        alt="Vacances scolaires d'été"
                        title="Vacances Scolaires d'été"
                        width="165"
                        height="190"
                      />
                    </a>
                  </div>
                </div>
                <div id="Menu_Vacances_Toussaint">
                  <div
                    className="col-x-6 left clearfix border-right"
                    style={{ lineHeight: 'normal', textDecoration: 'underline' }}>
                    <a
                      href="https://www.leclercvoyages.com/vacances_Toussaint?cat=menu_vacances_scolaires&amp;lab=menu_vacances_toussaint"
                      title="Vacances scolaires de Toussaint">
                      <img
                        src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/Menu/Image-vacances-toussaint_165x190.jpg"
                        alt="Vacances scolaires de Toussaint"
                        title="Vacances scolaires de Toussaint"
                        width="165"
                        height="190"
                      />
                    </a>
                  </div>
                </div>
                <div id="Menu_Vacances_Noel">
                  <div
                    className="col-x-6 left clearfix border-right"
                    style={{ lineHeight: 'normal', textDecoration: 'underline' }}>
                    <a
                      href="https://www.leclercvoyages.com/vacances_noel?cat=menu_vacances_scolaires&amp;lab=menu_vacances_noel"
                      title="Vacances scolaires de Noel">
                      <img
                        src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/Menu/Image-vacances-noel_165x190.jpg"
                        alt="Vacances scolaires de Noel"
                        title="Vacances scolaires de Noel"
                        width="165"
                        height="190"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </li>
            <li
              id="navItem_35691"
              className={`nav-item-redoutable single ${isSkisHovered ? 'hovered' : ''}`}
              style={{ borderBottomColor: '#00A5E1' }}
              onMouseEnter={() => setIsSkisHovered(true)}
              onMouseLeave={() => setIsSkisHovered(false)}>
              <div
                className="tab"
                style={{
                  borderBottom: '3px solid #00A5E1',
                }}>
                <a href="https://www.leclercvoyages.com/vacances_ski_neige">&nbsp;Ski&nbsp;</a>
              </div>
            </li>
            <li
              id="navItem_35688"
              className={`nav-item-redoutable single ${isFranceLinkHovered ? 'hovered' : ''}`}
              style={{ borderBottomColor: '#00A5E1' }}
              onMouseEnter={() => setIsFranceLinkHovered(true)}
              onMouseLeave={() => setIsFranceLinkHovered(false)}>
              <div
                className="tab"
                style={{
                  borderBottom: '3px solid #00A5E1',
                }}>
                <a href="https://www.leclercvoyages.com/france">France</a>
              </div>
            </li>
            <li
              id="navItem_35690"
              className={`nav-item-redoutable single multiline ${isClubLinkHovered ? 'hovered' : ''}`}
              style={{ borderBottomColor: '#00A5E1' }}
              onMouseEnter={() => setIsClubLinkHovered(true)}
              onMouseLeave={() => setIsClubLinkHovered(false)}>
              <div
                className="tab"
                style={{
                  borderBottom: '3px solid #00A5E1',
                }}>
                <a href="https://www.leclercvoyages.com/sejour">
                  Séjours
                  <br />
                  Clubs & Hôtels
                </a>
              </div>
            </li>
            <li
              id="navItem_35689"
              className={`nav-item-redoutable single ${isWeekendLinkHovered ? 'hovered' : ''}`}
              style={{ borderBottomColor: '#00A5E1' }}
              onMouseEnter={() => setIsWeekendLinkHovered(true)}
              onMouseLeave={() => setIsWeekendLinkHovered(false)}>
              <div
                className="tab"
                style={{
                  borderBottom: '3px solid #00A5E1',
                }}>
                <a href="https://www.leclercvoyages.com/weekend">Week-end</a>
              </div>
            </li>
            <li
              id="navItem_60442"
              className={`nav-item-redoutable single multiline ${isDisneylandLinkHovered ? 'hovered' : ''}`}
              style={{ borderBottomColor: '#00A5E1' }}
              onMouseEnter={() => setIsDisneylandLinkHovered(true)}
              onMouseLeave={() => setIsDisneylandLinkHovered(false)}>
              <div
                className="tab"
                style={{
                  borderBottom: '3px solid #00A5E1',
                }}>
                <a href="https://www.leclercvoyages.com/parcs_attractions">
                  Disneyland
                  <br />& Parcs
                </a>
              </div>
            </li>
            <li
              id="navItem_35687"
              className={`nav-item-redoutable single multiline ${isLocationsLinkHovered ? 'hovered' : ''}`}
              style={{ borderBottomColor: '#00A5E1' }}
              onMouseEnter={() => setIsLocationsLinkHovered(true)}
              onMouseLeave={() => setIsLocationsLinkHovered(false)}>
              <div
                className="tab"
                style={{
                  borderBottom: '3px solid #00A5E1',
                }}>
                <a href="https://www.leclercvoyages.com/location">
                  Locations &<br />
                  Campings
                </a>
              </div>
            </li>
            <li
              id="navItem_35686"
              className={`nav-item-redoutable single multiline ${isCircuitsLinkHovered ? 'hovered' : ''}`}
              style={{ borderBottomColor: '#00A5E1' }}
              onMouseEnter={() => setIsCircuitsLinkHovered(true)}
              onMouseLeave={() => setIsCircuitsLinkHovered(false)}>
              <div
                className="tab"
                style={{
                  borderBottom: '3px solid #00A5E1',
                }}>
                <a href="https://www.leclercvoyages.com/circuit">
                  Circuits
                  <br />
                  Croisières
                </a>
              </div>
            </li>
            <li
              id="navItem_39682"
              className={`nav-item-redoutable single multiline ${isInspirationLinkHovered ? 'hovered' : ''}`}
              style={{ borderBottomColor: '#00A5E1' }}
              onMouseEnter={() => setIsInspirationLinkHovered(true)}
              onMouseLeave={() => setIsInspirationLinkHovered(false)}>
              <div
                className="tab"
                style={{
                  borderBottom: '3px solid #00A5E1',
                }}>
                <a href="https://www.leclercvoyages.com/inspiration-voyage">
                  Inspirez
                  <br />
                  Moi
                </a>
              </div>
            </li>
            <li
              id="navItem_35684"
              className={`nav-item-redoutable multiline ${isDestinationsHovered ? 'hovered' : ''}`}
              style={{ borderBottomColor: '#00A5E1' }}
              onMouseEnter={() => setIsDestinationsHovered(true)}
              onMouseLeave={() => setIsDestinationsHovered(false)}>
              <div
                className="tab"
                style={{
                  borderBottom: '3px solid #00A5E1',
                }}>
                <span>
                  Toutes nos
                  <br />
                  Destinations
                </span>
              </div>

              <div
                className="sub-nav-redoutable"
                style={{ backgroundColor: '#00A5E1', top: '57px' }}>
                <ul className="reset-list clearfix">
                  <li
                    className={`sub-tab-item ${isFranceHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => setIsFranceHovered(true)}
                    onMouseLeave={() => setIsFranceHovered(false)}>
                    <div className={`sub-tab ${isFranceHovered ? 'hovered' : ''}`}>
                      <span className="arrow-box" style={{ borderTopColor: '#00A5E1' }}>
                        {' '}
                      </span>{' '}
                      <span>France</span>
                    </div>

                    <div className="sub-panel clearfix" style={{ backgroundColor: '#FFF' }}>
                      <div id="Menu_Destinations_France_Mer">
                        <div
                          className="col-x-4 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Mer
                            <br />
                            <br />
                          </strong>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.NOD">
                            Normandie
                            <br />
                          </a>{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.BRE">
                            Bretagne
                            <br />
                          </a>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.ATLN">
                            Atlantique Nord
                            <br />
                          </a>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.ATLS">
                            Atlantique Sud
                            <br />
                          </a>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.MEDI">
                            Méditerranée Ouest
                            <br />
                          </a>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.CDA">
                            Côte d'Azur
                            <br />
                          </a>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.COR">Corse</a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_France_Montagne">
                        <div
                          className="col-x-4 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Montagne
                            <br />
                          </strong>
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.ALP">
                            Alpes
                          </a>{' '}
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.PYR">
                            Pyrénées
                          </a>{' '}
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.JURA">
                            Jura
                          </a>{' '}
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.VOSGES">
                            Vosges
                          </a>{' '}
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.AUV">
                            Massif Central
                          </a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_France_Campagne">
                        <div
                          className="col-x-4 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Arrière Pays
                            <br />
                          </strong>
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.NOD">
                            Nord et Picardie
                          </a>{' '}
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.CENT">
                            Poitou - Centre - Loire
                          </a>{' '}
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.SDOS">
                            Sud Ouest
                          </a>{' '}
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.PROV">
                            Sud Est et Provence
                          </a>{' '}
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.ASALOR">
                            Alsace et Lorraine
                          </a>{' '}
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.IDF">
                            Ile de France
                          </a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_France_Toutes">
                        <div className="col-x-4 left clearfix">
                          <a href="https://www.leclercvoyages.com/france">
                            {' '}
                            <img
                              src="https://wizard.leclercvoyages.com/admin/TS/fckUserFiles/Content_Image/Technique/Menu/Image-menu-Destination-France-245x160.jpg"
                              alt="toutes les vacances en France"
                              // valign="bottom"
                              style={{
                                position: 'relative',
                                bottom: '-10px',
                                right: '-30px',
                                float: 'right',
                              }}
                              title="toutes les vacances en France"
                              width="245"
                              height="160"
                            />{' '}
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li
                    className={`sub-tab-item ${isEuropeHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => setIsEuropeHovered(true)}
                    onMouseLeave={() => setIsEuropeHovered(false)}>
                    <div className={`sub-tab ${isEuropeHovered ? 'hovered' : ''}`}>
                      <span className="arrow-box" style={{ borderTopColor: '#00A5E1' }}>
                        {' '}
                      </span>{' '}
                      <span>Europe</span>
                    </div>

                    <div className="sub-panel clearfix" style={{ backgroundColor: '#FFF' }}>
                      <div id="Menu_destinations_Europe_Iles">
                        <div
                          className="col-x-4 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Iles en Europe
                            <br />
                            <br />
                          </strong>{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=E1">Baléares</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=E2">Canaries</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=CY">Chypre</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FR.COR">Corse</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=HER">Crète</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=GR2">
                            Iles Grecques
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=P1">Madère</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=SARD">
                            Sardaigne
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=SICL">Sicile</a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_Europe_Sud">
                        <div
                          className="col-x-4 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Europe du Sud
                            <br />
                            <br />
                          </strong>{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=AL">Albanie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=AD">Andorre</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=BA">
                            Bosnie-Herzégovine
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=HR">Croatie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=ES">Espagne</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=GR">Grèce</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=IT">Italie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=MK">Macédoine</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=MT">Malte</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=MC">Monaco</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=ME">
                            Monténégro
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=PT">Portugal</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=RS">Serbie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=CH">Suisse</a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_Europe_Nord">
                        <div
                          className="col-x-4 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Europe du Nord
                            <br />
                            <br />
                          </strong>{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=DE">Allemagne</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=BE">Belgique</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=DK">Danemark</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=EE">Estonie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=FI">Finlande</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=GB">
                            Grande-Bretagne
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=IE">Irlande</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=IS">Islande</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=LV">Lettonie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=LT">Lituanie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=NO">Norvège</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=NL">Pays-Bas</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=UK">
                            Royaume Uni
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=SE">Suède</a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_Europe_Est">
                        <div
                          style={{ lineHeight: 'normal' }}
                          className="col-x-4 left clearfix border-right">
                          <strong>
                            Europe de l'Est
                            <br />
                            <br />
                          </strong>{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=AT">Autriche</a>
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=BY">
                            Biélorussie
                          </a>
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=BG">Bulgarie</a>
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=GE">Géorgie</a>
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=PL">Pologne</a>
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=CZ">
                            République Tchèque
                          </a>
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=RO">Roumanie</a>
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=SK">Slovaquie</a>
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=SICL">
                            Slovénie
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li
                    className={`sub-tab-item ${isMiddleEastHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => setIsMiddleEastHovered(true)}
                    onMouseLeave={() => setIsMiddleEastHovered(false)}>
                    <div className={`sub-tab ${isMiddleEastHovered ? 'hovered' : ''}`}>
                      <span className="arrow-box" style={{ borderTopColor: '#00A5E1' }}>
                        {' '}
                      </span>{' '}
                      <span>Maghreb & Moyen Orient</span>
                    </div>

                    <div className="sub-panel clearfix" style={{ backgroundColor: '#FFF' }}>
                      <div id="Menu_Destinations_Orient_Mediterranee">
                        <div
                          className="col-x-3 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Maghreb et Pays Méditerranéens
                            <br />
                            <br />
                          </strong>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=DZ">Algérie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=EG">Egypte</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=MA">Maroc</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=TN">Tunisie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=TR">Turquie</a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_Orient_Arabe">
                        <div
                          className="col-x-3 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Péninsule Arabique
                            <br />
                            <br />
                          </strong>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=AE.AUH">
                            Abu Dhabi
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=AE.DXB">Dubai</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=AE">
                            Emirats Arabes Unis
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=OM">Oman</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=AE.RAS">
                            Ras Al Khaimah
                          </a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_Orient_Moyen">
                        <div
                          className="col-x-3 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Moyen Orient
                            <br />
                            <br />
                          </strong>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=AM">
                            Arm&eacute;nie
                          </a>
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=EG">Egypte</a>
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=JO">Jordanie</a>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li
                    className={`sub-tab-item ${isAntillesHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => setIsAntillesHovered(true)}
                    onMouseLeave={() => setIsAntillesHovered(false)}>
                    <div className={`sub-tab ${isAntillesHovered ? 'hovered' : ''}`}>
                      <span className="arrow-box" style={{ borderTopColor: '#00A5E1' }}>
                        {' '}
                      </span>{' '}
                      <span>Antilles</span>
                    </div>

                    <div className="sub-panel clearfix" style={{ backgroundColor: '#FFF' }}>
                      <div id="Menu_Destinations_Antilles_Grandes">
                        <div
                          className="col-x-3 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Grandes Antilles
                            <br />
                            <br />
                          </strong>{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=CU">Cuba</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=HT">Haïti</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=JM">Jamaïque</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=PR">
                            Porto Rico
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=DO">
                            République Dominicaine
                          </a>
                          <br /> <br />
                          <strong>
                            Atlantique
                            <br />
                            <br />
                          </strong>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=BS">Bahamas</a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_Antilles_Petites">
                        <div
                          className="col-x-3 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Petites Antilles - Mer des Caraïbes
                            <br />
                            <br />
                          </strong>{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=AG">
                            Antigua et Barbuda
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=BB">Barbades</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=BZ">Belize</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=CUR">Curaçao</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=GD">Grenade</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=KY">
                            Iles Caïmans
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=VG">
                            Iles Vierges Britanniques
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=KN">
                            Saint Christophe et Niévès
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=VC">
                            Saint Vincent et les Grenadines
                          </a>
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=TT">
                            Trinité et Tobago
                          </a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_Antilles_Francophones">
                        <div
                          className="col-x-3 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Iles Francophones
                            <br />
                            <br />
                          </strong>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=DM">Dominique</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=GP">
                            Guadeloupe
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=HT">Haïti</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=MQ">
                            Martinique
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=BL">
                            Saint Barthélémy
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=LC">
                            Sainte Lucie
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=MF">
                            Saint Martin
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li
                    className={`sub-tab-item ${isAmericasHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => setIsAmericasHovered(true)}
                    onMouseLeave={() => setIsAmericasHovered(false)}>
                    <div className={`sub-tab ${isAmericasHovered ? 'hovered' : ''}`}>
                      <span className="arrow-box" style={{ borderTopColor: '#00A5E1' }}>
                        {' '}
                      </span>{' '}
                      <span>Amériques</span>
                    </div>

                    <div className="sub-panel clearfix" style={{ backgroundColor: '#FFF' }}>
                      <div id="Menu_Destinations_Amerique_Nord">
                        <div
                          className="col-x-3 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Amérique du Nord
                            <br />
                            <br />
                          </strong>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=CA">Canada</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=US">
                            Etats-Unis
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=MX">Mexique</a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_Amerique_Centrale">
                        <div
                          className="col-x-3 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Amérique Centrale
                            <br />
                            <br />
                          </strong>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=BZ">Bélize</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=CR">
                            Costa Rica
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=GT">Guatemala</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=HN">Honduras</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=NI">Nicaragua</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=PA">Panama</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=SV">Salvador</a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_Amerique_Sud">
                        <div
                          className="col-x-3 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Amérique du Sud
                            <br />
                            <br />
                          </strong>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=AR">Argentine</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=BO">Bolivie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=BR">Brésil</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=CL">Chili</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=CO">Colombie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=EC">Equateur</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=PE">Pérou</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=UY">Uruguay</a>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li
                    className={`sub-tab-item ${isAsiaHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => setIsAsiaHovered(true)}
                    onMouseLeave={() => setIsAsiaHovered(false)}>
                    <div className={`sub-tab ${isAsiaHovered ? 'hovered' : ''}`}>
                      <span className="arrow-box" style={{ borderTopColor: '#00A5E1' }}>
                        {' '}
                      </span>{' '}
                      <span>Asie & Océan Indien</span>
                    </div>

                    <div className="sub-panel clearfix" style={{ backgroundColor: '#FFF' }}>
                      <div id="Menu_Destinations_Asie_Sud">
                        <div
                          className="col-x-4 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Asie du Sud et Océan Indien
                            <br />
                            <br />
                          </strong>{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=BT">Bhoutan</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=HK">Hong-Kong</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=IN">Inde</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=MV">Maldives</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=MU">Maurice</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=NP">Népal</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=RE">Réunion</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=SC">
                            Seychelles
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=LK">Sri Lanka</a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_Asie_Sud-Est">
                        <div
                          className="col-x-4 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Asie du Sud-Est
                            <br />
                            <br />
                          </strong>{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=M1">Birmanie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=KH">Cambodge</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=ID">Indonésie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=LA">Laos</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=MY">Malaisie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=MM">Myanmar</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=PH">
                            Philippines
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=SG">Singapour</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=TH">Thaïlande</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=VN">Vietnam</a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_Asie_Est">
                        <div
                          className="col-x-4 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Est Asiatique
                            <br />
                            <br />
                          </strong>{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=CN">Chine</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=KR">
                            Corée du Sud
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=HK">Hong-Kong</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=JP">Japon</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=TW">Taiwan</a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_Asie_Centrale">
                        <div
                          className="col-x-4 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Asie Centrale
                            <br />
                            <br />
                          </strong>{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=AZ">
                            Azerbaïdjan
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=MN">Mongolie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=UZ">
                            Ouzbékistan
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li
                    className={`sub-tab-item ${isPacificHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => setIsPacificHovered(true)}
                    onMouseLeave={() => setIsPacificHovered(false)}>
                    <div className={`sub-tab ${isPacificHovered ? 'hovered' : ''}`}>
                      <span className="arrow-box" style={{ borderTopColor: '#00A5E1' }}>
                        {' '}
                      </span>{' '}
                      <span>Océanie & Pacifique</span>
                    </div>

                    <div className="sub-panel clearfix" style={{ backgroundColor: '#FFF' }}>
                      <div id="Menu_Destinations_Oceanie_Asiatiques">
                        <div
                          className="col-x-3 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Iles en Asie
                            <br />
                            <br />
                          </strong>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=ID">Indonésie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=MY">Malaisie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=PH">
                            Philippines
                          </a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_Oceanie_Anglophone">
                        <div
                          className="col-x-3 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Destinations Anglophones
                            <br />
                            <br />
                          </strong>{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=AU">Australie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=NZ">
                            Nouvelle Zélande
                          </a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_Oceanie_Francophone">
                        <div
                          className="col-x-3 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Iles Francophones
                            <br />
                            <br />
                          </strong>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=NC">
                            Nouvelle Calédonie
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=PF">
                            Polynésie Française - Tahiti
                          </a>
                        </div>
                      </div>
                    </div>
                  </li>

                  <li
                    className={`sub-tab-item ${isAfricaHovered ? 'hovered' : ''}`}
                    onMouseEnter={() => setIsAfricaHovered(true)}
                    onMouseLeave={() => setIsAfricaHovered(false)}>
                    <div className={`sub-tab ${isAfricaHovered ? 'hovered' : ''}`}>
                      <span className="arrow-box" style={{ borderTopColor: '#00A5E1' }}>
                        {' '}
                      </span>{' '}
                      <span>Afrique</span>
                    </div>

                    <div className="sub-panel clearfix" style={{ backgroundColor: '#FFF' }}>
                      <div id="Menu_Destinations_Afrique_Australe">
                        <div
                          className="col-x-4 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Afrique Australe
                            <br />
                            <br />
                          </strong>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=ZA">
                            Afrique du Sud
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=BW">Botswana</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=LS">Lesotho</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=MZ">
                            Mozambique
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=NA">Namibie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=SZ">Swaziland</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=ZW">Zimbabwe</a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_Afrique_Equatoriale">
                        <div
                          className="col-x-4 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>Afrique Equatoriale</strong>
                          <br />
                          <br />
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=ET">Ethiopie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=KE">Kenya</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=SN">Sénégal</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=TZ">Tanzanie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=TG">Togo</a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_Afrique_Iles">
                        <div
                          className="col-x-4 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Iles de l'Océan Indien
                            <br />
                            <br />
                          </strong>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=MG">
                            Madagascar
                          </a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=MU">Maurice</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=RE">Réunion</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=ZAN">Zanzibar</a>
                          <br />
                          <br />{' '}
                          <strong>
                            Iles de l'Océan Atlantique
                            <br />
                            <br />
                          </strong>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=CV">Cap Vert</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=ST">
                            São Tomé et Principe
                          </a>
                        </div>
                      </div>
                      <div id="Menu_Destinations_Afrique_Nord">
                        <div
                          className="col-x-4 left clearfix border-right"
                          style={{ lineHeight: 'normal' }}>
                          <strong>
                            Afrique du Nord
                            <br />
                            <br />
                          </strong>
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=DZ">Algérie</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=EG">Egypte</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=MA">Maroc</a>
                          <br />{' '}
                          <a href="https://www.leclercvoyages.com/search?m_c.desti=TN">Tunisie</a>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </SectionContainer>
    </Box>
  )
}
