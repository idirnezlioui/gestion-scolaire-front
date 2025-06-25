export interface Etudiant {
  num_etudiant: number | null;
  nom: string | null
  prenom: string | null  
  date_naiss: string | null 
  lieu_naiss: string | null 
  nationalite: string | null 
  niveau: string | null 
  date_inse: string | null 
  intitule: string | null 
  type_session: string | null
  image?: string | null;
  id_utilisateur?: number | null; 

}
