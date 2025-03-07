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
 * Extrait les boutons de suggestion du texte
 */
export const extractSuggestionButtons = (text: string): string[] => {
  const regex = /\(([^()]+)\)/g;
  const suggestions: string[] = [];
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    suggestions.push(match[1]);
  }
  
  return suggestions;
};

/**
 * Fonction de détection spécifique pour le scénario Disney
 */
export const findDisneyButtons = (text: string): string[] => {
  // Vérifie spécifiquement si le texte contient une partie de la réponse Disney
  if (text.includes("Disney") && text.includes("Halloween")) {
    // Retourne directement les options du scénario Disney
    return ["Floride", "Californie", "Paris", "Laurianne, épouse", "Louis, 16 ans", "Kiara, 18 ans"];
  }
  
  // Pour la question sur Orlando
  if (text.includes("Orlando est l'aéroport international")) {
    return ["Orlando", "Miami"];
  }
  
  // Pour la question sur le départ de Marseille
  if (text.includes("Vous partez d'habitude de Marseille")) {
    return ["oui", "non"];
  }
  
  return [];
};

// Suggestions modifiées pour être des débuts de phrases
export const defaultSuggestions: Suggestion[] = [
  { id: 'sun', text: 'Je recherche une destination où il fait chaud...', borderColor: '#FFC107' },
  { id: 'budget', text: 'Mon budget est limité à 500€, quelles options...', borderColor: '#483698' },
  { id: 'f1', text: 'Je voudrais assister au Grand Prix de F1 à...', borderColor: '#2196F3' },
];