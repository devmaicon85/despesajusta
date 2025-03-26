import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { Participante, Despesa, Transacao } from '../types';

interface Props {
  despesas: Despesa[];
  participantes: Participante[];
}

export default function ListagemTransacoes({ despesas, participantes }: Props) {
  const calcularTransacoes = (): Transacao[] => {
    const saldos: Record<string, number> = {};
    const transacoes: Transacao[] = [];

    // Inicializa os saldos de todos os participantes
    participantes.forEach((participante) => {
      saldos[participante.id] = 0;
    });

    // Calcula o saldo de cada participante
    despesas.forEach((despesa) => {
      // Adiciona o valor total ao pagador
      saldos[despesa.pagadorId] += despesa.valorTotal;

      // Subtrai os valores individuais de cada participante
      despesa.divisao.forEach((divisao) => {
        saldos[divisao.participanteId] -= divisao.valor;
      });
    });

    // Encontra os participantes que devem e que devem receber
    const devedores: { id: string; valor: number }[] = [];
    const credores: { id: string; valor: number }[] = [];

    Object.entries(saldos).forEach(([id, saldo]) => {
      if (saldo < 0) {
        devedores.push({ id, valor: Math.abs(saldo) });
      } else if (saldo > 0) {
        credores.push({ id, valor: saldo });
      }
    });

    // Ordena devedores e credores por valor
    devedores.sort((a, b) => b.valor - a.valor);
    credores.sort((a, b) => b.valor - a.valor);

    // Calcula as transações necessárias
    let devedorIndex = 0;
    let credorIndex = 0;

    while (devedorIndex < devedores.length && credorIndex < credores.length) {
      const devedor = devedores[devedorIndex];
      const credor = credores[credorIndex];

      const valorTransacao = Math.min(devedor.valor, credor.valor);

      transacoes.push({
        de: devedor.id,
        para: credor.id,
        valor: valorTransacao,
      });

      devedor.valor -= valorTransacao;
      credor.valor -= valorTransacao;

      if (devedor.valor === 0) devedorIndex++;
      if (credor.valor === 0) credorIndex++;
    }

    return transacoes;
  };

  const getParticipanteNome = (id: string) => {
    return participantes.find((p) => p.id === id)?.nome || 'Desconhecido';
  };

  const transacoes = calcularTransacoes();

  return (
    <Box>
      <Typography 
        variant="h6" 
        gutterBottom
        sx={{ 
          textAlign: 'center',
          mb: 3
        }}
      >
        Quem deve pagar para quem
      </Typography>

      <List>
        {transacoes.map((transacao, index) => (
          <Box key={`${transacao.de}-${transacao.para}-${index}`}>
            <ListItem>
              <ListItemText
                primary={`${getParticipanteNome(transacao.de)} deve pagar para ${getParticipanteNome(
                  transacao.para
                )}`}
                secondary={`R$ ${transacao.valor.toFixed(2)}`}
              />
            </ListItem>
            {index < transacoes.length - 1 && <Divider />}
          </Box>
        ))}
      </List>
    </Box>
  );
} 