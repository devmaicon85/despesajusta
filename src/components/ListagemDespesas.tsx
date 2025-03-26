import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Participante, Despesa } from '../types';

interface Props {
  despesas: Despesa[];
  participantes: Participante[];
}

export default function ListagemDespesas({ despesas, participantes }: Props) {
  const getParticipanteNome = (id: string) => {
    return participantes.find((p) => p.id === id)?.nome || 'Desconhecido';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Listagem de Despesas
      </Typography>

      <List>
        {despesas.map((despesa, index) => (
          <Box key={despesa.id}>
            <ListItem>
              <ListItemText
                primary={despesa.descricao}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Valor Total: R$ {despesa.valorTotal.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pago por: {getParticipanteNome(despesa.pagadorId)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Divisão:
                    </Typography>
                    {despesa.divisao.map((divisao) => (
                      <Typography
                        key={divisao.participanteId}
                        variant="body2"
                        color="text.secondary"
                        sx={{ ml: 2 }}
                      >
                        {getParticipanteNome(divisao.participanteId)}: R${' '}
                        {divisao.valor.toFixed(2)}
                      </Typography>
                    ))}
                  </Box>
                }
              />
            </ListItem>
            {index < despesas.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Box>
  );
} 