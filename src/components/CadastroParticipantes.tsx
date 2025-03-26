import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Participante } from '../types';

interface Props {
  participantes: Participante[];
  setParticipantes: (participantes: Participante[]) => void;
}

export default function CadastroParticipantes({ participantes, setParticipantes }: Props) {
  const theme = useTheme();
  const [novoParticipante, setNovoParticipante] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoParticipante.trim()) return;

    const novoParticipanteObj: Participante = {
      id: Date.now().toString(),
      nome: novoParticipante.trim(),
    };

    setParticipantes([...participantes, novoParticipanteObj]);
    setNovoParticipante('');
  };

  const handleDelete = (id: string) => {
    setParticipantes(participantes.filter((p) => p.id !== id));
  };

  return (
    <Box>
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          color: theme.palette.text.primary,
          fontWeight: 600,
          textAlign: 'center',
          mb: 3
        }}
      >
        Cadastrar Amigos
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Nome do Amigo"
          value={novoParticipante}
          onChange={(e) => setNovoParticipante(e.target.value)}
          sx={{ 
            mb: 2,
            '& .MuiInputLabel-root': {
              color: theme.palette.text.secondary,
            },
            '& .MuiOutlinedInput-root': {
              color: theme.palette.text.primary,
            }
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!novoParticipante.trim()}
        >
          Adicionar Amigo
        </Button>
      </Box>

      <List>
        {participantes.map((participante) => (
          <ListItem 
            key={participante.id}
            sx={{
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              }
            }}
          >
            <ListItemText 
              primary={participante.nome}
              sx={{
                '& .MuiListItemText-primary': {
                  color: theme.palette.text.primary,
                }
              }}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(participante.id)}
                sx={{
                  color: theme.palette.error.main,
                  '&:hover': {
                    backgroundColor: theme.palette.error.light,
                  }
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
} 