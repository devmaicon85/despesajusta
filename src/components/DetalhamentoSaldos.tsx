import {
    Box,
    Card,
    CardContent,
    Divider,
    Stack,
    Typography,
    useTheme,
} from '@mui/material';
import { Participante, Despesa } from '../types';
import { formatCurrency } from '../utils/formatCurrency';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

interface DetalhamentoSaldosProps {
    friends: Participante[];
    expenses: Despesa[];
}

export default function DetalhamentoSaldos({ friends, expenses }: DetalhamentoSaldosProps) {
    const theme = useTheme();

    // Calcula o total pago por cada amigo
    const totalPagoPorAmigo = friends.map(friend => {
        const totalPago = expenses.reduce((sum, expense) => {
            if (expense.pagadorId === friend.id) {
                return sum + expense.valorTotal;
            }
            return sum;
        }, 0);

        return {
            friendId: friend.id,
            name: friend.nome,
            totalPago
        };
    });

    // Calcula o total devido por cada amigo
    const totalDevidoPorAmigo = friends.map(friend => {
        const totalDevido = expenses.reduce((sum, expense) => {
            const divisao = expense.divisao || [];
            const participanteDivisao = divisao.find(d => d.participanteId === friend.id);
            if (participanteDivisao) {
                return sum + participanteDivisao.valor;
            }
            return sum;
        }, 0);

        return {
            friendId: friend.id,
            name: friend.nome,
            totalDevido
        };
    });

    // Calcula o saldo final de cada amigo (positivo = tem a receber, negativo = tem a pagar)
    const saldoFinalPorAmigo = friends.map(friend => {
        const totalPago = totalPagoPorAmigo.find(t => t.friendId === friend.id)?.totalPago || 0;
        const totalDevido = totalDevidoPorAmigo.find(t => t.friendId === friend.id)?.totalDevido || 0;
        
        return {
            friendId: friend.id,
            name: friend.nome,
            saldo: totalPago - totalDevido
        };
    });

    // Calcula quem deve para quem
    const transferencias = [];
    const devedores = saldoFinalPorAmigo.filter(s => s.saldo < 0);
    const credores = saldoFinalPorAmigo.filter(s => s.saldo > 0);

    let devedoresTemp = [...devedores];
    let credoresTemp = [...credores];

    while (devedoresTemp.length > 0 && credoresTemp.length > 0) {
        const devedor = devedoresTemp[0];
        const credor = credoresTemp[0];

        const valorDevido = Math.min(Math.abs(devedor.saldo), credor.saldo);

        if (valorDevido > 0) {
            transferencias.push({
                de: devedor.name,
                para: credor.name,
                valor: valorDevido
            });
        }

        if (Math.abs(devedor.saldo) === valorDevido) {
            devedoresTemp.shift();
        } else {
            devedoresTemp[0] = { ...devedor, saldo: devedor.saldo + valorDevido };
        }

        if (credor.saldo === valorDevido) {
            credoresTemp.shift();
        } else {
            credoresTemp[0] = { ...credor, saldo: credor.saldo - valorDevido };
        }
    }

    return (
        <Stack spacing={3}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        <TrendingUpIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Total Pago por Amigo
                    </Typography>
                    <Stack spacing={1}>
                        {totalPagoPorAmigo.map((amigo) => (
                            <Box key={amigo.friendId} display="flex" justifyContent="space-between">
                                <Typography>{amigo.name}</Typography>
                                <Typography fontWeight="bold" color={theme.palette.success.main}>
                                    {formatCurrency(amigo.totalPago)}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        <TrendingDownIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Total Devido por Amigo
                    </Typography>
                    <Stack spacing={1}>
                        {totalDevidoPorAmigo.map((amigo) => (
                            <Box key={amigo.friendId} display="flex" justifyContent="space-between">
                                <Typography>{amigo.name}</Typography>
                                <Typography fontWeight="bold" color={theme.palette.error.main}>
                                    {formatCurrency(amigo.totalDevido)}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        <AccountBalanceIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                        Saldo Final
                    </Typography>
                    <Stack spacing={1}>
                        {saldoFinalPorAmigo.map((amigo) => (
                            <Box key={amigo.friendId} display="flex" justifyContent="space-between">
                                <Typography>{amigo.name}</Typography>
                                <Typography 
                                    fontWeight="bold" 
                                    color={amigo.saldo >= 0 ? theme.palette.success.main : theme.palette.error.main}
                                >
                                    {formatCurrency(amigo.saldo)}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </CardContent>
            </Card>

            {transferencias.length > 0 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Transferências Sugeridas
                        </Typography>
                        <Stack spacing={2}>
                            {transferencias.map((transferencia, index) => (
                                <Box key={index}>
                                    <Stack 
                                        direction="row" 
                                        spacing={1} 
                                        alignItems="center"
                                        justifyContent="space-between"
                                    >
                                        <Typography color="text.secondary">
                                            {transferencia.de}
                                        </Typography>
                                        <ArrowForwardIcon color="action" />
                                        <Typography color="text.secondary">
                                            {transferencia.para}
                                        </Typography>
                                        <Typography fontWeight="bold">
                                            {formatCurrency(transferencia.valor)}
                                        </Typography>
                                    </Stack>
                                    {index < transferencias.length - 1 && <Divider sx={{ mt: 2 }} />}
                                </Box>
                            ))}
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </Stack>
    );
} 