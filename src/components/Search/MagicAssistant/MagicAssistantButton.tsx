'use client'

import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  TextField, 
  Paper, 
  Stack, 
  Collapse,
  IconButton
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import dayjs from 'dayjs';
import { usePathname } from 'next/navigation';

// Imports des fichiers que nous avons créés
import { MagicAssistantButtonProps, ChatMessage, FlightSearchParams } from '../MagicAssistant/types';
import { defaultSuggestions, API_BASE_URL, resetConversation, applyFormFieldsGreyout } from '../MagicAssistant/utils';
import { MessageBubble, LoadingIndicator } from '../MagicAssistant/ChatComponents';

/**
 * Composant principal du bouton d'assistant magique
 */
const MagicAssistantButton: React.FC<MagicAssistantButtonProps> = ({ 
  onSearch, 
  isOpen: externalIsOpen, 
  onToggle 
}) => {
  // État local pour isOpen (utilisé uniquement si externalIsOpen n'est pas fourni)
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
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
      // Message d'accueil simplifié qui affichera les suggestions par défaut
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
  
  // Effet pour scroller automatiquement lors de nouveaux messages
  useEffect(() => {
    if (messages.length > 0) {
      if (isLoading) {
        // Si l'assistant est en train d'écrire, toujours scroller en bas
        scrollChatToBottom();
        setUserScrolling(false);
      } else if (!userScrolling) {
        // Si l'utilisateur n'est pas en train de scroller manuellement,
        // scroller en bas quand un nouveau message arrive
        scrollChatToBottom();
      }
    }
  }, [messages, isLoading, userScrolling]);

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
    
    // Délai réduit à 3 secondes pour une meilleure expérience utilisateur
    scrollTimeoutRef.current = setTimeout(() => {
      setUserScrolling(false);
    }, 3000);
  };

  // Nettoyer le timeout lors du démontage du composant
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Petit délai pour laisser l'animation de la collapse se terminer
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus({
            // Prévenir le scroll automatique de la page lors du focus
            preventScroll: true
          });
        }
        
        // Limiter le scroll uniquement à l'intérieur du conteneur de chat
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 300);
    }
  }, [isOpen]);

  // Modifier la fonction scrollChatToBottom pour qu'elle n'affecte que le conteneur du chat
  const scrollChatToBottom = (immediate: boolean = false) => {
    if (chatContainerRef.current && !userScrolling) {
      const chatContainer = chatContainerRef.current;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  // Basculer l'état du chat (ouvert/fermé) sans provoquer de scroll
  const toggleChat = async (e?: React.MouseEvent) => {
    // Empêcher le comportement par défaut qui pourrait causer un scroll
    if (e) {
      e.preventDefault();
    }
    
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
    }
  };

  // État pour suivre les suggestions sélectionnées (multiple)
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const [pendingSubmission, setPendingSubmission] = useState<boolean>(false);

  // Gérer le clic sur une suggestion
  const handleSuggestionClick = (text: string) => {
    // Toggle la sélection de la suggestion
    setSelectedSuggestions(prev => {
      if (prev.includes(text)) {
        // Si déjà sélectionnée, la retirer
        return prev.filter(suggestion => suggestion !== text);
      } else {
        // Sinon, l'ajouter
        return [...prev, text];
      }
    });
  };
  
  // Soumettre les suggestions sélectionnées
  const submitSelectedSuggestions = () => {
    if (selectedSuggestions.length === 0 && !inputValue.trim()) return;
    
    // Marquer comme en cours de soumission pour désactiver les boutons
    setPendingSubmission(true);
    
    // Créer le message en combinant suggestions et texte saisi
    let message = "";
    
    if (selectedSuggestions.length > 0) {
      message = selectedSuggestions.join(', ');
      
      // Ajouter le texte de l'input s'il existe
      if (inputValue.trim()) {
        message += ` ${inputValue.trim()}`;
      }
    } else if (inputValue.trim()) {
      message = inputValue.trim();
    }
    
    // Envoyer le message
    handleSendMessage(message);
    
    // Réinitialiser les suggestions sélectionnées et l'input après un court délai
    setTimeout(() => {
      setSelectedSuggestions([]);
      setInputValue('');
      setPendingSubmission(false);
    }, 500);
  };

/**
 * Gère l'envoi d'un message à l'assistant
 */
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
    
    // Scroller le chat en bas après l'envoi du message
    setTimeout(() => {
      scrollChatToBottom();
    }, 50);
  
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
          formType: isOneWayForm ? 'oneWay' : 'roundTrip'
        }),
      });
  
      if (!response.ok) {
        // Vérifier si la réponse est JSON (pour les erreurs formatées)
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          if (errorData && errorData.response) {
            throw new Error(errorData.response);
          }
        }
        throw new Error(`Erreur: ${response.status}`);
      }
  
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Impossible de lire la réponse");
      
      let assistantMessage = '';
      let formData = null;
      let dynamicSuggestions: string[] = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Convertir les chunks en texte
        const chunk = new TextDecoder().decode(value);
        
        // Détection des suggestions avec les nouveaux séparateurs
        if (chunk.includes('###SUGGESTIONS_JSON_START###')) {
          const startMarker = '###SUGGESTIONS_JSON_START###';
          const endMarker = '###SUGGESTIONS_JSON_END###';
          
          const startIndex = chunk.indexOf(startMarker) + startMarker.length;
          const endIndex = chunk.indexOf(endMarker);
          
          if (startIndex > 0 && endIndex > startIndex) {
            const jsonStr = chunk.substring(startIndex, endIndex).trim();
            try {
              const suggestionsData = JSON.parse(jsonStr);
              dynamicSuggestions = suggestionsData.SUGGESTIONS || [];
              console.log("Suggestions dynamiques reçues:", dynamicSuggestions);
            } catch (e) {
              console.error("Erreur lors du parsing des suggestions:", e);
            }
            
            // Ajouter seulement le texte avant les suggestions au message
            if (startIndex - startMarker.length > 0) {
              const textBeforeSuggestions = chunk.substring(0, chunk.indexOf(startMarker)).trim();
              if (textBeforeSuggestions) {
                assistantMessage += textBeforeSuggestions;
              }
            }
            
            // Ajouter seulement le texte après les suggestions au message
            const textAfterSuggestions = chunk.substring(chunk.indexOf(endMarker) + endMarker.length).trim();
            if (textAfterSuggestions) {
              assistantMessage += textAfterSuggestions;
            }
            
            // Ne pas traiter le reste du chunk car on a déjà extrait ce qu'il faut
            continue;
          }
        }
        // Détection des données de formulaire (comme avant)
        else if (chunk.includes('{"FORM_DATA":')) {
          try {
            const jsonStart = chunk.indexOf('{"FORM_DATA":');
            const jsonEnd = chunk.lastIndexOf('}') + 1;
            const jsonString = chunk.substring(jsonStart, jsonEnd);
            formData = JSON.parse(jsonString);
            console.log("Données de formulaire reçues:", formData);
            
            // Ne pas ajouter le JSON au message
            const textBeforeJson = chunk.substring(0, jsonStart).trim();
            const textAfterJson = chunk.substring(jsonEnd).trim();
            
            if (textBeforeJson) assistantMessage += textBeforeJson;
            if (textAfterJson) assistantMessage += textAfterJson;
            
            continue;
          } catch (e) {
            console.error("Erreur lors du parsing des données de formulaire:", e);
          }
        }
        // Si c'est un chunk normal sans données spéciales, l'ajouter au message
        else if (chunk.trim()) {
          assistantMessage += chunk;
          
          // Mettre à jour le message en temps réel
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
          
          // Scroller pendant que l'assistant génère sa réponse
          scrollChatToBottom();
        }
      }
  
      // Finaliser le message avec les suggestions
      if (assistantMessage.trim()) {
        setMessages(prevMessages => {
          const filteredMessages = prevMessages.filter(msg => !msg.id.startsWith('assistant-stream-'));
          const newMessage = {
            id: `assistant-${Date.now()}`,
            text: assistantMessage.trim(),
            sender: 'assistant' as const,
            timestamp: new Date(),
            suggestions: dynamicSuggestions.map((text, index) => ({ 
              id: `dynamic-suggestion-${index}`, 
              text 
            }))
          };
          
          return [...filteredMessages, newMessage];
        });
        
        // Scroller en bas après que le message final soit généré
        setTimeout(() => {
          scrollChatToBottom();
        }, 50);
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
            const formParams: FlightSearchParams = {
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
            const formParams: FlightSearchParams = {
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
      
      // Message utilisateur convivial - on check si c'est une erreur de modération 
      // (comme vu dans les exemples d'erreurs fournis)
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Message par défaut convivial pour l'interface utilisateur
      let userFriendlyMessage = "Je suis votre assistant de voyage. Comment puis-je vous aider à rechercher un vol aujourd'hui ?";
      
      // Enregistrer l'erreur technique dans la console mais afficher un message convivial
      setMessages(prevMessages => [
        ...prevMessages,
        {
          id: `error-${Date.now()}`,
          text: userFriendlyMessage,
          sender: 'assistant',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction modifiée pour gérer le clic sur les suggestions par défaut
  const handleDefaultSuggestionClick = (text: string) => {
    // Mettre le texte dans la zone de saisie
    setInputValue(text);
    // Focus sur la zone de texte
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Rendu du composant
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
          Rechercher Intelligement
        </Button>
      </Box>

      {/* Chatbox qui s'affiche/se masque avec bordure améliorée */}
      <Collapse in={isOpen} timeout={300} unmountOnExit>
        <Paper
          elevation={3}
          className="magic-chatbot-container"
          id="magic-chatbot-container"
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

          {/* Zone de conversation - Ajout de la référence pour contrôler le scroll */}
          <Box
            ref={chatContainerRef}
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
            {messages.map((message, index) => {
                // Déterminer si ce message est le dernier message de l'assistant
                const isLastAssistantMessage = message.sender === 'assistant' && 
                messages.slice(index + 1).every(msg => msg.sender !== 'assistant');
                
                return (
                <MessageBubble 
                    key={message.id}
                    message={message}
                    onSuggestionClick={handleSuggestionClick}
                    suggestions={defaultSuggestions} // Utiliser les suggestions par défaut
                    isLastMessage={index === 0 && messages.length <= 2}
                    isLastAssistantMessage={isLastAssistantMessage}
                    selectedSuggestions={selectedSuggestions}
                    pendingSubmission={pendingSubmission}
                    setInputValue={handleDefaultSuggestionClick} // Passer la fonction pour gérer les defaultSuggestions
                />
                );
            })}
            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
            </Box>

          {/* Champ de saisie */}
          <Box sx={{ position: 'relative', px: 2, py: 2, bgcolor: 'white' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (inputValue.trim() || selectedSuggestions.length > 0)) {
                    // Utiliser submitSelectedSuggestions qui gère maintenant tous les cas
                    submitSelectedSuggestions();
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
                onClick={() => {
                  // Toujours utiliser submitSelectedSuggestions qui gère maintenant tous les cas
                  submitSelectedSuggestions();
                }}
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
                disabled={!inputValue.trim() && selectedSuggestions.length === 0}
              >
                <SendIcon />
              </Button>
            </Box>
            
            {/* Afficher les suggestions sélectionnées */}
            {selectedSuggestions.length > 0 && (
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 0.5, 
                mt: 1.5, 
                alignItems: 'center'
              }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  Sélectionnés:
                </Typography>
                {selectedSuggestions.map((suggestion, index) => (
                  <Typography
                    key={index}
                    variant="body2"
                    sx={{
                      backgroundColor: '#0066cc',
                      color: 'white',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      lineHeight: 1.2,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {suggestion}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default MagicAssistantButton;