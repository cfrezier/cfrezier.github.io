const options = document.querySelectorAll('.conf-option');
const slides = document.querySelectorAll('.conf-type');
const detail = document.querySelector('.detail');
let previouslyActive = 0;

const scrollTo = (index) => {
    // scroll
    let toPass = 0;
    for (let j = 0; j < index; j++) {
        toPass += slides[j].getBoundingClientRect().height
    }
    detail.scrollTop = toPass;
}

for (let i = 0; i < options.length; i++) {
    options[i].addEventListener('click', () => {
        // set active
        options[previouslyActive].classList.remove('active');
        options[i].classList.add('active');
        previouslyActive = i;

        scrollTo(i);
    });
}


screen.orientation.addEventListener("change", (event) => {
    setTimeout(() => {
        scrollTo(previouslyActive);
    }, 10);
});