// server.mjs
import {createServer} from 'node:http';
import saga from './ressources/saga-power-rangers.json' with {type: 'json'};

let index = 1;
const addPersonnagesId = (sagas) => {
    return sagas.map(saga => ({
        ...saga,
        personnages: saga.personnages.map((personnage, idx) => ({...personnage, id: index++}))
    }))
}

const data = addPersonnagesId(JSON.parse(JSON.stringify(saga)));

const server = createServer((req, _res) => {
    let body = '';
    const res = myRes(_res);
    console.log(req.method, req.url);
    console.count();

    switch (req.method) {
        case 'OPTIONS':
            setTimeout(() => res.status(200).end(), 10);
            break;
        case 'GET':
            if (req.url === '/') {
                setTimeout(() => res.status(200).end(JSON.stringify(data)), 2000);
            } else {
                if (req.url.indexOf('/saga/') > -1) {
                    const id = req.url.split('/')[2];
                    const saga = data.find(saga => saga.id === id);
                    if (saga) {
                        setTimeout(() => res.status(200).end(JSON.stringify(saga)), 2000);
                    } else {
                        setTimeout(() => res.status(404).end(JSON.stringify("Saga not found")), 10);
                    }
                } else if (req.url.indexOf('/power-ranger/') > -1) {
                    const id = parseInt(req.url.split('/')[2], 10);
                    const saga = data.find(saga => saga.personnages.some(perso => perso.id === id));
                    if (saga) {
                        const pr = saga.personnages.find(perso => perso.id === id);
                        if (pr) {
                            setTimeout(() => res.status(200).end(JSON.stringify(pr)), 2000);
                        } else {
                            setTimeout(() => res.status(404).end(JSON.stringify("Power ranger not found")), 10);
                        }
                    } else {
                        setTimeout(() => res.status(404).end(JSON.stringify("Power ranger not found")), 10);
                    }
                } else {
                    setTimeout(() => res.status(404).end(JSON.stringify("Wrong url")), 10);
                }
            }
            break;
        case 'PUT':
            body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('error', (err) => {
                console.error(err);
                setTimeout(() => res.status(404).end('Bad Request'), 10);
            });
            req.on('end', () => {
                    console.log(body);
                    const bodyObj = JSON.parse(body); // { nom: string, couleur: string, id: number }
                    const persoId = parseInt(bodyObj.id, 10)
                    let userSaga = data.find(saga => saga.personnages.some(perso => perso.id === persoId));
                    if (!userSaga) {
                        console.error(`Not found personnage ${bodyObj.id}`);
                        setTimeout(() => res.status(404).end('Not Found'), 10);
                    } else {
                        const perso = userSaga.personnages.find(perso => perso.id === persoId);
                        try {
                            perso.nom = bodyObj.nom;
                            perso.couleur = bodyObj.couleur;
                            perso.zord = bodyObj.zord;
                            res.status(200).end('OK');
                        } catch (error) {
                            console.error(error);
                            res.status(400).end('Bad Request');
                        }
                    }
                }
            );
            break;
        case 'POST':
            body = '';
            req.on('data', (chunk) => {
                body += chunk;
            });
            req.on('error', (err) => {
                console.error(err);
                setTimeout(() => res.status(404).end('Bad Request'), 10);
            });
            req.on('end', () => {
                    const bodyObj = JSON.parse(body); // { nom: string, couleur: string, id: number, sagaId: string }
                    let userSaga = data.find(saga => saga.id === bodyObj.sagaId);
                    if (!userSaga) {
                        console.error(`Not found saga ${bodyObj.sagaId} in ${bodyObj}`);
                        setTimeout(() => res.status(400).end('Bad Request'), 10);
                    } else {
                        try {
                            const pr = {...JSON.parse(body), id: index++};
                            userSaga.personnages.push(pr);
                            setTimeout(() => res.status(201).end(JSON.stringify(pr)), 10);
                        } catch (error) {
                            console.error(error)
                            setTimeout(() => res.status(400).end('Bad Request'), 10);
                        }
                    }

                }
            );
            break;
    }
});

server.listen(8080, '127.0.0.1', () => {
    console.log('Listening on 127.0.0.1:8080');
});
// run with `node server.mjs`

const myRes = (res) => {
    const __res = res;
    return {
        ...res,
        status: (code) => {
            __res.writeHead(code, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            });
            return __res;
        },
        end: (value) => {
            __res.end(value);
        }
    };
}