export interface Etudiant {
  num_etudiant: number;
  nom: string | null;
  prenom: string | null;
  date_naiss: string | null;
  lieu_naiss: string | null;
  nationalite: string | null;
  niveau: string | null;
  date_inse: string | null;
  sigle_specia: string | null;
  annee: string | null;
  type_session: string | null;
  statut_paiment:string |null;
  solde_restant:number 
}
