const hashParams = location.search.split('&').reduce((acc, i) => {
  const [k,v] = i.split('=');
  acc[k] = v;
  return acc;
}, {});

const {
  first_name,
  last_name
} = hashParams

console.log('hash: ', hashParams)
const successDiv = document.getElementById('success');
successDiv.innerHTML = `<h1>Thank you, ${first_name} ${last_name} for your order!</h1>`