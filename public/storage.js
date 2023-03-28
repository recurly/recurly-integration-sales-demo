
window.addEventListener('load', (event) => {
  console.log('Page loaded!');
  let selectedColor = localStorage.getItem('bkgdcolor') ? localStorage.getItem('bkgdcolor') : '#ffffff';
  console.log('Selected color:', selectedColor);
  document.querySelector('body').style.backgroundColor = selectedColor;

});

window.addEventListener('load', (event) => {
  let selectedColorTwo = localStorage.getItem('contentColor') ? localStorage.getItem('contentColor') : '#ffffff';
  document.querySelectorAll('.content').forEach(el => el.style.backgroundColor = selectedColorTwo);

});

window.addEventListener('load', (event) => {
  let brandText = localStorage.getItem('brand') ? localStorage.getItem('brand') : "";
  document.getElementById('nameBrand').innerHTML = brandText;
});

window.addEventListener('load', (event) => {
  let brandText = localStorage.getItem('brandm') ? localStorage.getItem('brandm') : "";
  document.getElementById('brandMessage').innerHTML = brandText;
});

const input = document.getElementById('thumbnail');

window.addEventListener('load', (event) => {
  let logo = localStorage.getItem('thumbnail') ? localStorage.getItem('thumbnail') : "";
  const previewImage = document.getElementById('preview');
  previewImage.setAttribute('src', logo);
});
