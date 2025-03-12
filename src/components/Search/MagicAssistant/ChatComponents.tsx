import React from 'react';
import { 
  Typography, 
  Paper, 
  Stack, 
  Button,
  Box
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkBreaks from 'remark-breaks';
import { ChatMessage, Suggestion } from '../MagicAssistant/types';
import { findDisneyButtons } from '../MagicAssistant/utils';
import { BsBuilding, BsPerson, BsGeoAlt, BsCheck } from 'react-icons/bs';

// Interface mise à jour avec la nouvelle prop setInputValue
export interface MessageBubbleProps {
  message: ChatMessage;
  onSuggestionClick: (suggestion: string) => void;
  suggestions: Suggestion[];
  isLastMessage: boolean;
  isLastAssistantMessage: boolean;
  selectedSuggestions?: string[]; 
  pendingSubmission?: boolean;
  setInputValue?: (value: string) => void;
}

/**
 * Composant pour afficher une bulle de message dans le chat
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  onSuggestionClick, 
  suggestions,
  isLastMessage,
  isLastAssistantMessage,
  selectedSuggestions = [],
  pendingSubmission = false,
  setInputValue
}) => {

  // Extraire les suggestions avant le rendu du message
  const specialButtons = findDisneyButtons(message.text);
  const buttonsToShow = findDisneyButtons(message.text);
  const hasDynamicSuggestions = message.sender === 'assistant' && 
    message.suggestions && 
    message.suggestions.length > 0;
  const showSuggestions = message.sender === 'assistant' && 
    isLastAssistantMessage && 
    hasDynamicSuggestions;
  const shouldShowDefaultSuggestions = message.sender === 'assistant' && isLastMessage && !hasDynamicSuggestions;

  // Nouvelle fonction pour gérer le clic sur les suggestions par défaut
  const handleDefaultSuggestionClick = (text: string) => {
    if (setInputValue) {
      setInputValue(text);
    }
  };

  // Function to process the markdown content before rendering
  const processMarkdown = (content: string) => {
    // Extract the content before any suggestion JSON
    let processedContent = content;
    const suggestionJsonIndex = processedContent.indexOf("###SUGGESTIONS_JSON_START###");
    if (suggestionJsonIndex !== -1) {
      processedContent = processedContent.substring(0, suggestionJsonIndex).trim();
    }

    // CORRECTION SPÉCIFIQUE: Réparer le formatage des dates et informations de vol
    // Rechercher les motifs problématiques dans le texte et les remplacer par le format correct
    processedContent = processedContent.replace(/(\d{1,2} juin \d{4})-/g, '$1\n- ');
    
    // Fix issues with bullet point formatting
    // 1. Make sure all lines starting with - have proper spacing
    processedContent = processedContent.replace(/\n-\s*/g, '\n- ');
    
    // 2. Ensure bullet points get rendered as proper markdown list items
    processedContent = processedContent.replace(/\n- /g, '\n* ');
    
    // 3. Éviter de fusionner les lignes qui ne doivent pas l'être
    // Au lieu de supprimer tous les sauts de ligne, nous ne touchons qu'aux paragraphes standards
    let lines = processedContent.split('\n');
    let result = [];
    let inList = false;
    let tempLine = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Début d'une liste
      if (line.startsWith('*')) {
        // Si on a accumulé du texte avant, on l'ajoute
        if (tempLine) {
          result.push(tempLine);
          tempLine = '';
        }
        
        // Vérifier s'il y a des tirets internes (les dates jointes)
        if (line.includes('- ') && !line.startsWith('* ')) {
          // Séparer en plusieurs lignes
          const parts = line.split('- ');
          result.push('* ' + parts[0]);
          for (let j = 1; j < parts.length; j++) {
            result.push('* ' + parts[j]);
          }
        } else {
          result.push(line);
        }
        
        inList = true;
      }
      // Ligne vide (séparateur de paragraphe)
      else if (line === '') {
        if (tempLine) {
          result.push(tempLine);
          tempLine = '';
        }
        result.push('');
        inList = false;
      }
      // Ligne de texte normale
      else {
        if (inList) {
          // On préserve les listes
          if (tempLine) {
            result.push(tempLine);
          }
          result.push(line);
          tempLine = '';
        } else {
          // On peut concaténer les lignes de paragraphes
          if (tempLine) {
            tempLine += ' ' + line;
          } else {
            tempLine = line;
          }
        }
      }
    }
    
    // Ajouter la dernière ligne si nécessaire
    if (tempLine) {
      result.push(tempLine);
    }
    
    return result.join('\n');
  };

  // Extract the visible content (without suggestions JSON)
  const visibleContent = React.useMemo(() => {
    return processMarkdown(message.text);
  }, [message.text]);

  return (
    <Box
      key={message.id}
      sx={{
        alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
        maxWidth: '90%',
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
              text: ({ children }) => {
                return <>{children}</>;
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
                    display: 'list-item',
                    marginBottom: '0.3em',
                    '& p': {
                      margin: 0,
                    }
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
            {visibleContent}
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

      {/* BLOC DE GESTION DES SUGGESTIONS */}
      {message.sender === 'assistant' && (
        <>
          {showSuggestions ? (
            // Afficher les suggestions dynamiques générées par l'IA pour le dernier message de l'assistant
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
              {message.suggestions!.map((suggestion) => (
                <Button
                  key={suggestion.id}
                  onClick={() => onSuggestionClick(suggestion.text)}
                  variant="outlined"
                  size="small"
                  disabled={pendingSubmission}
                  sx={{
                    borderRadius: '18px',
                    textTransform: 'none',
                    color: selectedSuggestions.includes(suggestion.text) ? 'white' : '#0066cc',
                    borderColor: '#0066cc',
                    backgroundColor: selectedSuggestions.includes(suggestion.text) ? '#0066cc' : 'white',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    px: 1.5,
                    py: 0.5,
                    '&:hover': {
                      backgroundColor: selectedSuggestions.includes(suggestion.text) ? '#0066cc' : 'rgba(0, 102, 204, 0.08)',
                      borderColor: '#0066cc',
                    },
                    transition: 'all 0.2s ease',
                    opacity: pendingSubmission ? 0.7 : 1,
                    cursor: pendingSubmission ? 'not-allowed' : 'pointer'
                  }}
                >
                  {suggestion.text}
                </Button>
              ))}
            </Box>
          ) : shouldShowDefaultSuggestions ? (
            // Afficher les suggestions par défaut uniquement pour le premier message d'accueil
            // Avec le nouveau comportement: insérer dans la text area
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
                  onClick={() => handleDefaultSuggestionClick(suggestion.text)}
                  variant="outlined"
                  size="small"
                  disabled={pendingSubmission}
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
                    },
                    transition: 'all 0.2s ease',
                    opacity: pendingSubmission ? 0.7 : 1,
                    cursor: pendingSubmission ? 'not-allowed' : 'pointer'
                  }}
                >
                  {suggestion.text}
                </Button>
              ))}
            </Box>
          ) : null}
        </>
      )}
    </Box>
  );
};

/**
 * Composant pour afficher un indicateur de chargement minimaliste
 */
export const LoadingIndicator: React.FC = () => (
  <Box 
    sx={{ 
      alignSelf: 'flex-start', 
      maxWidth: '80%',
    }}
  >
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'white',
        borderBottomLeftRadius: 0,
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0, 102, 204, 0.08)',
      }}
    >
      {/* Icône animée */}
      <Box sx={{
        width: '22px',
        height: '22px',
        position: 'relative',
        mr: 2,
      }}>
        {/* Cercle qui tourne */}
        <Box sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '2px solid rgba(0, 102, 204, 0.1)',
          borderTopColor: '#0066cc',
          animation: 'spin 1.2s linear infinite',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        }} />
      </Box>

      {/* Texte simple */}
      <Typography
        variant="body2"
        sx={{
          fontSize: '0.9rem',
          fontWeight: 500,
          color: '#0066cc',
        }}
      >
        Réflexion en cours
      </Typography>
    </Paper>
  </Box>
);


/**
 * Suggestions par défaut à afficher dans le chat
 */
export const ChatSuggestions: React.FC<{
  suggestions: Suggestion[], 
  onSuggestionClick: (text: string) => void,
  selectedSuggestions?: string[],
  pendingSubmission?: boolean
}> = ({ suggestions, onSuggestionClick, selectedSuggestions = [], pendingSubmission = false }) => (
  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
    {suggestions.map((suggestion) => (
      <Button
        key={suggestion.id}
        onClick={() => onSuggestionClick(suggestion.text)}
        variant="outlined"
        size="small"
        sx={{
          borderRadius: '4px',
          padding: '4px 10px',
          textTransform: 'none',
          fontSize: '0.85rem',
          borderColor: 'rgba(0, 0, 0, 0.15)',
          color: selectedSuggestions.includes(suggestion.text) ? 'white' : 'text.primary',
          backgroundColor: selectedSuggestions.includes(suggestion.text) ? '#0066cc' : 'white',
          '&:hover': {
            backgroundColor: selectedSuggestions.includes(suggestion.text) ? '#0066cc' : 'rgba(0, 0, 0, 0.03)',
            borderColor: 'rgba(0, 0, 0, 0.25)',
          },
          transition: 'all 0.2s ease'
        }}
      >
        {suggestion.text}
      </Button>
    ))}
  </Stack>
);