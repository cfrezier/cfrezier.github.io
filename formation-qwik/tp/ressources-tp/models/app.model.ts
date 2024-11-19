export type SagaPowerRangers = {
  id: string;
  nom: string;
  personnages: Personnage[];
  annee_de_debut: string;
}[];

export type Personnage = {
  id: number;
  nom: string;
  couleur: string;
  zord: string;
};

export type SagaPowerRangersJson = {
  id: string;
  nom: string;
  personnages: PersonnageJson[];
  annee_de_debut: string;
}[];

export type PersonnageJson = {
  nom: string[] | string;
  couleur?: string[] | string;
  zord?: string[] | string;
};

export type TestListType<T, D> = Array<T & { name: string; expected: D }>;
