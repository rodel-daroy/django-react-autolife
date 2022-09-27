import uniq from 'lodash/uniq';

export const MIN_PASSWORD_LENGTH = 6;
// export const required = message => value => (value ? undefined : message);
export const required = value => (value ? undefined : 'Required');
export const requiredCustom = (message = 'Required') => value => (value ? undefined : message);
export const isChecked = value => (value ? undefined : 'checked');
export const maxLength = max => value => (value && value.length > max ? `Must be ${max} characters or less` : undefined);
export const minLength = min => value => (value && value.length < min ? `Must be ${min} characters or more` : undefined);
export const isNumber = value => (value && Number.isNaN(Number(value)) ? 'Must be a number' : undefined);
export const minValue = min => value => (value && value < min ? `Must be at least ${min}` : undefined);
export const email = value => (value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/i.test(value) ? 'Invalid email address' : undefined);
export const tooOld = value => (value && value > 65 ? 'You might be too old for this' : undefined);
export const aol = value => (value && /.+@aol\.com/.test(value) ? 'Really? You still use AOL for your email?' : undefined);
export const alphaNumeric = value => (value && /[^a-zA-Z0-9 ]/i.test(value) ? 'Only alphanumeric characters' : undefined);
export const postalCanada = value => (value && !/^([ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1})$/i.test(value) ? 'Invalid postal code' : undefined);
export const phoneNumber = value => (value && !/^(0|[1-9][0-9]{9})$/i.test(value) ? 'Invalid phone number, must be 10 digits' : undefined);
export const passwordLength = value => value.length >= MIN_PASSWORD_LENGTH ? undefined : `Password should be at least ${MIN_PASSWORD_LENGTH} characters`;
export const alphabets = value => (value && !value.match(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/) ? 'Cannot be numeric or alphanumeric' : undefined);
/*
^\d{5}(-\d{4})?$
Matches all US format zip code formats (e.g., "94105-0011" or "94105")
(^\d{5}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$)
Matches US or Canadian zip codes in above formats.
*/

export const calculatePasswordStrength = password => {
	password = password || '';

	const countedLength = Math.max(0, password.length - MIN_PASSWORD_LENGTH);

	const uniqueChars = uniq([...password]).length;

	const containsDigit = !!password.match(/[0-9]/);
	const containsLowercase = !!password.match(/[a-z]/);
	const containsUppercase = !!password.match(/[A-Z]/);
	const containsSymbol = !!password.match(/[^0-9a-zA-Z]/);

	const finalScore = 
		countedLength * .05
		+ uniqueChars * .01
		+ Number(containsDigit) * .1
		+ Number(containsLowercase) * .1
		+ Number(containsUppercase) * .1
		+ Number(containsSymbol) * .1;

	return Math.min(1, Math.max(0, finalScore)) * 100;
};

