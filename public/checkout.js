import { hashParams } from "./helpers/hashParams.js";
const { plans, publicKey, stripePublishableKey, stripeAccountId } = window.recurlyConfig;

recurly.configure(publicKey);

const { plan_code: selectedPlanCode, error } = hashParams();

const selectedPlan = plans.filter((plan) => plan.code == selectedPlanCode)[0];

const planSelect = document.getElementById('plan-select');
planSelect.innerHTML = `<option value="${selectedPlan?.code}" name="plan-code">${selectedPlan?.name}</option>`;
planSelect.style.display = 'none';

const planDiv = document.getElementById('plan');
planDiv.innerHTML = `<h2 value="${selectedPlan?.code}" name="plan-code">Thank you for selecting the ${selectedPlan?.name} Plan. Your best friend will love it!</h2>`;

// Recurly Elements
const elements = recurly.Elements();
const cardNumberElement = elements.CardNumberElement();
const cardMonthElement = elements.CardMonthElement();
const cardYearElement = elements.CardYearElement();
const cardCvvElement = elements.CardCvvElement();
cardNumberElement.attach('#recurly-elements-number');
cardMonthElement.attach('#recurly-elements-month');
cardYearElement.attach('#recurly-elements-year');
cardCvvElement.attach('#recurly-elements-cvv');

// Stripe Elements — Third-Party Checkout via Recurly
const stripe = Stripe(stripePublishableKey, stripeAccountId ? { stripeAccount: stripeAccountId } : {});

const initialAmount = Math.round(parseFloat(selectedPlan?.unit_amount || 0) * 100) || 1;
const initialCurrency = (selectedPlan?.currency || 'usd').toLowerCase();

const stripeElements = stripe.elements({
  mode: 'payment',
  amount: initialAmount,
  currency: initialCurrency,
  appearance: {
    theme: 'none',
    variables: {
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
      fontSizeBase: '16px',
      colorText: '#807D73',
      colorTextPlaceholder: '#CCC9B8',
      colorBackground: '#F1EFE3',
      colorPrimary: '#FFD706',
      colorDanger: '#FF5810',
      borderRadius: '0px',
    },
    rules: {
      '.Input': {
        border: '2px solid #CCC9B8',
        boxShadow: 'none',
        fontWeight: '600',
        padding: '0.5rem',
      },
      '.Input:focus': {
        border: '2px solid #0D0D0B',
        color: '#0D0D0B',
        outline: 'none',
      },
      '.Label': {
        color: '#0D0D0B',
        fontSize: '12px',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: '0.25rem',
      },
      '.Tab': {
        border: '2px solid #CCC9B8',
        boxShadow: 'none',
      },
      '.Tab--selected': {
        borderColor: '#0D0D0B',
        color: '#0D0D0B',
      },
    },
  },
});
const stripePaymentElement = stripeElements.create('payment', {
  fields: {
    billingDetails: {
      name: 'never',
      address: 'never',
    },
  },
});
stripePaymentElement.mount('#stripe-payment-element');
stripePaymentElement.on('focus', () => setActiveProcessor('stripe'));

// Payment processor selection
let activeProcessor = 'recurly';

const recurlyPanel = document.getElementById('recurly-panel');
const stripePanel = document.getElementById('stripe-panel');

function setActiveProcessor(processor) {
  activeProcessor = processor;
  document.getElementById('active-processor').value = processor;
  recurlyPanel.querySelector('.payment-panel').classList.toggle('active', processor === 'recurly');
  stripePanel.querySelector('.payment-panel').classList.toggle('active', processor === 'stripe');
}

recurlyPanel.addEventListener('click', () => setActiveProcessor('recurly'));
stripePanel.addEventListener('click', () => setActiveProcessor('stripe'));

const recurlyForm = document.querySelector('#form');

cardNumberElement.on('submit', () => {
  recurlyForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
});

recurlyForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  const form = this;
  document.getElementById('errors').innerHTML = '';

  if (activeProcessor === 'recurly') {
    recurly.token(elements, form, function (err, token) {
      if (err) handleRecurlyError(err);
      else {
        form.action = '/api/purchases/new';
        form.submit();
      }
    });
  } else {
    try {
      const { error: submitError } = await stripeElements.submit();
      if (submitError) {
        document.getElementById('errors').innerHTML = `<h5>${submitError.message}</h5>`;
        return;
      }

      const firstName = form.querySelector('[data-recurly="first_name"]').value;
      const lastName = form.querySelector('[data-recurly="last_name"]').value;
      const { confirmationToken, error: stripeError } = await stripe.createConfirmationToken({
        elements: stripeElements,
        params: {
          payment_method_data: {
            billing_details: {
              name: `${firstName} ${lastName}`.trim(),
              address: {
                line1: form.querySelector('[data-recurly="address1"]').value,
                line2: form.querySelector('[data-recurly="address2"]').value,
                city: form.querySelector('[data-recurly="city"]').value,
                state: form.querySelector('[data-recurly="region"]').value,
                postal_code: form.querySelector('[data-recurly="postal_code"]').value,
                country: form.querySelector('[data-recurly="country"]').value,
              },
            },
          },
        },
      });

      if (stripeError) {
        document.getElementById('errors').innerHTML = `<h5>${stripeError.message}</h5>`;
      } else {
        document.getElementById('stripe-confirmation-token').value = confirmationToken.id;
        form.action = '/api/purchases/new';
        form.submit();
      }
    } catch (e) {
      console.error('Stripe confirmation token error:', e);
      document.getElementById('errors').innerHTML = `<h5>${e.message}</h5>`;
    }
  }
});

if (error) {
  const parsedParams = decodeURIComponent(error).replace(/\+/g, ' ');
  document.getElementById('errors').innerHTML += `<h5>${parsedParams}</h5>`;
}

const pricing = recurly.Pricing.Checkout();
pricing.on('change', (price) => {
  console.info('change: ', price);
  const amount = Math.round(parseFloat(price.now.total) * 100);
  const currency = price.currency.code;
  document.getElementById('plan-amount').value = amount;
  document.getElementById('plan-currency').value = currency;
  stripeElements.update({ amount: amount || 1, currency: currency.toLowerCase() });
});
pricing.on('error', (price) => console.error('error: ', price));
pricing.attach('form');
pricing.on('set.plan', (plan) => console.info('set.plan: ', plan));

const handleRecurlyError = (err) => {
  console.error(err);
  err.details.forEach((detail) => {
    const { field, messages } = detail;
    const errorEle = document.getElementById(field);
    if (errorEle) {
      errorEle.defaultValue = messages.join(', ');
      errorEle.style.borderColor = 'red';
    } else {
      document.getElementById('errors').innerHTML += `<h5>${field}: ${messages.join(', ')}</h5>`;
    }
  });
};
