import { Suggestion } from '../MagicAssistant/types';

// Configuration du backend
export const API_BASE_URL = 'http://localhost:5000';

/**
 * Réinitialise la conversation côté serveur
 */
export const resetConversation = async (): Promise<void> => {
  try {
    await fetch(`${API_BASE_URL}/api/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("Conversation réinitialisée sur le serveur");
  } catch (error) {
    console.error("Erreur lors de la réinitialisation de la conversation:", error);
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
  // Pour le premier message du scénario Disney Halloween
  if (text.includes("Bonjour Cyril, il existe différents parcs Disney") && 
      text.includes("célébration d'Halloween")) {
    return ["Floride", "Californie", "Paris", "Laurianne, épouse", "Louis, 16 ans", "Kiara, 18 ans"];
  }
  
  // Pour la confirmation de recherche de vol
  if (text.includes("Vous partez d'habitude de Marseille") && 
      text.includes("je lance la recherche")) {
    return ["oui", "non"];
  }
  
  // Pour l'explication sur Orlando et l'alternative Miami
  if (text.includes("Orlando est l'aéroport international le plus proche du parc") && 
      text.includes("Miami")) {
    return ["Orlando", "Miami"];
  }
  
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