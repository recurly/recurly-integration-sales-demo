import { hashParams } from "./helpers/hashParams.js";
const { plans, publicKey } = window.recurlyConfig;

recurly.configure(publicKey);

const { plan_code: selectedPlanCode, error } = hashParams();

const selectedPlan = plans.filter((plan) => plan.code == selectedPlanCode)[0]

const planSelect = document.getElementById('plan-select');
planSelect.innerHTML = `<option value="${selectedPlan?.code}" name="plan-code">${selectedPlan?.name}</option>`;
planSelect.style.display = 'none';

const planDiv = document.getElementById('plan');
planDiv.innerHTML = `<h2 value="${selectedPlan?.code}" name="plan-code">Thank you for selecting the ${selectedPlan?.name} Plan. Your best friend will love it!</h2>`;

// Create a CardElement
const elements = recurly.Elements();

// Attach each individual cardElement
const cardNumberElement = elements.CardNumberElement();
const cardMonthElement = elements.CardMonthElement();
const cardYearElement = elements.CardYearElement();
const cardCvvElement = elements.CardCvvElement();
cardNumberElement.attach('#recurly-elements-number');
cardMonthElement.attach('#recurly-elements-month');
cardYearElement.attach('#recurly-elements-year');
cardCvvElement.attach('#recurly-elements-cvv');

const subscribeBtn = document.getElementById('subscribe');
const recurlyForm = document.querySelector('#form');

// When a customer hits their 'enter' key while using the card element
cardNumberElement.on('submit', (event) => {
	event.preventDefault();
	recurlyForm.submit();
});

recurlyForm.addEventListener('submit', function (event) {
	event.preventDefault();
	const form = this;

	recurly.token(elements, form, async function (err, token) {
		document.getElementById('errors').innerHTML = '';
		if (err) handleError(err);
		else {
			console.log('SUCCESS: ', token);
			form.submit();
		}
	});
});

if (error) {
	const parsedParams = decodeURIComponent(error).replace(/\+/g, ' ');
	document.getElementById('errors').innerHTML += `<h5>${parsedParams}</h5>`
}

const pricing = recurly.Pricing.Checkout();
const form = document.querySelector('form');
console.log(form);
if (console) {
	pricing.on('change', (price) => console.info('change: ', price));
	pricing.on('error', (price) => console.error('error: ', price));
}

pricing.attach('form');

pricing.on('set.plan', function (plan) {
	console.info('set.plan: ', plan);
});

const handleError = (err) => {
	console && console.error(err);

	err.details.forEach((detail) => {
		const { field, messages } = detail;
		const errorEle = document.getElementById(field);

		if (errorEle) {
			console.log(errorEle)
			errorEle.defaultValue = messages.join(', ');
			errorEle.style.borderColor = 'red';
		} else {
			document.getElementById(
				'errors',
			).innerHTML += `<h5>${field}: ${messages.join(', ')}</h5>`;
		}
	});
};
