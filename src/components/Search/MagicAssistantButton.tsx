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
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import SmartToyIcon from '@mui/icons-material/SmartToy';

interface Suggestion {
  id: string;
  text: string;
  borderColor: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

// Composant d'animation de chargement avec effet d'écriture
const TypingIndicator: React.FC = () => {
  const [dots, setDots] = useState('.');
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => {
        if (prevDots === '...') return '.';
        return prevDots + '.';
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Box
      sx={{
        alignSelf: 'flex-start',
        maxWidth: '80%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          bgcolor: 'white',
          borderBottomLeftRadius: 0,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)',
          minWidth: '3rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Typography
          component="span"
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'text.secondary',
            letterSpacing: '2px',
          }}
        >
          {dots}
        </Typography>
      </Box>
    </Box>
  );
};

const MagicAssistantButton: React.FC = () => {
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

  const suggestions: Suggestion[] = [
    { id: 'sun', text: 'Destinations au soleil', borderColor: '#FFC107' },
    { id: 'budget', text: 'Destination économe', borderColor: '#483698' },
    { id: 'unique', text: 'Destination insolite', borderColor: '#2196F3' },
  ];

  // Envoyer un message initial lorsque le chat s'ouvre
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Ajout d'un petit délai pour simuler une réponse naturelle
      const timer = setTimeout(() => {
        setMessages([
          {
            id: 'welcome',
            text: "Bonjour ! Je suis votre assistant de voyage. Comment puis-je vous aider dans votre recherche de vol aujourd'hui ?",
            sender: 'assistant',
            timestamp: new Date(),
          },
        ]);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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

  const toggleChat = async (event?: React.MouseEvent<HTMLElement>) => {
    // Prévenir le comportement par défaut pour éviter le scroll
    if (event) {
      event.preventDefault();
    }
    
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
      // Appel à l'API backend avec l'URL configurable
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
      let flightResults = null;
      let streamingMessageId = `assistant-stream-${Date.now()}`;
      
      // Créer un message vide pour commencer le streaming
      // Au lieu d'ajouter un nouveau message, vérifier d'abord si l'indicateur de chargement est actif
      setMessages(prevMessages => {
        // Si isLoading est true, c'est qu'on n'a pas encore de message de streaming
        return [
          ...prevMessages,
          {
            id: streamingMessageId,
            text: "",
            sender: 'assistant',
            timestamp: new Date(),
          }
        ];
      });
      
      const textDecoder = new TextDecoder();
      
      // Important: désactiver l'indicateur de chargement dès que le streaming commence
      setIsLoading(false);
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Convertir les chunks en texte
        const chunk = textDecoder.decode(value);
        
        // Vérifier si le chunk contient des résultats de vol (JSON)
        if (chunk.includes('{"FLIGHT_RESULTS":')) {
          try {
            const jsonStart = chunk.indexOf('{"FLIGHT_RESULTS":');
            const jsonEnd = chunk.lastIndexOf('}') + 1;
            const jsonString = chunk.substring(jsonStart, jsonEnd);
            flightResults = JSON.parse(jsonString);
            console.log("Résultats de vol reçus:", flightResults);
            // Ne pas ajouter cette partie JSON à la réponse affichée
            continue;
          } catch (e) {
            console.error("Erreur lors du parsing des résultats:", e);
          }
        } else if (chunk.startsWith('\n{') && chunk.endsWith('}\n')) {
          // Détection d'un JSON intermédiaire (données de requête) - ne pas l'afficher
          try {
            const jsonString = chunk.trim();
            const requestData = JSON.parse(jsonString);
            console.log("Données de requête intermédiaires:", requestData);
          } catch (e) {
            console.error("Erreur lors du parsing des données intermédiaires:", e);
          }
          continue;
        }
        
        // Ajouter le texte au message s'il y a du contenu
        if (chunk.trim()) {
          assistantMessage += chunk;
          
          // Mettre à jour le message de l'assistant en temps réel avec un effet de "typing"
          setMessages(prevMessages => {
            return prevMessages.map(msg => 
              msg.id === streamingMessageId
                ? { ...msg, text: assistantMessage }
                : msg
            );
          });
          
          // Faire défiler automatiquement vers le bas
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // Finaliser le message de l'assistant en remplaçant l'ID temporaire par un ID définitif
      if (assistantMessage.trim()) {
        setMessages(prevMessages => {
          return prevMessages.map(msg => 
            msg.id === streamingMessageId
              ? { 
                  ...msg, 
                  id: `assistant-${Date.now()}`,
                  text: assistantMessage.trim() 
                }
              : msg
          );
        });
      }

      // Si nous avons reçu des résultats de vol, afficher un message spécial
      if (flightResults && flightResults.FLIGHT_RESULTS && flightResults.FLIGHT_RESULTS.length > 0) {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            id: `results-${Date.now()}`,
            text: "J'ai trouvé des vols correspondant à votre recherche ! Consultez les résultats ci-dessus.",
            sender: 'assistant',
            timestamp: new Date(),
          },
        ]);
      } else if (flightResults && (!flightResults.FLIGHT_RESULTS || flightResults.FLIGHT_RESULTS.length === 0)) {
        setMessages(prevMessages => [
          ...prevMessages,
          {
            id: `no-results-${Date.now()}`,
            text: "Je n'ai pas trouvé de vols correspondant à votre recherche. Pouvez-vous essayer avec d'autres critères ?",
            sender: 'assistant',
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      console.error("URL appelée:", `${API_BASE_URL}/api/chatbot`);
      
      // Désactiver l'indicateur de chargement
      setIsLoading(false);
      
      // Pour les erreurs, vérifier si un message de streaming a déjà été créé
      setMessages(prevMessages => {
        // Filtrer les messages de streaming qui pourraient être vides
        const filteredMessages = prevMessages.filter(
          msg => !(msg.id.startsWith('assistant-stream-') && msg.text === "")
        );
        
        return [
          ...filteredMessages,
          {
            id: `error-${Date.now()}`,
            text: "Désolé, une erreur s'est produite lors de la communication avec l'assistant. Veuillez réessayer.",
            sender: 'assistant',
            timestamp: new Date(),
          },
        ];
      });
    } finally {
      // Note: Ne pas définir isLoading à false ici, car il est défini au début du streaming
      // ou dans le bloc catch si une erreur se produit
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    // Phrase complète basée sur la suggestion
    let completePhrase = "";
    
    if (suggestion === "Destinations au soleil") {
      completePhrase = "Je recherche des destinations ensoleillées pour mes vacances. Que me suggérez-vous ?";
    } else if (suggestion === "Destination économe") {
      completePhrase = "Quelles sont les meilleures destinations pour voyager à petit budget ?";
    } else if (suggestion === "Destination insolite") {
      completePhrase = "J'aimerais découvrir des destinations originales et peu connues. Avez-vous des idées ?";
    } else {
      completePhrase = suggestion; // Par défaut
    }
    
    // Remplir le champ de texte avec la phrase complète
    setInputValue(completePhrase);
    // Focus sur l'input pour que l'utilisateur puisse modifier ou envoyer
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Box sx={{ position: 'relative', width: '100%', mt: 2 }}>
      {/* Texte gris simple avec icône au lieu du bouton */}
      <Box
        onClick={toggleChat}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 1,
          padding: '12px 0',
          margin: '0 0 8px 0',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          width: 'fit-content',
          zIndex: 1201,
        }}
      >
        <AutoAwesomeIcon sx={{ fontSize: 18, color: '#666' }} />
        <Typography 
          sx={{ 
            color: '#666', 
            fontWeight: 400,
            fontSize: '0.9rem',
            userSelect: 'none'
          }}
        >
          Utilisez moi
        </Typography>
      </Box>

      {/* Chatbox qui s'affiche/se masque */}
      <Collapse in={isOpen} timeout={300} unmountOnExit>
        <Paper
          elevation={0} // Enlevé l'élévation pour un aspect plus plat
          sx={{
            width: '100%',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            overflow: 'hidden',
            zIndex: 1200,
            height: 350, // Hauteur réduite selon le screenshot
            display: 'flex',
            flexDirection: 'column',
            mt: 0, // Supprimé le margin négatif
            border: 'none', // Enlevé la bordure visible
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // Ombre légère
            bgcolor: '#f8f9fa', // Fond légèrement grisé comme dans le screenshot
          }}
        >
          {/* En-tête du chat */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              background: 'linear-gradient(125deg, #2845b9 0%, #483698 100%)', // Même gradient que le bouton
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

          {/* Réorganisation pour éliminer les marges: zone de message suivie directement par le champ de saisie */}
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
                    {/* Fonction pour formatter les réponses riches */}
                    {(() => {
                      // Cas spécifique: réponse formatée avec "destinations immanquables"
                      if (message.text.includes("destinations immanquables")) {
                        return (
                          <Box sx={{ color: 'text.primary' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                              Pour vos vacances ensoleillées, je vous propose ces destinations immanquables :
                            </Typography>
                            
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2845b9', mt: 1 }}>
                              Destinations proches de l'Europe :
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1, ml: 1 }}>
                              <Typography variant="body2"><b>Îles Canaries (Espagne)</b> : Soleil toute l'année, parfait pour randonner ou profiter de plages spectaculaires.</Typography>
                              <Typography variant="body2"><b>Malte</b> : Une petite île méditerranéenne chargée d'histoire et de plages magnifiques.</Typography>
                              <Typography variant="body2"><b>Grèce (Santorin, Rhodes ou Crète)</b> : Des paysages idylliques dignes de cartes postales, avec une mer cristalline.</Typography>
                            </Box>
                            
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2845b9', mt: 1 }}>
                              Tropicales et exotiques :
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1, ml: 1 }}>
                              <Typography variant="body2"><b>Antilles françaises</b> : Idéal pour un dépaysement tropical sous le soleil des Caraïbes.</Typography>
                              <Typography variant="body2"><b>Thaïlande (Phuket, Koh Samui)</b> : Des plages sublimes et une culture inoubliable.</Typography>
                              <Typography variant="body2"><b>Bali (Indonésie)</b> : Une combinaison de plages paradisiaques, de rizières et de lieux spirituels.</Typography>
                            </Box>
                            
                            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2845b9', mt: 1 }}>
                              Hors des sentiers battus :
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1, ml: 1 }}>
                              <Typography variant="body2"><b>Cap-Vert</b> : Une destination pour allier soleil, plages et culture africaine.</Typography>
                              <Typography variant="body2"><b>Mexique (Cancún, Tulum)</b> : Des plages blanches et des sites archéologiques fascinants.</Typography>
                              <Typography variant="body2"><b>Maldives</b> : Pour un luxe et un calme absolu dans des paysages paradisiaques.</Typography>
                            </Box>
                            
                            <Typography variant="body2" sx={{ fontWeight: 600, mt: 2, color: '#2845b9' }}>
                              Pour personnaliser davantage votre recherche, pouvez-vous me préciser :
                            </Typography>
                            <Box sx={{ ml: 1, mt: 0.5 }}>
                              <Typography variant="body2">1. Vos dates de voyage idéales (départ et retour) ?</Typography>
                              <Typography variant="body2">2. Votre aéroport de départ ?</Typography>
                              <Typography variant="body2">3. Avec combien d'adultes/enfants voyagez-vous ?</Typography>
                              <Typography variant="body2">4. Un budget ou une compagnie aérienne en tête ?</Typography>
                            </Box>
                            
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              Dites-moi vos préférences, et je vous aiderai à planifier ce voyage vers le soleil parfait ! 🌞
                            </Typography>
                          </Box>
                        );
                      } 
                      // Détection générique des formats markdown/structurés
                      else if (message.sender === 'assistant' && 
                        (message.text.includes('###') || 
                         message.text.includes('**') || 
                         message.text.includes('1. ') || 
                         message.text.includes('- '))) {
                        
                        // Préparation du texte
                        const lines = message.text.split('\n');
                        
                        return (
                          <Box sx={{ color: 'text.primary' }}>
                            {lines.map((line, index) => {
                              // Titres (###)
                              if (line.startsWith('###')) {
                                return (
                                  <Typography key={index} variant="subtitle2" 
                                    sx={{ fontWeight: 600, color: '#2845b9', mt: 1.5, mb: 0.5 }}>
                                    {line.replace(/^###\s*/, '')}
                                  </Typography>
                                );
                              }
                              // Sous-titres (##) 
                              else if (line.startsWith('##')) {
                                return (
                                  <Typography key={index} variant="subtitle1" 
                                    sx={{ fontWeight: 600, color: '#2845b9', mt: 2, mb: 0.5 }}>
                                    {line.replace(/^##\s*/, '')}
                                  </Typography>
                                );
                              }
                              // Éléments de liste numérotée
                              else if (/^\d+\.\s/.test(line)) {
                                const content = line.replace(/^\d+\.\s/, '');
                                // Text avec styling bold (**texte**)
                                const parts = content.split(/(\*\*[^*]+\*\*)/g);
                                
                                // Extraction sécurisée du numéro
                                const matches = line.match(/^\d+/);
                                const number = matches ? matches[0] : "•";
                                
                                return (
                                  <Box key={index} sx={{ display: 'flex', ml: 1, mb: 0.5 }}>
                                    <Typography variant="body2" sx={{ minWidth: '18px' }}>
                                      {number}.
                                    </Typography>
                                    <Typography variant="body2">
                                      {parts.map((part, i) => {
                                        if (part.startsWith('**') && part.endsWith('**')) {
                                          return <b key={i}>{part.slice(2, -2)}</b>;
                                        }
                                        return <span key={i}>{part}</span>;
                                      })}
                                    </Typography>
                                  </Box>
                                );
                              }
                              // Éléments de liste à puces
                              else if (line.startsWith('- ') || line.startsWith('* ')) {
                                const content = line.replace(/^[-*]\s/, '');
                                return (
                                  <Box key={index} sx={{ display: 'flex', ml: 1, mb: 0.5 }}>
                                    <Typography variant="body2" sx={{ minWidth: '18px' }}>•</Typography>
                                    <Typography variant="body2">{content}</Typography>
                                  </Box>
                                );
                              }
                              // Texte avec emphasis (**texte**)
                              else if (line.includes('**')) {
                                const parts = line.split(/(\*\*[^*]+\*\*)/g);
                                return (
                                  <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                                    {parts.map((part, i) => {
                                      if (part.startsWith('**') && part.endsWith('**')) {
                                        return <b key={i}>{part.slice(2, -2)}</b>;
                                      }
                                      return <span key={i}>{part}</span>;
                                    })}
                                  </Typography>
                                );
                              }
                              // Ligne vide
                              else if (line.trim() === '') {
                                return <Box key={index} sx={{ height: '8px' }} />;
                              }
                              // Texte normal
                              else {
                                return (
                                  <Typography key={index} variant="body2" sx={{ mb: 0.5 }}>
                                    {line}
                                  </Typography>
                                );
                              }
                            })}
                          </Box>
                        );
                      } 
                      // Texte simple
                      else {
                        return <Typography variant="body2">{message.text}</Typography>;
                      }
                    })()}
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
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </Box>

            {/* Champ de saisie avec suggestions à l'intérieur */}
            <Box
              sx={{
                borderTop: 'none',
                position: 'relative', // Pour le positionnement absolu des suggestions
                px: 2,
                py: 2,
                bgcolor: '#f8f9fa',
              }}
            >
              {/* Positionnement absolu des suggestions au-dessus du champ de saisie */}
              <Fade in={messages.length <= 2}>
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: '100%', // Placer juste au-dessus du champ de saisie
                    left: 0,
                    right: 0,
                    display: 'flex', 
                    justifyContent: 'center',
                    pb: 1, // Petit espacement en bas
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