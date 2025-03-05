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
import remarkGfm from 'remark-gfm';  // Pour les tables et autres fonctionnalités GitHub
import rehypeRaw from 'rehype-raw';  // Pour le HTML brut
import remarkBreaks from 'remark-breaks';  // Pour les sauts de ligne
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

  // Suggestions pour aider l'utilisateur à démarrer la conversation
  const suggestions: Suggestion[] = [
    { id: 'sun', text: 'Destinations au soleil', borderColor: '#FFC107' },
    { id: 'budget', text: 'Destination à petit budget', borderColor: '#483698' },
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

  // Scroll automatique vers le bas avec comportement amélioré
  useEffect(() => {
    // Ne faire défiler automatiquement que si l'utilisateur n'est pas en train de scroller manuellement
    // ET uniquement pour le message initial ou les réponses de l'assistant (pas après envoi de message utilisateur)
    if (!userScrolling && messagesEndRef.current && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      
      // Scroller doucement uniquement pour les messages de l'assistant ou le premier message
      if (lastMessage.sender === 'assistant' || messages.length === 1) {
        // Utiliser scrollIntoView avec alignToTop:false pour éviter de centrer le champ de texte
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'end',  // Aligner avec le bas plutôt qu'au centre
          inline: 'nearest'
        });
      }
    }
  }, [messages, userScrolling]);

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
    // Créer des phrases complètes pour chaque suggestion
    let promptText = suggestion;
    
    if (suggestion === "Destinations au soleil") {
      promptText = "Je cherche une destination où il fait chaud et ensoleillé. Des idées ?";
    } else if (suggestion === "Destination à petit budget") {
      promptText = "Quelles sont les destinations les moins chères pour voyager en ce moment ?";
    } else if (suggestion === "Destination insolite") {
      promptText = "Suggérez-moi des destinations originales que peu de gens connaissent.";
    }
    
    // Définir le texte comme valeur d'entrée
    setInputValue(promptText);
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
          elevation={1}
          sx={{
            width: '100%',
            borderRadius: 1,  // Arrondi léger et cohérent
            overflow: 'hidden',
            zIndex: 1200,
            height: 350,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'none',
            bgcolor: 'white',
          }}
        >
          {/* Zone de conversation - Ajout de l'événement onScroll */}
          <Box
            sx={{
              flexGrow: 1,
              p: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
              bgcolor: 'white',
            }}
            onScroll={handleScroll}
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
                    '& .markdown-content': {
                      color: '#333333',
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
                        color: '#0066cc',
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
                        color: '#222222',
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
                        color: '#222',
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
                        // Personnalisation simplifiée pour agent de voyage
                        p: ({ children }) => (
                          <Typography 
                            variant="body2" 
                            component="p" 
                            sx={{ 
                              lineHeight: 1.5,
                              fontSize: '0.95rem',
                              mb: '0.6em',
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
                              color: '#0066cc',
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
              </Box>
            ))}
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

          {/* Champ de saisie avec suggestions */}
          <Box
            sx={{
              borderTop: 'none',
              position: 'relative',
              px: 1,
              py: 1,
              bgcolor: 'white',
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
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      variant="outlined"
                      size="small"
                      sx={{
                        borderRadius: '4px',  // Même arrondi que dans le formulaire
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
                    borderRadius: 1,  // Même arrondi que partout ailleurs
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&.Mui-focused': {
                      '& > fieldset': {
                        borderColor: '#0066cc',
                      }
                    }
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSendMessage(inputValue)}
                sx={{
                  borderRadius: 1,  // Même arrondi
                  minWidth: 'auto',
                  background: '#0066cc',
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