export interface Etudiant {
  num_etudiant: number | null;
  nom: string | null
  prenom: string | null  
  date_naiss: string | null 
  lieu_naiss: string | null 
  nationalite: string | null 
  numero_telephone: string | null;
  email:string|null
  niveau: string | null 
  date_inse: string | null 
  domaine: string | null; 
  type_session: string | null
  image?: string | null;
  id_utilisateur?: number | null; 

}
