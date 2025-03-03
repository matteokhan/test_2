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
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { RoundTripFlightSearchParams } from '@/types';
import dayjs from 'dayjs';

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

// Exporter l'interface pour la rendre disponible à l'importation
export interface MagicAssistantButtonProps {
  onSearch?: (params: RoundTripFlightSearchParams) => void;
}

const MagicAssistantButton: React.FC<MagicAssistantButtonProps> = ({ onSearch }) => {
  // Configuration du backend
  const API_BASE_URL = 'http://localhost:5000';
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentDate = new Date().toISOString().split('T')[0];
  
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

  // Suggestions pour aider l'utilisateur à démarrer la conversation
  const suggestions: Suggestion[] = [
    { id: 'sun', text: 'Destinations au soleil', borderColor: '#FFC107' },
    { id: 'budget', text: 'Destination économe', borderColor: '#483698' },
    { id: 'unique', text: 'Destination insolite', borderColor: '#2196F3' },
  ];

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

  // Scroll automatique vers le bas lorsque de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus sur l'input lorsque le chat s'ouvre
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }
  }, [isOpen]);

  const toggleChat = async () => {
    if (isOpen) {
      // Si on ferme le chat, réinitialiser la conversation
      setMessages([]);
      await resetConversation();
    }
    setIsOpen(!isOpen);
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
        
        // Convertir les données au format attendu par le formulaire
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
          
          // Soumettre le formulaire
          onSearch(formParams);
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

  const handleSuggestionClick = (suggestion: string) => {
    // Utiliser directement la suggestion comme texte à envoyer
    setInputValue(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', mt: 2 }}>
      {/* Bouton comme texte, aligné à gauche */}
      <Box sx={{ textAlign: 'left', mb: 1 }}>
        <Button
          onClick={toggleChat}
          startIcon={<AutoAwesomeIcon fontSize="small" />}
          disableRipple
          sx={{
            textTransform: 'none',
            color: '#505050',  // Texte en gris
            backgroundColor: 'transparent',
            padding: '4px 8px',
            fontWeight: 700, // Texte en gras
            fontSize: '0.9rem',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          }}
        >
          Rechercher avec l'IA
        </Button>
      </Box>

      {/* Chatbox qui s'affiche/se masque */}
      <Collapse in={isOpen} timeout={300} unmountOnExit>
        <Paper
          elevation={2}
          sx={{
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            zIndex: 1200,
            height: 350,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            bgcolor: '#f8f9fa',
          }}
        >
          {/* En-tête du chat */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              background: 'linear-gradient(125deg, #2845b9 0%, #483698 100%)',
              color: 'white',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SmartToyIcon />
              <Typography variant="subtitle1" fontWeight={600} sx={{ userSelect: 'none' }}>
                Assistant de voyage
              </Typography>
            </Box>
            <Button
              size="small"
              onClick={toggleChat}
              sx={{ minWidth: 'auto', color: 'white', p: 0.5 }}
            >
              <CloseIcon />
            </Button>
          </Box>

          {/* Zone de conversation */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            {/* Zone des messages */}
            <Box
              sx={{
                flexGrow: 1,
                p: 2,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
                bgcolor: '#f8f9fa',
              }}
            >
              {messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: message.sender === 'user' ? '#e3f2fd' : 'white',
                      borderBottomRightRadius: message.sender === 'user' ? 0 : 2,
                      borderBottomLeftRadius: message.sender === 'user' ? 2 : 0,
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    <Typography variant="body2">{message.text}</Typography>
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
                </Box>
              ))}
              {isLoading && (
                <Box sx={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'white',
                      borderBottomLeftRadius: 0,
                      display: 'flex',
                      gap: 0.5,
                    }}
                  >
                    <Typography component="span" sx={{ fontSize: 24 }}>
                      .
                    </Typography>
                    <Typography component="span" sx={{ fontSize: 24, animationDelay: '0.2s' }}>
                      .
                    </Typography>
                    <Typography component="span" sx={{ fontSize: 24, animationDelay: '0.4s' }}>
                      .
                    </Typography>
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Champ de saisie avec suggestions */}
            <Box
              sx={{
                borderTop: 'none',
                position: 'relative',
                px: 2,
                py: 2,
                bgcolor: '#f8f9fa',
              }}
            >
              {/* Suggestions au-dessus du champ de saisie */}
              <Fade in={messages.length <= 2}>
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: '100%',
                    left: 0,
                    right: 0,
                    display: 'flex', 
                    justifyContent: 'center',
                    pb: 1,
                  }}
                >
                  <Stack 
                    direction="row" 
                    spacing={1.5}
                  >
                    {suggestions.map((suggestion) => (
                      <Button
                        key={suggestion.id}
                        variant="outlined"
                        size="small"
                        onClick={() => handleSuggestionClick(suggestion.text)}
                        sx={{
                          textTransform: 'none',
                          whiteSpace: 'nowrap',
                          borderRadius: 20,
                          borderColor: suggestion.borderColor,
                          color: 'text.primary',
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          fontWeight: 700,
                          py: 0.5,
                          px: 1.5,
                          '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 1)',
                            borderColor: suggestion.borderColor,
                            boxShadow: `0 0 6px ${suggestion.borderColor}44`,
                          },
                        }}
                      >
                        {suggestion.text}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              </Fade>

              {/* Champ de saisie */}
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage(inputValue);
                    }
                  }}
                  placeholder="Écrivez votre message ici..."
                  inputRef={inputRef}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 25,
                      backgroundColor: 'rgba(255, 255, 255, 0.6)',
                      backdropFilter: 'blur(5px)',
                      '&.Mui-focused': {
                        '& > fieldset': {
                          borderColor: '#2845b9',
                        }
                      }
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!inputValue.trim() || isLoading}
                  onClick={() => handleSendMessage(inputValue)}
                  sx={{
                    minWidth: 'auto',
                    borderRadius: 3,
                    background: 'linear-gradient(125deg, #2845b9 0%, #483698 100%)',
                  }}
                >
                  <SendIcon />
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
};

export default MagicAssistantButton;