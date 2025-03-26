import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Participante, Despesa } from '../types';
import DetalhamentoSaldos from './DetalhamentoSaldos';

interface Props {
  participantes: Participante[];
  despesas: Despesa[];
  setDespesas: (despesas: Despesa[]) => void;
}

export default function CadastroDespesas({ participantes, despesas, setDespesas }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [descricao, setDescricao] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [pagadorId, setPagadorId] = useState('');
  const [participantesSelecionados, setParticipantesSelecionados] = useState<string[]>([]);
  const [valoresPersonalizados, setValoresPersonalizados] = useState<Record<string, string>>({});
  const [despesaEmEdicao, setDespesaEmEdicao] = useState<Despesa | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Calcula os valores iniciais quando os participantes são selecionados
  useEffect(() => {
    if (!valorTotal || participantesSelecionados.length === 0) return;

    const valorTotalNum = parseFloat(valorTotal);
    const valorPorParticipante = valorTotalNum / participantesSelecionados.length;

    const valoresIniciais = participantesSelecionados.reduce((acc, id) => {
      acc[id] = valorPorParticipante.toFixed(2);
      return acc;
    }, {} as Record<string, string>);

    setValoresPersonalizados(valoresIniciais);
  }, [participantesSelecionados, valorTotal]);

  // Recalcula os valores quando um valor personalizado é alterado
  const calcularValoresAutomaticos = (valorAlterado: string, participanteId: string) => {
    if (!valorTotal || participantesSelecionados.length === 0) return;

    const valorTotalNum = parseFloat(valorTotal);
    const valorAlteradoNum = parseFloat(valorAlterado) || 0;
    const outrosParticipantes = participantesSelecionados.filter(id => id !== participanteId);

    if (outrosParticipantes.length === 0) return;

    const valorRestante = valorTotalNum - valorAlteradoNum;
    const valorPorParticipante = valorRestante / outrosParticipantes.length;

    const novosValores = { ...valoresPersonalizados };
    novosValores[participanteId] = valorAlterado;
    outrosParticipantes.forEach(id => {
      novosValores[id] = valorPorParticipante.toFixed(2);
    });

    setValoresPersonalizados(novosValores);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao || !valorTotal || !pagadorId || participantesSelecionados.length === 0) return;

    const valorTotalNum = parseFloat(valorTotal);
    const divisao = participantesSelecionados.map((participanteId) => ({
      participanteId,
      valor: parseFloat(valoresPersonalizados[participanteId] || '0'),
    }));

    if (despesaEmEdicao) {
      // Atualiza a despesa existente
      setDespesas(despesas.map(d => 
        d.id === despesaEmEdicao.id 
          ? { ...d, descricao, valorTotal: valorTotalNum, pagadorId, divisao }
          : d
      ));
    } else {
      // Cria uma nova despesa
      const novaDespesa: Despesa = {
        id: Date.now().toString(),
        descricao,
        valorTotal: valorTotalNum,
        pagadorId,
        divisao,
      };
      setDespesas([...despesas, novaDespesa]);
    }

    limparFormulario();
  };

  const limparFormulario = () => {
    setDescricao('');
    setValorTotal('');
    setPagadorId('');
    setParticipantesSelecionados([]);
    setValoresPersonalizados({});
    setDespesaEmEdicao(null);
    setOpenDialog(false);
  };

  const handleDelete = (id: string) => {
    setDespesas(despesas.filter((d) => d.id !== id));
  };

  const handleEdit = (despesa: Despesa) => {
    setDespesaEmEdicao(despesa);
    setDescricao(despesa.descricao);
    setValorTotal(despesa.valorTotal.toString());
    setPagadorId(despesa.pagadorId);
    setParticipantesSelecionados(despesa.divisao.map(d => d.participanteId));
    setValoresPersonalizados(
      despesa.divisao.reduce((acc, d) => {
        acc[d.participanteId] = d.valor.toString();
        return acc;
      }, {} as Record<string, string>)
    );
    setOpenDialog(true);
  };

  const handleParticipanteToggle = (participanteId: string) => {
    setParticipantesSelecionados((prev) =>
      prev.includes(participanteId)
        ? prev.filter((id) => id !== participanteId)
        : [...prev, participanteId]
    );
  };

  const handleValorPersonalizadoChange = (participanteId: string, valor: string) => {
    calcularValoresAutomaticos(valor, participanteId);
  };

  const toggleOpenItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getParticipanteNome = (id: string) => {
    return participantes.find((p) => p.id === id)?.nome || 'Desconhecido';
  };

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 2,
          width: '100%'
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: isMobile ? 2 : 0,
              textAlign: 'center',
              flex: 1
            }}
          >
            Cadastrar Despesas
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenDialog(true)}
            fullWidth={isMobile}
            sx={{ minWidth: isMobile ? '100%' : 'auto' }}
          >
            Nova Despesa
          </Button>
        </Box>

        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
        >
          <DialogTitle>
            {despesaEmEdicao ? 'Editar Despesa' : 'Nova Despesa'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />

              <Stack direction={isMobile ? 'column' : 'row'} spacing={2}>
                <TextField
                  fullWidth
                  label="Valor Total"
                  type="number"
                  value={valorTotal}
                  onChange={(e) => setValorTotal(e.target.value)}
                />

                <FormControl fullWidth>
                  <InputLabel>Quem pagou?</InputLabel>
                  <Select
                    value={pagadorId}
                    onChange={(e) => setPagadorId(e.target.value)}
                    label="Quem pagou?"
                  >
                    {participantes.map((participante) => (
                      <MenuItem key={participante.id} value={participante.id}>
                        {participante.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Typography variant="subtitle1">
                Quem vai dividir?
              </Typography>
              <Stack spacing={2}>
                {participantes.map((participante) => (
                  <Paper 
                    key={participante.id} 
                    sx={{ 
                      p: 2,
                      display: 'flex',
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: isMobile ? 'flex-start' : 'center',
                      gap: 2
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={participantesSelecionados.includes(participante.id)}
                          onChange={() => handleParticipanteToggle(participante.id)}
                        />
                      }
                      label={participante.nome}
                    />
                    {participantesSelecionados.includes(participante.id) && (
                      <TextField
                        size="small"
                        label="Valor personalizado"
                        type="number"
                        value={valoresPersonalizados[participante.id] || ''}
                        onChange={(e) => handleValorPersonalizadoChange(participante.id, e.target.value)}
                        fullWidth
                      />
                    )}
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button 
              onClick={handleSubmit}
              variant="contained"
              disabled={!descricao || !valorTotal || !pagadorId || participantesSelecionados.length === 0}
            >
              {despesaEmEdicao ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogActions>
        </Dialog>

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <List>
            {despesas.map((despesa) => (
              <Box key={despesa.id}>
                <ListItemButton 
                  onClick={() => toggleOpenItem(despesa.id)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    }
                  }}
                >
                  <ListItemText
                    primary={despesa.descricao}
                    secondary={
                      <Stack 
                        direction={isMobile ? 'column' : 'row'} 
                        spacing={isMobile ? 0.5 : 2}
                        alignItems={isMobile ? 'flex-start' : 'center'}
                      >
                        <Typography variant="body2" color="text.secondary">
                          R$ {despesa.valorTotal.toFixed(2)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Pago por: {getParticipanteNome(despesa.pagadorId)}
                        </Typography>
                      </Stack>
                    }
                  />
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(despesa);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(despesa.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                    {openItems[despesa.id] ? <ExpandLess /> : <ExpandMore />}
                  </Stack>
                </ListItemButton>
                <Collapse in={openItems[despesa.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItem sx={{ pl: 4 }}>
                      <ListItemText
                        primary="Divisão da Despesa"
                        secondary={
                          <Stack spacing={1}>
                            {despesa.divisao.map((divisao) => (
                              <Box 
                                key={divisao.participanteId}
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  width: '100%'
                                }}
                              >
                                <Typography variant="body2" color="text.secondary">
                                  {getParticipanteNome(divisao.participanteId)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  R$ {divisao.valor.toFixed(2)}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        }
                      />
                    </ListItem>
                  </List>
                </Collapse>
              </Box>
            ))}
          </List>
        </Paper>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Despesas Cadastradas
          </Typography>

          {despesas.length === 0 ? (
            <Typography color="text.secondary">
              Nenhuma despesa cadastrada ainda.
            </Typography>
          ) : (
            <>
              <DetalhamentoSaldos friends={participantes} expenses={despesas} />
              
              <Box sx={{ mt: 3 }}>
                <List>
                  {despesas.map((expense) => (
                    <Box key={expense.id}>
                      <ListItemButton 
                        onClick={() => toggleOpenItem(expense.id)}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'action.hover',
                          }
                        }}
                      >
                        <ListItemText
                          primary={expense.descricao}
                          secondary={
                            <Stack 
                              direction={isMobile ? 'column' : 'row'} 
                              spacing={isMobile ? 0.5 : 2}
                              alignItems={isMobile ? 'flex-start' : 'center'}
                            >
                              <Typography variant="body2" color="text.secondary">
                                R$ {expense.valorTotal.toFixed(2)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Pago por: {getParticipanteNome(expense.pagadorId)}
                              </Typography>
                            </Stack>
                          }
                        />
                        <Stack direction="row" spacing={1} alignItems="center">
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(expense);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(expense.id);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                          {openItems[expense.id] ? <ExpandLess /> : <ExpandMore />}
                        </Stack>
                      </ListItemButton>
                      <Collapse in={openItems[expense.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          <ListItem sx={{ pl: 4 }}>
                            <ListItemText
                              primary="Divisão da Despesa"
                              secondary={
                                <Stack spacing={1}>
                                  {expense.divisao.map((divisao) => (
                                    <Box 
                                      key={divisao.participanteId}
                                      sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        width: '100%'
                                      }}
                                    >
                                      <Typography variant="body2" color="text.secondary">
                                        {getParticipanteNome(divisao.participanteId)}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        R$ {divisao.valor.toFixed(2)}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Stack>
                              }
                            />
                          </ListItem>
                        </List>
                      </Collapse>
                    </Box>
                  ))}
                </List>
              </Box>
            </>
          )}
        </Box>
      </Stack>
    </Box>
  );
} 