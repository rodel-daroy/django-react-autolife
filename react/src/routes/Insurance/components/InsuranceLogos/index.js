import React from 'react'
import ObjectFit from '../../../../components/common/ObjectFit'
import aviva from './img/aviva.svg'
import gore from './img/gore-mutual.svg'
import intact from './img/intact.svg'
import nbInsurance from './img/nb-insurance.svg'
import travelers from './img/travelers.svg'
import wawanesa from './img/wawanesa.svg'
import economical from './img/economical.svg'
import rsa from './img/rsa.svg'
import facility from './img/facility.png'
import hub from './img/hub.svg'
import './style.scss'

const Logo = ({ image, alt, naturalWidth, naturalHeight }) => (
	<div className="insurance-logo">
		<ObjectFit fit="contain" naturalWidth={naturalWidth} naturalHeight={naturalHeight}>
			<img src={image} alt={alt} />
		</ObjectFit>
	</div>
)

export const INSURANCE_LOGOS = {
	'GA': <Logo image={aviva} alt="Aviva" naturalWidth={475.7} naturalHeight={87.5} />,
	'GORE': <Logo image={gore} alt="Gore Mutual" naturalWidth={171.2} naturalHeight={63.1} />,
	'HAL': <Logo image={intact} alt="Intact Insurance" naturalWidth={265.7} naturalHeight={115.8} />,
	'LOMI': <Logo image={nbInsurance} alt="Northbridge Insurance" naturalWidth={495.1} naturalHeight={103.9} />,
	'DOC': <Logo image={travelers} alt="Travelers" naturalWidth={182.3} naturalHeight={36.9} />,
	'WAWA': <Logo image={wawanesa} alt="Wawanesa Insurance" naturalWidth={273.7} naturalHeight={66.6} />,
	'ECON': <Logo image={economical} alt="Economical Insurance" naturalWidth={235.2} naturalHeight={84.9} />,
	'ROY': <Logo image={rsa} alt="RSA" naturalWidth={283.5} naturalHeight={146.3} />,
	'FAC': <Logo image={facility} alt="Facility Association" />,
	'': <Logo image={hub} alt="Hub" naturalWidth={364.6} naturalHeight={113} />
}

const displayLogos = [
	'GA',
	'GORE',
	'HAL',
	'LOMI',
	'DOC',
	'WAWA',
	'ECON',
	'ROY',
	''
]

const InsuranceLogos = props => (
	<div className="insurance-logos">
		{displayLogos.map((logo, i) => React.cloneElement(INSURANCE_LOGOS[logo], { key: i }))}
	</div>
)

export default InsuranceLogos