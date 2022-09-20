const { plans, publicKey } = window.recurlyConfig;

recurly.configure(publicKey);

window.localStorage.setItem('plan_code', plans[0].code);
const planCode = window.localStorage.getItem('plan_code');

const planName = plans.reduce((name, allPlans) => {
  if (allPlans.code === planCode) {
    name = allPlans.name
  }
  return name;
}, '');

const planSelect = document.getElementById('plan-select');
planSelect.innerHTML = `<option value="${planCode}" name="${planCode}">${planName}</option>`;
planSelect.style.display = 'none';

const planDiv = document.getElementById('plan');
planDiv.innerHTML = `<h2 value="${planCode}" name="${planCode}">${planName}</h2>`

// Create a CardElement
const elements = recurly.Elements();
const cardElement = elements.CardElement({
	style: {
		fontFamily: 'Open Sans',
		fontSize: '1rem',
		fontWeight: 'bold',
		fontColor: '#2c0730',
	},
});
cardElement.attach('#recurly-elements');
// const cardNumberElement = elements.CardNumberElement();
// const cardMonthElement = elements.CardMonthElement();
// const cardYearElement = elements.CardYearElement();
// const cardCvvElement = elements.CardCvvElement()
// cardNumberElement.attach('#recurly-elements-number');
// cardMonthElement.attach('#recurly-elements-month');
// cardYearElement.attach('#recurly-elements-year');
// cardCvvElement.attach('#recurly-elements-cvv');

const subscribeBtn = document.getElementById('subscribe');
const recurlyForm = document.querySelector('#form');

recurlyForm.addEventListener('submit', function (event) {
	event.preventDefault();
	const form = this;

	recurly.token(elements, form, async function (err, token) {
		document.getElementById('errors').innerHTML = '';
    // const formData = [...new FormData(form)]
    //   .reduce((entries, [key, value]) => {
    //     entries[key] = value;
    //     return entries;
    //   }, {});

		if (err) error(err);
		else {
			console.log('SUCCESS: ', token);
			form.submit();
		}
	});
});

// const params = hashParams();

// if (Object.keys(params).length !== 0) {
//   const parsedParams = decodeURIComponent(params.error).replace(/\+/g, ' ');
//   document.getElementById('errors').innerHTML += `<h5>${parsedParams}</h5>`
// }

const pricing = recurly.Pricing.Checkout();
const form = document.querySelector('form');
  console.log(form)
if (console) {
  pricing.on('change', (price) => console.info('change: ', price));
  pricing.on('error', (price) => console.error('error: ', price))

}

pricing.attach('form')

pricing.on('set.plan', function(plan) {console.info('set.plan: ', plan)})
const error = (err) => {
	console && console.error(err);
	// const errorEle = document.getElementById('errors');

	// errorEle.innerHTML += `<h1>${err.message}</h1>`;
	err.details.forEach((detail) => {
    const { field, messages } = detail;
    const errorEle = document.getElementById(field);

    if (errorEle) {
      errorEle.defaultValue = messages.join(', ');
      errorEle.style.borderColor = 'red'
      // errorEle.innerHTML += `<h5>${field}: ${messages.join(', ')}</h5>`;
    } else {
      document.getElementById('errors').innerHTML += `<h5>${field}: ${messages.join(', ')}</h5>`;
    }
	});
	// $('button').prop('disabled', false);
};
