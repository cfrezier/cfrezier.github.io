const options = document.querySelectorAll('.conf-option');
const detail = document.querySelector('.detail');
for (let i = 0; i < options.length; i++) {
    options[i].addEventListener('click', () => {
        detail.scrollTop = i * window.innerHeight;
    });
}