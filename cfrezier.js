const options = document.querySelectorAll('.conf-option');
const slides = document.querySelectorAll('.conf-type');
const detail = document.querySelector('.detail');
for (let i = 0; i < options.length; i++) {
    options[i].addEventListener('click', () => {
        let toPass = 0;
        for(let j = 0; j < i; j++) {
            toPass += slides[j].getBoundingClientRect().height
        }
        detail.scrollTop = toPass;
    });
}