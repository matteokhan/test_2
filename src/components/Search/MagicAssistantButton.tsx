import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  TextField, 
  Paper, 
  Stack, 
  Fade, 
  Collapse 
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { RoundTripFlightSearchParams, OneWayFlightSearchParams } from '@/types';
import dayjs from 'dayjs';
import { usePathname } from 'next/navigation';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface Suggestion {
  id: string;
  text: string;
  borderColor: string;
}

// Type union qui accepte les deux formats de recherche
type FlightSearchParams = RoundTripFlightSearchParams | OneWayFlightSearchParams;

// Exporter l'interface mise à jour pour la rendre disponible à l'importation
export interface MagicAssistantButtonProps {
  onSearch?: (params: FlightSearchParams) => void;
  isOpen?: boolean; // État du chat (ouvert/fermé)
  onToggle?: (isOpen: boolean) => void; // Fonction pour notifier le parent du changement d'état
}

const MagicAssistantButton: React.FC<MagicAssistantButtonProps> = ({ 
  onSearch, 
  isOpen: externalIsOpen, 
  onToggle 
}) => {
  // Configuration du backend
  const API_BASE_URL = 'http://localhost:5000';
  // État local pour isOpen (utilisé uniquement si externalIsOpen n'est pas fourni)
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Utiliser l'état externe s'il est fourni, sinon utiliser l'état interne
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  // Récupérer le chemin actuel pour déterminer si nous sommes sur la page de recherche aller simple
  const pathname = usePathname();
  // Détecter si nous sommes dans le formulaire aller simple ou aller-retour
  const isOneWayForm = pathname?.includes('one-way') || false;
  
  // État pour gérer le scroll manuel de l'utilisateur
  const [userScrolling, setUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Réinitialiser la conversation côté serveur lorsque le chat est fermé
  const resetConversation = async () => {
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

  // Suggestions modifiées pour être des débuts de phrases
  const suggestions: Suggestion[] = [
    { id: 'sun', text: 'Je recherche une destination où il fait chaud...', borderColor: '#FFC107' },
    { id: 'budget', text: 'Mon budget est limité à 500€, quelles options...', borderColor: '#483698' },
    { id: 'f1', text: 'Je voudrais assister au Grand Prix de F1 à...', borderColor: '#2196F3' },
  ];

  // Version simplifiée pour griser uniquement le formulaire sans flouter
  const applyFormFieldsGreyout = (isActive: boolean) => {
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

  // Appliquer l'effet de grisage quand l'état isOpen change
  useEffect(() => {
    applyFormFieldsGreyout(isOpen);
    return () => {
      // Restaurer l'état normal si le composant est démonté
      applyFormFieldsGreyout(false);
    };
  }, [isOpen]);

  // Message initial d'accueil
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Ajouter un message d'accueil initial
      setMessages([
        {
          id: 'welcome',
          text: "Bonjour ! Je suis votre assistant de voyage. Comment puis-je vous aider dans votre recherche de vol aujourd'hui ?",
          sender: 'assistant',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSuggestionClick = (text: string) => {
    // Simplement envoyer le message suggéré
    handleSendMessage(text);
  };

  // Gestionnaire d'événement de défilement avec détection de position
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    
    // Calculer si l'utilisateur est proche du bas
    const isNearBottom = 
      target.scrollHeight - target.scrollTop - target.clientHeight < 50;
    
    // Si l'utilisateur est déjà en bas, ne pas considérer comme scroll manuel
    if (isNearBottom) {
      setUserScrolling(false);
      return;
    }
    
    // Sinon, activer le mode de défilement manuel
    setUserScrolling(true);
    
    // Réinitialiser le timeout précédent
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Définir un délai plus long après lequel on considère que l'utilisateur a arrêté de scroller
    scrollTimeoutRef.current = setTimeout(() => {
      setUserScrolling(false);
    }, 5000); // 5 secondes d'inactivité avant de réactiver le défilement automatique
  };

  // Nettoyer le timeout lors du démontage du composant
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Focus sur l'input lorsque le chat s'ouvre
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, [isOpen]);

  const toggleChat = async () => {
    const newIsOpenState = !isOpen;
    
    if (newIsOpenState === false) {
      // Si on ferme le chat, réinitialiser la conversation
      setMessages([]);
      await resetConversation();
    }
    
    // Mettre à jour l'état local si nécessaire
    if (externalIsOpen === undefined) {
      setInternalIsOpen(newIsOpenState);
    }
    
    // Notifier le parent du changement d'état
    if (onToggle) {
      onToggle(newIsOpenState);
    } else {
      setInternalIsOpen(newIsOpenState);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    console.log(`Envoi de message à ${API_BASE_URL}/api/chatbot`);

    // Ajouter le message de l'utilisateur
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Conserver la position de défilement actuelle de l'utilisateur
    // Ne pas réinitialiser userScrolling pour éviter le repositionnement forcé

    try {
      // Appel à l'API backend
      const response = await fetch(`${API_BASE_URL}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          currentDate,
          // Indiquer au backend le type de formulaire actuel
          formType: isOneWayForm ? 'oneWay' : 'roundTrip'
        }),
      });

      if (!response.ok) {
        throw new Error(`Erreur: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Impossible de lire la réponse");
      
      let assistantMessage = '';
      let formData = null;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Convertir les chunks en texte
        const chunk = new TextDecoder().decode(value);
        
        // Détecter les données structurées dans la réponse
        if (chunk.includes('{"FORM_DATA":')) {
          try {
            const jsonStart = chunk.indexOf('{"FORM_DATA":');
            const jsonEnd = chunk.lastIndexOf('}') + 1;
            const jsonString = chunk.substring(jsonStart, jsonEnd);
            formData = JSON.parse(jsonString);
            console.log("Données de formulaire reçues:", formData);
            continue;
          } catch (e) {
            console.error("Erreur lors du parsing des données de formulaire:", e);
          }
        } else if (chunk.startsWith('\n{') && chunk.endsWith('}\n')) {
          // Ignorer les données structurées JSON intermédiaires
          continue;
        }
        
        // Ajouter le texte au message (mise à jour en temps réel)
        if (chunk.trim()) {
          assistantMessage += chunk;
          
          // Ajouter ou mettre à jour le message de l'assistant en temps réel
          setMessages(prevMessages => {
            const lastMessage = prevMessages[prevMessages.length - 1];
            if (lastMessage && lastMessage.sender === 'assistant' && lastMessage.id.startsWith('assistant-stream-')) {
              // Mettre à jour le message existant
              return [
                ...prevMessages.slice(0, -1),
                {
                  ...lastMessage,
                  text: assistantMessage,
                },
              ];
            } else {
              // Créer un nouveau message
              return [
                ...prevMessages,
                {
                  id: `assistant-stream-${Date.now()}`,
                  text: assistantMessage,
                  sender: 'assistant',
                  timestamp: new Date(),
                },
              ];
            }
          });
        }
      }

      // Finaliser le message de l'assistant
      if (assistantMessage.trim()) {
        setMessages(prevMessages => {
          const filteredMessages = prevMessages.filter(msg => !msg.id.startsWith('assistant-stream-'));
          return [
            ...filteredMessages,
            {
              id: `assistant-${Date.now()}`,
              text: assistantMessage.trim(),
              sender: 'assistant',
              timestamp: new Date(),
            },
          ];
        });
      }

      // Traiter les données de formulaire si elles sont présentes
      if (formData && formData.FORM_DATA && onSearch) {
        console.log("Préparation à la soumission du formulaire avec:", formData.FORM_DATA);
        
        // Vérifier le type de formulaire actuel pour formater correctement les données
        if (isOneWayForm) {
          // Formater pour un vol aller simple
          if (formData.FORM_DATA._type === "multiDestinations" && 
              formData.FORM_DATA.destinations && 
              formData.FORM_DATA.destinations.length > 0) {
            
            // Préparation des paramètres pour un vol aller simple
            const formParams: OneWayFlightSearchParams = {
              _type: "oneWay",
              adults: formData.FORM_DATA.adults || 1,
              childrens: formData.FORM_DATA.childrens || 0,
              infants: formData.FORM_DATA.infants || 0,
              
              // Premier segment seulement
              from: formData.FORM_DATA.destinations[0].from,
              fromLabel: formData.FORM_DATA.destinations[0].fromLabel,
              fromCountry: formData.FORM_DATA.destinations[0].fromCountry,
              fromCountryCode: formData.FORM_DATA.destinations[0].fromCountryCode,
              fromType: formData.FORM_DATA.destinations[0].fromType,
              fromInputValue: formData.FORM_DATA.destinations[0].fromLabel,
              
              to: formData.FORM_DATA.destinations[0].to,
              toLabel: formData.FORM_DATA.destinations[0].toLabel,
              toCountry: formData.FORM_DATA.destinations[0].toCountry,
              toCountryCode: formData.FORM_DATA.destinations[0].toCountryCode,
              toType: formData.FORM_DATA.destinations[0].toType,
              toInputValue: formData.FORM_DATA.destinations[0].toLabel,
              
              // Date aller seulement
              departure: formData.FORM_DATA.destinations[0].departure,
            };
            
            // Soumettre le formulaire aller simple
            onSearch(formParams);
          }
        } else {
          // Formater pour un vol aller-retour
          if (formData.FORM_DATA._type === "multiDestinations" && 
              formData.FORM_DATA.destinations && 
              formData.FORM_DATA.destinations.length > 0) {
            
            // Préparation des paramètres pour un vol aller-retour
            const formParams: RoundTripFlightSearchParams = {
              _type: "roundTrip",
              adults: formData.FORM_DATA.adults || 1,
              childrens: formData.FORM_DATA.childrens || 0,
              infants: formData.FORM_DATA.infants || 0,
              
              // Premier segment (aller)
              from: formData.FORM_DATA.destinations[0].from,
              fromLabel: formData.FORM_DATA.destinations[0].fromLabel,
              fromCountry: formData.FORM_DATA.destinations[0].fromCountry,
              fromCountryCode: formData.FORM_DATA.destinations[0].fromCountryCode,
              fromType: formData.FORM_DATA.destinations[0].fromType,
              fromInputValue: formData.FORM_DATA.destinations[0].fromLabel,
              
              to: formData.FORM_DATA.destinations[0].to,
              toLabel: formData.FORM_DATA.destinations[0].toLabel,
              toCountry: formData.FORM_DATA.destinations[0].toCountry,
              toCountryCode: formData.FORM_DATA.destinations[0].toCountryCode,
              toType: formData.FORM_DATA.destinations[0].toType,
              toInputValue: formData.FORM_DATA.destinations[0].toLabel,
              
              // Dates
              departure: formData.FORM_DATA.destinations[0].departure,
              return: formData.FORM_DATA.destinations.length > 1 
                ? formData.FORM_DATA.destinations[1].departure 
                : dayjs(formData.FORM_DATA.destinations[0].departure).add(7, 'day').format('YYYY-MM-DD')
            };
            
            // Soumettre le formulaire aller-retour
            onSearch(formParams);
          }
        }
      }
      
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: `error-${Date.now()}`,
          text: "Désolé, une erreur s'est produite lors de la communication avec l'assistant. Veuillez réessayer.",
          sender: 'assistant',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

// Ajoutez ces fonctions avant le return
const extractSuggestionButtons = (text: string): string[] => {
  // console.log("Texte à analyser:", text); // Log pour débogage
  const regex = /\(([^()]+)\)/g;
  const suggestions: string[] = [];
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    // console.log("Match trouvé:", match[1]); // Log pour débogage
    suggestions.push(match[1]);
  }
  
  return suggestions;
};

const handleSuggestionButtonClick = (suggestion: string) => {
  // Envoyer directement le message
  handleSendMessage(suggestion);
};

// Fonction de détection spécifique pour le scénario Disney (méthode alternative)
const findDisneyButtons = (text: string): string[] => {
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

// Voici le return complet
return (
  <Box sx={{ position: 'relative', width: '100%', mt: 2 }}>
    {/* Bouton marketing amélioré avec style bleu Leclerc */}
    <Box sx={{ textAlign: 'left', mb: 1 }}>
      <Button
        onClick={toggleChat}
        startIcon={<AutoAwesomeIcon fontSize="small" sx={{ color: '#FFD700' }} />}
        variant="contained"
        sx={{
          textTransform: 'none',
          color: 'white',
          backgroundColor: '#0066cc', // Bleu Leclerc
          padding: '8px 16px',
          fontWeight: 700,
          fontSize: '0.95rem',
          border: '1px solid #0066cc',
          borderRadius: '6px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: '#0055bb',
          },
          zIndex: 1100, // S'assurer que le bouton est toujours visible
        }}
      >
        Conseiller voyage intelligent
      </Button>
    </Box>

    {/* Chatbox qui s'affiche/se masque avec bordure améliorée */}
    <Collapse in={isOpen} timeout={300} unmountOnExit>
      <Paper
        elevation={3}
        className="magic-chatbot-container"
        sx={{
          width: '100%',
          borderRadius: '8px',
          overflow: 'hidden',
          zIndex: 1200,
          height: 600,
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid #0066cc',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          position: 'relative',
        }}
      >
        {/* En-tête du chat */}
        <Box sx={{ 
          padding: '12px 16px', 
          backgroundColor: '#0066cc', 
          borderBottom: '1px solid #0055bb',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            fontSize: '1rem',
            color: 'white',
            textAlign: 'center',
          }}>
            Assistant de voyage Leclerc
          </Typography>
        </Box>

        {/* Zone de conversation - Ajout de l'événement onScroll */}
        <Box
          sx={{
            flexGrow: 1,
            p: 2,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            bgcolor: '#F8F9FA',
          }}
          onScroll={handleScroll}
        >
          {messages.map((message) => {
            // Extraire les suggestions avant le rendu du message
            const extractedButtons = extractSuggestionButtons(message.text);
            const specialButtons = findDisneyButtons(message.text);
            const buttonsToShow = specialButtons.length > 0 ? specialButtons : extractedButtons;
            
            return (
              <Box
                key={message.id}
                sx={{
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '90%', // Augmenté de 80% à 90%
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: message.sender === 'user' ? '#e3f2fd' : 'white',
                    color: message.sender === 'user' ? 'inherit' : 'inherit',
                    borderBottomRightRadius: message.sender === 'user' ? 0 : 2,
                    borderBottomLeftRadius: message.sender === 'user' ? 2 : 0,
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
                    '& .markdown-content': {
                      lineHeight: 1.5,
                      fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      '& p': {
                        margin: 0,
                        marginBottom: '0.7em',
                        fontSize: '0.95rem',
                        '&:last-child': {
                          marginBottom: 0,
                        }
                      },
                      '& a': {
                        color: message.sender === 'user' ? '#0066cc' : '#0066cc',
                        textDecoration: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline',
                        }
                      },
                      
                      '& h1, & h2, & h3, & h4, & h5, & h6': {
                        margin: '0.8em 0 0.4em 0',
                        lineHeight: 1.3,
                        fontWeight: 600,
                        color: message.sender === 'user' ? '#333333' : '#222222',
                      },
                      
                      '& h1': { fontSize: '1.2rem' },
                      '& h2': { fontSize: '1.1rem' },
                      '& h3': { fontSize: '1rem' },
                      
                      '& ul, & ol': {
                        marginTop: '0.4em',
                        marginBottom: '0.7em',
                        paddingLeft: '1.6em',
                      },
                      
                      '& li': {
                        marginBottom: '0.3em',
                        fontSize: '0.95rem',
                      },
                      
                      '& strong': {
                        fontWeight: 600,
                        color: message.sender === 'user' ? '#333333' : '#222',
                      },
                      
                      '& em': {
                        fontStyle: 'italic',
                      }
                    }
                  }}
                >
                  <Box className="markdown-content">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkBreaks]}
                      rehypePlugins={[rehypeRaw]}
                      components={{
                        // Fonction pour masquer les parenthèses dans le texte
                        text: ({ children }) => {
                          // Supprime les suggestions entre parenthèses du texte affiché
                          const cleanedText = String(children).replace(/\s?\([^()]+\)/g, '');
                          return <>{cleanedText}</>;
                        },
                        
                        // Personnalisation simplifiée pour agent de voyage
                        p: ({ children }) => (
                          <Typography 
                            variant="body2" 
                            component="p" 
                            sx={{ 
                              lineHeight: 1.5,
                              fontSize: '0.95rem',
                              mb: '0.6em',
                              color: message.sender === 'user' ? 'inherit' : 'inherit',
                              '&:last-child': { mb: 0 }
                            }}
                          >
                            {children}
                          </Typography>
                        ),
                        h1: ({ children }) => (
                          <Typography 
                            variant="h6" 
                            component="h1" 
                            sx={{ 
                              mt: 1.5, 
                              mb: 1,
                              fontWeight: 600,
                              fontSize: '1.1rem',
                              color: message.sender === 'user' ? '#333333' : '#333333',
                            }}
                          >
                            {children}
                          </Typography>
                        ),
                        h2: ({ children }) => (
                          <Typography 
                            variant="subtitle1" 
                            component="h2" 
                            sx={{ 
                              mt: 1.5, 
                              mb: 0.8,
                              fontWeight: 600,
                              fontSize: '1.05rem',
                              color: message.sender === 'user' ? '#333333' : '#333333',
                            }}
                          >
                            {children}
                          </Typography>
                        ),
                        ul: ({ children }) => (
                          <Box 
                            component="ul" 
                            sx={{ 
                              pl: 2,
                              mt: 0.5,
                              mb: 0.8,
                              '& li': {
                                mb: 0.4,
                                color: message.sender === 'user' ? 'inherit' : 'inherit',
                              }
                            }}
                          >
                            {children}
                          </Box>
                        ),
                        ol: ({ children }) => (
                          <Box 
                            component="ol" 
                            sx={{ 
                              pl: 2,
                              mt: 0.5,
                              mb: 0.8,
                              '& li': {
                                mb: 0.4,
                                color: message.sender === 'user' ? 'inherit' : 'inherit',
                              }
                            }}
                          >
                            {children}
                          </Box>
                        ),
                        li: ({ children }) => (
                          <Typography 
                            component="li" 
                            variant="body2"
                            sx={{ 
                              fontSize: '0.95rem',
                              lineHeight: 1.5,
                              color: message.sender === 'user' ? 'inherit' : 'inherit',
                            }}
                          >
                            {children}
                          </Typography>
                        ),
                        a: ({ href, children }) => (
                          <a 
                            href={href} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ 
                              color: message.sender === 'user' ? '#0066cc' : '#0066cc',
                              textDecoration: 'none',
                              fontWeight: 500,
                            }}
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </Box>
                </Paper>
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 0.5,
                    color: 'text.secondary',
                    textAlign: message.sender === 'user' ? 'right' : 'left',
                  }}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>

                {/* BLOC DE GESTION DES SUGGESTIONS - MODIFIÉ */}
                {message.sender === 'assistant' && (
                  <>
                    {/* Boutons dynamiques extraits du message */}
                    {buttonsToShow.length > 0 && (
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          gap: 1,
                          mt: 1.5,
                          mb: 1,
                        }}
                      >
                        {buttonsToShow.map((suggestion, index) => (
                          <Button
                            key={`${message.id}-suggestion-${index}`}
                            onClick={() => handleSuggestionButtonClick(suggestion)}
                            variant="outlined"
                            size="small"
                            sx={{
                              borderRadius: '18px',
                              textTransform: 'none',
                              color: '#0066cc',
                              borderColor: '#0066cc',
                              backgroundColor: 'white',
                              fontSize: '0.85rem',
                              fontWeight: 500,
                              px: 1.5,
                              py: 0.5,
                              '&:hover': {
                                backgroundColor: 'rgba(0, 102, 204, 0.08)',
                                borderColor: '#0066cc',
                              }
                            }}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </Box>
                    )}
                    
                    {/* Suggestions prédéfinies pour le premier message */}
                    {message === messages[messages.length - 1] && messages.length <= 2 && (
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          gap: 1,
                          mt: 1.5,
                          mb: 1,
                        }}
                      >
                        {suggestions.map((suggestion) => (
                          <Button
                            key={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion.text)}
                            variant="outlined"
                            size="small"
                            sx={{
                              borderRadius: '4px',
                              textTransform: 'none',
                              color: 'text.primary',
                              borderColor: 'rgba(0, 0, 0, 0.23)',
                              backgroundColor: 'white',
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                borderColor: 'rgba(0, 0, 0, 0.23)',
                              }
                            }}
                          >
                            {suggestion.text}
                          </Button>
                        ))}
                      </Box>
                    )}
                  </>
                )}
                {/* FIN DU BLOC DE SUGGESTIONS */}
              </Box>
            );
          })}
          {isLoading && (
            <Box 
              sx={{ 
                alignSelf: 'flex-start', 
                maxWidth: '80%',
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'white',
                  borderBottomLeftRadius: 0,
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.7,
                    px: 1,
                    '@keyframes pulse': {
                      '0%, 100%': { 
                        transform: 'scale(0.8)',
                        opacity: 0.5,
                      },
                      '50%': { 
                        transform: 'scale(1)',
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <Box 
                    sx={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#0066cc',
                      animation: 'pulse 1.4s infinite ease-in-out',
                      animationDelay: '0s',
                    }}
                  />
                  <Box 
                    sx={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#0066cc',
                      animation: 'pulse 1.4s infinite ease-in-out',
                      animationDelay: '0.2s',
                    }}
                  />
                  <Box 
                    sx={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#0066cc',
                      animation: 'pulse 1.4s infinite ease-in-out',
                      animationDelay: '0.4s',
                    }}
                  />
                  <Typography 
                    component="span"
                    variant="body2"
                    sx={{ 
                      ml: 1,
                      color: 'text.secondary',
                      fontSize: '0.85rem'
                    }}
                  >
                    Réflexion en cours...
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Champ de saisie */}
        <Box
          sx={{
            borderTop: '1px solid #E0E0E0',
            position: 'relative',
            px: 2,
            py: 2,
            bgcolor: 'white',
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && inputValue.trim()) {
                  handleSendMessage(inputValue);
                }
              }}
              placeholder="Écrivez votre message ici..."
              inputRef={inputRef}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&.Mui-focused': {
                    '& > fieldset': {
                      borderColor: '#0066cc',
                    }
                  }
                },
                '& .MuiOutlinedInput-input': {
                  color: 'black',
                },
                '& .MuiInputBase-input': {
                  color: 'black',
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSendMessage(inputValue)}
              sx={{
                borderRadius: '20px',
                minWidth: 'auto',
                background: '#0066cc',
                border: '1px solid #0066cc',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: '#0055bb',
                  border: '1px solid #0055bb',
                },
                '&:disabled': {
                  opacity: 0.5,
                  color: 'white',
                  background: '#0066cc',
                }
              }}
              disabled={!inputValue.trim()}
            >
              <SendIcon />
            </Button>
          </Box>
        </Box>
      </Paper>
    </Collapse>
  </Box>
);
};

export default MagicAssistantButton;