// background colour 

window.addEventListener('load', (event) => {
    // console.log('Page loaded!');
    // gets the background colour from local storage - or use #ffffff
    let selectedColor = localStorage.getItem('bkgdcolor') ? localStorage.getItem('bkgdcolor') : '#ffffff';
    // console.log('Selected color:', selectedColor);
    document.querySelector('body').style.backgroundColor = selectedColor;
    document.querySelector('#color').value = selectedColor;

    document.querySelector('#color').addEventListener('change', () => {
        let color = this.value;
        // console.log('New color selected:', color);
        document.querySelector('body').style.backgroundColor = color;
        localStorage.setItem('bkgdcolor', color);
    });
});


// content colour 
window.addEventListener('load', (event) => {
    let selectedColorTwo = localStorage.getItem('contentColor') ? localStorage.getItem('contentColor') : '#ffffff';
    document.querySelectorAll('.content').forEach(el => el.style.backgroundColor = selectedColorTwo);
    document.querySelector('#content-color').value = selectedColorTwo;

    document.querySelector('#content-color').addEventListener('change', () => {
        let color = this.value;
        document.querySelectorAll('.content').forEach(el => el.style.backgroundColor = color);
        localStorage.setItem('contentColor', color);
    });
});

// brand name
window.addEventListener('load', (event) => {
    let brandText = localStorage.getItem('brand') ? localStorage.getItem('brand') : "";
    document.getElementById('nameBrand').innerHTML = brandText;
});

document.getElementById('ConfirmBrand').addEventListener('click', () => {
    let text = document.getElementById('company').value;
    document.getElementById('nameBrand').innerHTML = text;
    localStorage.setItem('brand', text);
});

// brand slogan
window.addEventListener('load', (event) => {
    let brandText = localStorage.getItem('brandm') ? localStorage.getItem('brandm') : "";
    document.getElementById('brandMessage').innerHTML = brandText;
});

document.getElementById('ConfirmBrandMessage').addEventListener('click', () => {
    let text = document.getElementById('companyMessage').value;
    document.getElementById('brandMessage').innerHTML = text;
    localStorage.setItem('brandm', text);
});

// brand logo

const input = document.getElementById('thumbnail');
input.addEventListener('change', (event) => {
    const image = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.addEventListener("load", () => {
        console.log(reader.result);
        localStorage.setItem("thumbnail", reader.result);
    });
});

function upload() {
    location.reload();
}

document.getElementById("uploadBtn").addEventListener("click", upload);

window.addEventListener('load', (event) => {
    let logo = localStorage.getItem('thumbnail') ? localStorage.getItem('thumbnail') : "";
    const previewImage = document.getElementById('preview');
    previewImage.setAttribute('src', logo);
});

function clearLocalStaorageKeys() {
    localStorage.removeItem("bkgdcolor");
    localStorage.removeItem("contentColor");
    localStorage.removeItem("brand");
    localStorage.removeItem("brandm");
    localStorage.removeItem("thumbnail");
    location.reload()

}

document.getElementById("clearBtn").addEventListener("click", clearLocalStaorageKeys);

function goToPlans() {
    window.location.href = 'plans.html';
}

document.getElementById("plansBtn").addEventListener("click", goToPlans);