'use client'

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Fade,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { SearchFlightFilters } from '@/types';

const NaturalLanguageFilter = ({ onApplyFilters }: { onApplyFilters?: (filters: SearchFlightFilters) => void }) => {
  const [filterText, setFilterText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  
  // Exemples de filtres suggérés
  const filterSuggestions = [
    "Vols sans escale",
    "Vols avant midi",
    "Vols avec maximum 1 escale",
    "Air France uniquement",
    "Vols de nuit"
  ];

  const handleFilterSubmit = async () => {
    if (!filterText.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Appel à l'API backend pour analyser le texte avec l'IA
      const response = await fetch('http://localhost:5000/api/analyze-filters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: filterText }),
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de l'analyse (${response.status})`);
      }
      
      const data = await response.json();
      
      // Vérifier si l'IA a renvoyé des filtres
      if (!data.filters) {
        throw new Error("L'IA n'a pas pu extraire les filtres de la requête");
      }
      
      console.log("Filtres extraits par l'IA:", data.filters);
      
      // Si un callback est fourni, appliquer les filtres renvoyés par le backend IA
      if (onApplyFilters) {
        // S'assurer que les routes sont correctement formatées si elles ne sont pas incluses
        const formattedFilters: SearchFlightFilters = {
          ...data.filters,
          routes: data.filters.routes || [
            {
              routeIndex: 0,
              departureAirports: [],
              arrivalAirports: [],
            },
            {
              routeIndex: 1,
              departureAirports: [],
              arrivalAirports: [],
            },
          ]
        };
        
        onApplyFilters(formattedFilters);
        setSuccess(true);
        
        // Garder une trace des filtres appliqués pour l'affichage
        setAppliedFilters([...appliedFilters, filterText]);
        
        // Effacer le succès après 3 secondes
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
      
      // Réinitialiser le champ après soumission réussie
      setFilterText('');
      
    } catch (error) {
      console.error("Erreur lors de l'application des filtres:", error);
      setError(error instanceof Error ? error.message : "Une erreur s'est produite");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setFilterText(suggestion);
  };

  return (
    <Paper 
      elevation={1}
      sx={{
        p: 3,
        width: '100%',
        borderRadius: 2,
        backgroundColor: '#f9f9fb',
        position: 'relative',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid rgba(0,0,0,0.05)',
      }}
    >
      {/* Messages de succès ou d'erreur */}
      {success && (
        <Fade in={success}>
          <Alert 
            severity="success" 
            sx={{ 
              position: 'absolute', 
              top: -15, 
              left: 0, 
              right: 0, 
              width: '90%', 
              mx: 'auto',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            Filtres appliqués avec succès
          </Alert>
        </Fade>
      )}
      
      {error && (
        <Fade in={!!error}>
          <Alert 
            severity="error" 
            sx={{ 
              position: 'absolute', 
              top: -15, 
              left: 0, 
              right: 0, 
              width: '90%', 
              mx: 'auto',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        </Fade>
      )}
      
      <Typography variant="body2" color="text.secondary" mb={2.5}>
        Pendant que nous cherchons vos vols, précisez vos préférences en langage simple.
        Exemple : "Vols sans escale avant midi" ou "Vols de nuit"
      </Typography>
      
      <Box sx={{ display: 'flex', mb: 2.5 }}>
        <TextField
          fullWidth
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Décrivez vos préférences de vol..."
          variant="outlined"
          size="medium"
          disabled={isProcessing}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              height: '100%'
            },
            '& .MuiInputBase-root': {
              height: '56px'
            }
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleFilterSubmit();
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleFilterSubmit}
          disabled={!filterText.trim() || isProcessing}
          startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
          sx={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9rem',
            letterSpacing: '0.5px',
            boxShadow: 'none',
            background: '#0066cc',
            height: '56px',
            minWidth: '120px',
            px: 3,
            '&.Mui-disabled': {
              background: '#0066cc',
              opacity: 0.6,
              color: 'white'
            },
            '&:hover': {
              background: '#0066cc',
              boxShadow: '0 4px 8px rgba(0, 102, 204, 0.2)',
            }
          }}
        >
          {isProcessing ? 'Analyse...' : 'Filtrer'}
        </Button>
      </Box>
      
      {/* Suggestions de filtres */}
      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
          Suggestions :
        </Typography>
        {filterSuggestions.map((suggestion) => (
          <Chip
            key={suggestion}
            label={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            variant="outlined"
            size="small"
            sx={{ 
              fontSize: '0.75rem',
              height: '28px',
              borderColor: 'rgba(0, 0, 0, 0.1)',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'rgba(40, 69, 185, 0.04)',
              }
            }}
          />
        ))}
      </Stack>
      
      {/* Affichage des filtres appliqués */}
      {appliedFilters.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
              Filtres appliqués :
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {appliedFilters.map((filter, index) => (
                <Chip
                  key={index}
                  label={filter}
                  color="primary"
                  variant="outlined"
                  size="small"
                  sx={{ 
                    fontSize: '0.75rem',
                    height: '28px'
                  }}
                />
              ))}
            </Stack>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default NaturalLanguageFilter;