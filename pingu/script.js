let autoplayTimer;
let autobarTimer;

const AUTOPLAY_STEP_DURATION = 5000;

const API_KEY = localStorage.getItem('API_KEY') ?? 'put your api key in local storage, key API_KEY';

function askStepGPT(imagesAndChoices) {
    toggleRequestLoader(true);
    return Promise.all([fetch('https://azopenai-bdx.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-08-01-preview', {
        method: 'POST',
        body: promptForText(imagesAndChoices),
        headers: {
            'Content-Type': 'application/json',
            'api-key': API_KEY
        }
    }), fetch('https://azopenai-bdx.openai.azure.com/openai/deployments/dall-e-3/images/generations?api-version=2024-02-01', {
        method: 'POST',
        body: promptForImage(imagesAndChoices),
        headers: {
            'Content-Type': 'application/json',
            'api-key': API_KEY
        }
    })])
        .then((response) => {
            toggleRequestLoader(false);
            if (response[0].ok && response[1].ok) {
                return Promise.all([response[0].json(), response[1].json()]);
            }
            throw new Error('Server response was not ok.' + (response[0].ok ? '' : 'text') + (response[1].ok ? '' : 'image'));
        });
}

document.addEventListener('DOMContentLoaded', function () {
    let currentIndex = 0;
    const imageElement = document.getElementById('image');
    const choiceButtons = document.querySelectorAll('.choice');
    const replayButton = document.getElementById('replay-button');
    const step = document.getElementById('step');
    const loader = document.getElementById('loader');
    const bar = document.getElementById('bar');
    const story = document.getElementById('story');
    const reset = document.getElementById('reset-button');

    const imagesAndChoices = JSON.parse(localStorage.getItem('imagesAndChoices')) ?? [];

    if (imagesAndChoices.length === 0) {
        story.innerText = pinguStory;
        askStepGPT(imagesAndChoices)
            .then((data) => {
                const parsed = JSON.parse(data[0].choices[0].message.content.replaceAll(/```/g, '').replaceAll(/\n/g, ' ').replace(/^json /, ''));
                imagesAndChoices.push({
                    image: data[1].data[0].url,
                    choices: parsed.choices,
                    story: pinguStory + '. ' + parsed.story
                });
                localStorage.setItem('imagesAndChoices', JSON.stringify(imagesAndChoices));
                updateStep();
                displayCurrentSet();
            });
    } else {
        updateStep();
        displayCurrentSet();
    }


    function updateStep() {
        step.innerText = currentIndex + 1 + '/' + (imagesAndChoices.length);
    }

    function displayCurrentSet() {
        imageElement.classList.remove('fade-in');
        setTimeout(() => {
            const currentSet = imagesAndChoices[currentIndex];
            imageElement.src = currentSet.image;
            imageElement.classList.add('fade-in');
            choiceButtons.forEach((button, index) => {
                if (currentSet.choices && currentSet.choices[index]) {
                    button.style.display = 'block';
                    button.textContent = currentSet.choices[index];
                    if (currentSet.selected === index) {
                        button.classList.add('selected');
                    } else {
                        button.classList.remove('selected');
                    }
                } else {
                    button.style.display = 'none';
                }
            });
            story.innerText = currentSet.story;
        }, 500);
    }

    function nextSet(selected = 0) {
        const currentSet = imagesAndChoices[currentIndex];
        if (currentSet.selected === undefined || currentIndex === imagesAndChoices.length - 1) {
            currentSet.selected = selected;
            // TODO: call IA with prompt and get next image and choices

            askStepGPT(imagesAndChoices)
                .then((data) => {
                    const parsed = JSON.parse(data[0].choices[0].message.content.replaceAll(/```/g, '').replaceAll(/\n/g, ' ').replace(/^json /, ''));
                    imagesAndChoices.push({
                        image: data[1].data[0].url,
                        choices: parsed.choices,
                        story: parsed.story
                    });
                    localStorage.setItem('imagesAndChoices', JSON.stringify(imagesAndChoices));
                    currentIndex = imagesAndChoices.length - 1;
                    updateStep();
                    displayCurrentSet();
                })
                .catch((error) => {
                    console.error('There has been a problem with your fetch operation:', error);
                });
        } else {
            currentIndex = (currentIndex + 1) % imagesAndChoices.length;
            updateStep();
            displayCurrentSet();
        }
    }

    let barWidth = 0;

    function stopAutoplay() {
        if (autoplayTimer) {
            clearTimeout(autoplayTimer);
        }
        loader.style.display = 'none';
        replayButton.style.display = 'unset';
        autoplayTimer = null;
        if (autobarTimer) {
            clearInterval(autobarTimer);
        }
        barWidth = 0
    }

    function autoplay() {
        loader.style.display = 'block';
        replayButton.style.display = 'none';
        if (autobarTimer) {
            clearInterval(autobarTimer);
        }
        barWidth = 0;
        autobarTimer = setInterval(() => {
            barWidth++;
            bar.style.width = `${Math.max(barWidth, 2)}%`;
        }, AUTOPLAY_STEP_DURATION / 100);
        updateStep();

        autoplayTimer = setTimeout(() => {
            nextSet();
            if (imagesAndChoices[currentIndex].selected !== undefined) {
                autoplay();
            } else {
                stopAutoplay();
            }
        }, AUTOPLAY_STEP_DURATION);
    }

    choiceButtons.forEach((button, idx) => {
        button.addEventListener('click', () => {
            stopAutoplay();
            nextSet(idx);
        });
    });

    replayButton.addEventListener('click', function () {
        currentIndex = 0;
        displayCurrentSet();
        autoplay();
    });

    reset.addEventListener('click', function () {
        localStorage.removeItem('imagesAndChoices');
        window.location.reload();
    });

    if (imagesAndChoices.length > 1) {
        autoplay();
    }
});

const pinguStory = 'Pingu se trouve avec sa famille et ses amis dans son village sur la banquise. Un jour, un bug informatique inconnu a bloqué l\'ensemble des ordinateurs du village de Pingu. Ce dernier part donc à l\'aventure pour découvrir l\'origine du bug';

const responseFormatJson = "J'aimerais que tes réponses soient au format JSON avec les champs suivants :\n" +
    "story : champ texte contenant la suite de l'histoire, sans les choix que Pingu doit faire\n" +
    "choices : une liste de deux chaînes de caractères correspondant aux deux possibilités parmi lesquelles Pingu doit choisir. Pour reprendre l'exemple ci-dessus, la réponse attendue aurait été la suivante : { \"story\": \"En quittant son village, Pingu doit rejoindre le continent pour chercher l'origine du bug qui a bloqué l'ensemble des ordinateurs de son village. Deux choix s'offre à lui\", \"choices\": [\"Rejoindre le continent en bâteau.\", \"Rejoindre le continent en avion.\"] }\n" +
    "Le retour est formaté en JSON pour facilité l'utilisation. "

const baseMessagesTexte = [
    {"role": "system", "content": "You are a helpful assistant."},
    {
        "role": "user",
        "content": `Salut. Nous allons joué à un jeu textuel qui racontera les aventures de Pingu, le pingouin au pull à capuche multicolore. Le point de départ est le suivant : ${pinguStory}. Après environ 5 péripéties, il faudrait arriver à la fin de l'histoire : le bug informatique venait en fait d'un manque de glaçon dans le générateur électrique alimentant le serveur central de la banquise.` +
            "En partant de ces informations, j'aimerais que tu racontes à chaque fois une courte péripétie d'un centaine de mots environ, avec en finalité un choix entre 2 options possibles pour Pingu. Par exemple : En quittant son village, Pingu doit rejoindre le continent pour chercher l'origine du bug qui a bloqué l'ensemble des ordinateurs de son village. Deux choix s'offre à lui :\n" +
            "Rejoindre le continent en bâteau.\n" +
            "Rejoindre le continent en avion.\n" +
            "Tu peux directement commencé avec la première péripétie.\n" +
            "Après 5 péripéties, le champ choices sera facultatif. Si l’histoire arrive à son terme, tu pourras l’omettre et retourner uniquement un objet avec le champ story.\n"
    }
];

const promptForText = (imagesAndChoices) => {
    const prompt = [
        ...baseMessagesTexte,
        ...imagesAndChoices.map(({story, choices, selected}) => [({
            "role": "assistant",
            "content": story
        }), ({"role": "user", "content": choices[selected]})]).flat()
    ];

    prompt[prompt.length - 1].content = prompt[prompt.length - 1].content + " " + responseFormatJson;

    if(imagesAndChoices.length > 5) {
        prompt[prompt.length - 1].content += " Tu as atteint la fin de l'histoire. Tu peux maintenant omettre le champ choices et retourner uniquement un objet avec le champ story.";
    }

    console.log(JSON.stringify({messages: prompt}));

    return JSON.stringify({messages: prompt});
}

const baseMessagesImage = {
    "prompt": "Un pinguin portant un sweat shirt à capuche multicolore, ",// + "<histoire précédente 1 champ story> + <histoire précédente 2 champ story> + Pingu a choisi : <solution choisie>",
    "size": "1024x1024",
    "n": 1,
    "quality": "standard",
    "style": "vivid"
};

const promptForImage = (imagesAndChoices) => {
    const lastImageAndChoices = imagesAndChoices[imagesAndChoices.length - 1];
    const prompt = {
        ...baseMessagesImage,
        prompt: `${baseMessagesImage.prompt} ${lastImageAndChoices ? `qui effectue l'action suivante: ${lastImageAndChoices.choices[lastImageAndChoices.selected]}` : ''})`
    };

    console.log(JSON.stringify(prompt));

    return JSON.stringify(prompt);
}

const toggleRequestLoader = (display) => {
    const loaderElement = document.getElementById('request-loader');
    loaderElement.style.display = display ? 'block' : 'none';
}