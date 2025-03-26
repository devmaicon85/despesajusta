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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Participante } from '../types';

interface Props {
  participantes: Participante[];
  setParticipantes: (participantes: Participante[]) => void;
}

export default function CadastroParticipantes({ participantes, setParticipantes }: Props) {
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
      <Typography variant="h6" gutterBottom>
        Cadastrar Participantes
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Nome do Participante"
          value={novoParticipante}
          onChange={(e) => setNovoParticipante(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!novoParticipante.trim()}
        >
          Adicionar Participante
        </Button>
      </Box>

      <List>
        {participantes.map((participante) => (
          <ListItem key={participante.id}>
            <ListItemText primary={participante.nome} />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(participante.id)}
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