import json from "./saga-power-rangers.json";
import {
  type Personnage,
  type SagaPowerRangers,
  type SagaPowerRangersJson,
} from "../models/app.model";

const sagaPowerRangersJson: SagaPowerRangersJson = json;
let id = 0;
const generateId = (): number => {
  return id++;
};

export const SAGA_POWER_RANGERS: SagaPowerRangers = sagaPowerRangersJson
  .filter(({ personnages }) =>
    personnages.every(({ couleur, zord }) => !!couleur && !!zord),
  )
  .map(({ personnages, ...rest }) => ({
    ...rest,
    personnages: personnages.map(
      ({ nom, couleur, zord }) =>
        ({
          id: generateId(),
          nom: Array.isArray(nom) ? nom.join(", ") : nom,
          couleur: Array.isArray(couleur) ? couleur[0] : couleur,
          zord: Array.isArray(zord) ? zord[0] : zord,
        }) as Personnage,
    ),
  }));
