import { Suggestion } from '../MagicAssistant/types';

// Configuration du backend
export const API_BASE_URL = 'http://l8ks0goocw40kgsgo0wcok4c.159.69.27.55.sslip.io/';

/**
 * Réinitialise la conversation côté serveur avec gestion des erreurs améliorée
 */
export const resetConversation = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // Ajouter pour la cohérence avec les autres appels API
      mode: 'cors',            // Explicitement définir le mode CORS
    });
    
    if (!response.ok) {
      console.warn(`La réinitialisation a retourné un statut ${response.status}`);
      return false;
    }
    
    console.log("Conversation réinitialisée sur le serveur");
    return true;
  } catch (error) {
    console.error("Erreur lors de la réinitialisation de la conversation:", error);
    return false;
  }
};

/**
 * Applique un effet de grisage sur les formulaires de recherche
 */
export const applyFormFieldsGreyout = (isActive: boolean): void => {
  // Sélectionner spécifiquement les formulaires de recherche de vols
  const forms = document.querySelectorAll('form[data-testid="searchRoundTripFlightsForm"], form[data-testid="searchOneWayFlightsForm"]');
  
  // Supprimer les overlays existants (pour éviter les doublons)
  document.querySelectorAll('.form-overlay-blocker').forEach(el => el.remove());
  
  if (isActive) {
    // Pour chaque formulaire, créer un overlay simple
    forms.forEach((form) => {
      const formPosition = window.getComputedStyle(form as HTMLElement).position;
      
      // S'assurer que le formulaire a une position relative ou absolute pour le positionnement correct de l'overlay
      if (formPosition === 'static') {
        (form as HTMLElement).style.position = 'relative';
      }
      
      // Créer un overlay pour ce formulaire spécifique
      const overlay = document.createElement('div');
      overlay.className = 'form-overlay-blocker';
      
      // Styles pour l'overlay - simple grisage sans flou ni changement de curseur
      Object.assign(overlay.style, {
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(240, 240, 240, 0.4)', // Gris semi-transparent
        zIndex: '999',
      });
      
      // Ajouter l'overlay au formulaire
      form.appendChild(overlay);
    });
  } else {
    // Supprimer tous les overlays lorsque désactivé
    document.querySelectorAll('.form-overlay-blocker').forEach(el => el.remove());
    
    // Rétablir les positions si nécessaire
    forms.forEach(form => {
      if ((form as HTMLElement).style.position === 'relative' && 
          !(form as HTMLElement).getAttribute('data-original-position')) {
        (form as HTMLElement).style.position = '';
      }
    });
  }
};

/**
 * Détecte les boutons spéciaux pour le scénario Disney
 */
export const findDisneyButtons = (text: string): string[] => {
  return [];
};

/**
 * Fonction auxiliaire pour extraire des boutons de suggestion du texte
 */
export const extractSuggestionButtons = (text: string): any[] => {
  return findDisneyButtons(text);
};

// Suggestions par défaut pour le premier message d'accueil
export const defaultSuggestions: Suggestion[] = [
  {
    id: 'warm',
    text: 'Je veux visiter...'
  },
  {
    id: 'cheap',
    text: 'Quelle est la meilleure saison pour aller...'
  },
  {
    id: 'original',
    text: 'Réserve moi un billet pour aller...'
  }
];