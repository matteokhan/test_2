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
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';

// Imports des fichiers que nous avons créés
import { MagicAssistantButtonProps, ChatMessage, FlightSearchParams } from '../MagicAssistant/types';
import { defaultSuggestions, API_BASE_URL, resetConversation, applyFormFieldsGreyout } from '../MagicAssistant/utils';
import { MessageBubble, LoadingIndicator } from '../MagicAssistant/ChatComponents';

/**
 * Composant principal du bouton d'assistant magique
 */
// À ajouter dans MagicAssistantButton.tsx après les autres imports
// Les imports sont déjà présents, donc vous n'avez pas besoin de les ajouter à nouveau

// Mise à jour du composant MagicAssistantButton avec un nouvel effet
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
  const [buttonHovered, setButtonHovered] = useState(false);
  // Utiliser l'état externe s'il est fourni, sinon utiliser l'état interne
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  
  // Récupérer le chemin actuel pour déterminer si nous sommes sur la page de recherche aller simple
  const pathname = usePathname();
  // Détecter si nous sommes dans le formulaire aller simple ou aller-retour
  const isOneWayForm = pathname?.includes('one-way') || false;
  
  // AJOUTER CE NOUVEL EFFET: Reset la conversation quand l'utilisateur arrive sur la page /vol
  useEffect(() => {
    // Vérifier si le pathname contient '/vol'
    if (pathname && pathname.includes('/vol')) {
      // Réinitialiser les messages localement
      setMessages([]);
      
      // Réinitialiser la conversation côté serveur
      resetConversation().then(() => {
        console.log("Conversation réinitialisée automatiquement sur la page /vol");
      }).catch(error => {
        console.error("Erreur lors de la réinitialisation automatique:", error);
      });
    }
  }, [pathname]); // Dépendance au pathname pour déclencher l'effet quand il change
  
  // État pour gérer le scroll manuel de l'utilisateur
  const [userScrolling, setUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Le reste du composant reste inchangé...
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
    
    // Stocker le message dans une variable temporaire
    const messageToSend = message;
    
    // Réinitialiser les suggestions et l'input immédiatement avant d'envoyer le message
    setSelectedSuggestions([]);
    setInputValue('');
    
    // Envoyer le message ensuite
    handleSendMessage(messageToSend);
    
    // Désactiver l'état "en cours de soumission" immédiatement
    setPendingSubmission(false);
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
          // Remove any custom Authorization headers for now if they exist
        },
        credentials: 'include',  // This is important for CORS with credentials
        mode: 'cors',            // Explicitly set CORS mode
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
      let dynamicSuggestions: Array<{text: string, type?: string}> = [];
      
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
            // Make sure we handle both string[] and object[] formats
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
            suggestions: dynamicSuggestions.map((suggestionItem, index) => ({ 
              id: `dynamic-suggestion-${index}`, 
              text: typeof suggestionItem === 'string' 
                ? suggestionItem 
                : (suggestionItem.text || String(suggestionItem)),
              type: typeof suggestionItem === 'string' 
                ? undefined 
                : suggestionItem.type
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
      <Box sx={{ textAlign: 'left', mb: 1, position: 'relative' }}>
        <Button
            onClick={toggleChat}
            startIcon={<AutoAwesomeIcon fontSize="small" sx={{ color: 'white' }} />}
            variant="contained"
            onMouseEnter={() => setButtonHovered(true)}
            onMouseLeave={() => setButtonHovered(false)}
            sx={{
            textTransform: 'none',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #0066cc 0%, #3366ff 100%)',
            padding: '12px 24px',
            fontWeight: 700,
            fontSize: '1rem',
            borderRadius: '30px',
            border: 'none',
            transition: 'all 0.4s ease',
            letterSpacing: buttonHovered ? '1px' : 'normal',
            boxShadow: buttonHovered 
                ? '0 0 25px rgba(0, 102, 204, 0.8), 0 0 10px rgba(0, 102, 204, 0.4) inset' 
                : '0 4px 10px rgba(0, 0, 0, 0.2)',
            '&:hover': {
                background: 'linear-gradient(135deg, #3366ff 0%, #0066cc 100%)',
            },
            '&::after': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                opacity: buttonHovered ? 1 : 0,
                transform: buttonHovered ? 'scale(1)' : 'scale(0.5)',
                transition: 'opacity 0.5s ease, transform 0.5s ease',
            },
            zIndex: 1100
            }}
        >
            Voyagez en IA
        </Button>
      </Box>

      {/* Chatbox qui s'affiche/se masque avec bordure améliorée */}
      <Collapse in={isOpen} timeout={300} unmountOnExit>
        <Paper
            elevation={8}
            className="magic-chatbot-container"
            id="magic-chatbot-container"
            sx={{
            width: '100%',
            borderRadius: '16px',
            overflow: 'hidden',
            zIndex: 1200,
            height: 600,
            display: 'flex',
            flexDirection: 'column',
            border: 'none',
            background: 'white',
            boxShadow: isOpen 
                ? '0 10px 30px rgba(0, 102, 204, 0.2), 0 0 10px rgba(0, 102, 204, 0.1)' 
                : '0 4px 12px rgba(0,0,0,0.08)',
            position: 'relative',
            transition: 'all 0.4s ease-out',
            }}
        >
          {/* En-tête du chat */}
          <Box sx={{ 
      padding: '16px 20px', 
      background: 'linear-gradient(135deg, #0066cc 0%, #3366ff 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      '&::after': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
        opacity: 0.8,
      }
    }}>
      <Typography variant="h6" sx={{ 
        fontWeight: 600, 
        fontSize: '1.1rem',
        color: 'white',
        textAlign: 'center',
        textShadow: '0 1px 2px rgba(0,0,0,0.1)',
        letterSpacing: '0.3px',
        position: 'relative',
        zIndex: 1
      }}>
        <AutoAwesomeIcon fontSize="small" sx={{ 
          verticalAlign: 'middle', 
          mr: 1,
          animation: 'sparkle 1.5s infinite alternate',
          '@keyframes sparkle': {
            '0%': { opacity: 0.7 },
            '100%': { opacity: 1, filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.7))' }
          }
        }} />
        Assistant de voyage
      </Typography>
    </Box>

          {/* Zone de conversation - Ajout de la référence pour contrôler le scroll */}
          
    {/* 3. Remplacer le style de la zone de conversation */}
    <Box
      ref={chatContainerRef}
      sx={{
        flexGrow: 1,
        p: 2.5,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        bgcolor: '#f8fafd',
        background: 'linear-gradient(180deg, #f0f4ff 0%, #f9faff 100%)',
        scrollbarWidth: 'thin',
        scrollbarColor: '#0066cc transparent',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#bbd0e8',
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#0066cc',
        },
      }}
      onScroll={handleScroll}
    >
      {/* Le contenu des messages reste le même */}
      {messages.map((message, index) => {
        const isLastAssistantMessage = message.sender === 'assistant' && 
        messages.slice(index + 1).every(msg => msg.sender !== 'assistant');
        
        return (
          <MessageBubble 
            key={message.id}
            message={message}
            onSuggestionClick={handleSuggestionClick}
            suggestions={defaultSuggestions}
            isLastMessage={index === 0 && messages.length <= 2}
            isLastAssistantMessage={isLastAssistantMessage}
            selectedSuggestions={selectedSuggestions}
            pendingSubmission={pendingSubmission}
            setInputValue={handleDefaultSuggestionClick}
          />
        );
      })}
      {isLoading && <LoadingIndicator />}
      <div ref={messagesEndRef} />
    </Box>

    {/* 4. Remplacer le style de la zone de saisie */}
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
    
    {/* Remplacez le bouton actuel par ce code modifié */}
    <Button
      variant="contained"
      color="primary"
      onClick={() => {
        // Toujours utiliser submitSelectedSuggestions qui gère maintenant tous les cas
        submitSelectedSuggestions();
      }}
      sx={{
        borderRadius: '30px',           // Modifié: plus arrondi comme le bouton Rechercher
        padding: '8px 24px',            // Modifié: plus d'espace pour le texte
        textTransform: 'none',          // Ajouté: pour éviter les majuscules auto
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
      Envoyer
    </Button>
  </Box>
  
  {/* Le reste du code reste inchangé */}
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