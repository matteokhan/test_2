import { RoundTripFlightSearchParams, OneWayFlightSearchParams } from '@/types';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  suggestions?: Suggestion[]; // Ajout de cette propriété pour les suggestions dynamiques
}

export interface Suggestion {
  id: string;
  text: string;
  type?: string;  // Assurez-vous que cette propriété existe
  borderColor?: string;
}

// Type union qui accepte les deux formats de recherche
export type FlightSearchParams = RoundTripFlightSearchParams | OneWayFlightSearchParams;

// Interface pour les props du composant principal
export interface MagicAssistantButtonProps {
  onSearch?: (params: FlightSearchParams) => void;
  isOpen?: boolean; // État du chat (ouvert/fermé)
  onToggle?: (isOpen: boolean) => void; // Fonction pour notifier le parent du changement d'état
}
