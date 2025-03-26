import { Box, Typography } from '@mui/material';
import { Participante, Despesa } from '../types';
import DetalhamentoSaldos from './DetalhamentoSaldos';

interface Props {
  participantes: Participante[];
  despesas: Despesa[];
}

export default function ListagemTransacoes({ participantes, despesas }: Props) {
  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Typography variant="h6" gutterBottom>
        Detalhamento de Transações
      </Typography>

      {despesas.length === 0 ? (
        <Typography color="text.secondary">
          Nenhuma transação disponível ainda.
        </Typography>
      ) : (
        <DetalhamentoSaldos friends={participantes} expenses={despesas} />
      )}
    </Box>
  );
} 