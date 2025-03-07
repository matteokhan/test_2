'use client'

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
import { extractSuggestionButtons, findDisneyButtons } from '../MagicAssistant/utils';

// Interface mise à jour avec la nouvelle prop selectedSuggestions
export interface MessageBubbleProps {
  message: ChatMessage;
  onSuggestionClick: (suggestion: string) => void;
  suggestions: Suggestion[];
  isLastMessage: boolean;
  selectedSuggestions?: string[]; // Tableau pour sélection multiple
  pendingSubmission?: boolean;    // Pour désactiver les boutons pendant la soumission
}

/**
 * Composant pour afficher une bulle de message dans le chat
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  onSuggestionClick, 
  suggestions,
  isLastMessage,
  selectedSuggestions = [], // Valeur par défaut tableau vide
  pendingSubmission = false
}) => {
  // Extraire les suggestions avant le rendu du message
  const extractedButtons = extractSuggestionButtons(message.text);
  const specialButtons = findDisneyButtons(message.text);
  const buttonsToShow = specialButtons.length > 0 ? specialButtons : extractedButtons;

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

      {/* BLOC DE GESTION DES SUGGESTIONS */}
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
                  onClick={() => onSuggestionClick(suggestion)}
                  variant="outlined"
                  size="small"
                  disabled={pendingSubmission}
                  sx={{
                    borderRadius: '18px',
                    textTransform: 'none',
                    color: selectedSuggestions.includes(suggestion) ? 'white' : '#0066cc',
                    borderColor: '#0066cc',
                    backgroundColor: selectedSuggestions.includes(suggestion) ? '#0066cc' : 'white',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    px: 1.5,
                    py: 0.5,
                    '&:hover': {
                      backgroundColor: selectedSuggestions.includes(suggestion) ? '#0066cc' : 'rgba(0, 102, 204, 0.08)',
                      borderColor: '#0066cc',
                    },
                    transition: 'all 0.2s ease',
                    opacity: pendingSubmission ? 0.7 : 1,
                    cursor: pendingSubmission ? 'not-allowed' : 'pointer'
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </Box>
          )}
          
          {/* Suggestions prédéfinies pour le premier message */}
          {isLastMessage && (
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
                  onClick={() => onSuggestionClick(suggestion.text)}
                  variant="outlined"
                  size="small"
                  disabled={pendingSubmission}
                  sx={{
                    borderRadius: '4px',
                    textTransform: 'none',
                    color: selectedSuggestions.includes(suggestion.text) ? 'white' : 'text.primary',
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                    backgroundColor: selectedSuggestions.includes(suggestion.text) ? '#0066cc' : 'white',
                    '&:hover': {
                      backgroundColor: selectedSuggestions.includes(suggestion.text) ? '#0066cc' : 'rgba(0, 0, 0, 0.02)',
                      borderColor: selectedSuggestions.includes(suggestion.text) ? '#0066cc' : 'rgba(0, 0, 0, 0.23)',
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
          )}
        </>
      )}
    </Box>
  );
};

/**
 * Composant pour afficher un indicateur de chargement pendant que l'assistant génère une réponse
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