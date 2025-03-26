import { useState, useEffect } from 'react'
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Stack, 
  useTheme, 
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
  Paper as MuiPaper
} from '@mui/material'
import CadastroParticipantes from './components/CadastroParticipantes'
import CadastroDespesas from './components/CadastroDespesas'
import ListagemTransacoes from './components/ListagemTransacoes'
import { Participante, Despesa } from './types'
import GroupIcon from '@mui/icons-material/Group'
import ReceiptIcon from '@mui/icons-material/Receipt'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);
  
  const [participantes, setParticipantes] = useState<Participante[]>(() => {
    const saved = localStorage.getItem('participantes');
    return saved ? JSON.parse(saved) : [];
  });
  const [despesas, setDespesas] = useState<Despesa[]>(() => {
    const saved = localStorage.getItem('despesas');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('participantes', JSON.stringify(participantes));
  }, [participantes]);

  useEffect(() => {
    localStorage.setItem('despesas', JSON.stringify(despesas));
  }, [despesas]);

  const renderContent = () => {
    if (isMobile) {
      switch (activeTab) {
        case 0:
          return (
            <Box sx={{ 
              width: '100vw',
              minHeight: 'calc(100vh - 120px)',
              bgcolor: 'background.paper',
              position: 'relative',
              left: '50%',
              transform: 'translateX(-50%)',
              px: 2
            }}>
              <CadastroParticipantes 
                participantes={participantes} 
                setParticipantes={setParticipantes} 
              />
            </Box>
          );
        case 1:
          return (
            <Box sx={{ 
              width: '100vw',
              minHeight: 'calc(100vh - 120px)',
              bgcolor: 'background.paper',
              position: 'relative',
              left: '50%',
              transform: 'translateX(-50%)',
              px: 2
            }}>
              <CadastroDespesas 
                participantes={participantes} 
                despesas={despesas} 
                setDespesas={setDespesas} 
              />
            </Box>
          );
        case 2:
          return (
            <Box sx={{ 
              width: '100vw',
              minHeight: 'calc(100vh - 120px)',
              bgcolor: 'background.paper',
              position: 'relative',
              left: '50%',
              transform: 'translateX(-50%)',
              px: 2
            }}>
              <ListagemTransacoes 
                participantes={participantes} 
                despesas={despesas} 
              />
            </Box>
          );
        default:
          return null;
      }
    }

    return (
      <Stack 
        spacing={3}
        sx={{ 
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
          px: 2
        }}
      >
        <Stack 
          direction="row" 
          spacing={3}
          sx={{ 
            width: '100%',
            alignItems: 'stretch'
          }}
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2,
              flex: 1,
              minWidth: 0,
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <CadastroParticipantes 
              participantes={participantes} 
              setParticipantes={setParticipantes} 
            />
          </Paper>

          <Paper 
            elevation={3} 
            sx={{ 
              p: 2,
              flex: 2,
              minWidth: 0,
              maxWidth: '100%',
              overflow: 'hidden'
            }}
          >
            <CadastroDespesas 
              participantes={participantes} 
              despesas={despesas} 
              setDespesas={setDespesas} 
            />
          </Paper>
        </Stack>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 2,
            width: '100%',
            minWidth: 0,
            overflow: 'hidden'
          }}
        >
          <ListagemTransacoes 
            participantes={participantes} 
            despesas={despesas} 
          />
        </Paper>
      </Stack>
    );
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#ffffff',
      py: { xs: 1, sm: 2 },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pb: { xs: 7, sm: 2 },
      overflow: isMobile ? 'hidden' : 'visible'
    }}>
      <Container 
        maxWidth={false}
        disableGutters={isMobile}
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: isMobile ? '100%' : 'auto',
          maxWidth: isMobile ? '100%' : '1200px'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          mb: { xs: 0.5, sm: 1 },
          px: 2,
          width: '100%',
          bgcolor: '#ffffff',
          py: isMobile ? 1 : 0
        }}>
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4zm0 36c-8.837 0-16-7.163-16-16S15.163 8 24 8s16 7.163 16 16-7.163 16-16 16z" 
              fill={theme.palette.primary.main}
            />
            <path 
              d="M24 12c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 20c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" 
              fill={theme.palette.primary.main}
              fillOpacity="0.5"
            />
            <path 
              d="M24 16c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm0 12c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" 
              fill={theme.palette.primary.main}
              fillOpacity="0.3"
            />
            <path 
              d="M24 20c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm0 4h-4v4h4v-4z" 
              fill={theme.palette.primary.main}
              fillOpacity="0.1"
            />
          </svg>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontSize: { xs: '1.75rem', sm: '2.125rem' },
              display: 'flex',
              alignItems: 'center',
              letterSpacing: '-0.5px',
              color: theme.palette.primary.main
            }}
          >
            <span style={{ fontWeight: 300 }}>despesa</span>
            <span style={{ 
              fontWeight: 700,
              color: theme.palette.primary.dark,
              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Justa</span>
          </Typography>
        </Box>

        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: theme.palette.text.secondary,
            textAlign: 'center',
            mb: { xs: 1.5, sm: 2 },
            px: 2,
            fontStyle: 'italic'
          }}
        >
          Divisão justa das despesas entre amigos
        </Typography>

        {renderContent()}
      </Container>

      {isMobile && (
        <MuiPaper 
          sx={{ 
            position: 'fixed', 
            bottom: 0, 
            left: 0, 
            right: 0,
            zIndex: 1000
          }} 
          elevation={3}
        >
          <BottomNavigation
            value={activeTab}
            onChange={(_, newValue) => {
              setActiveTab(newValue);
            }}
            showLabels
            sx={{
              '& .MuiBottomNavigationAction-root': {
                minWidth: 'auto',
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              },
            }}
          >
            <BottomNavigationAction 
              label="Amigos" 
              icon={<GroupIcon />}
            />
            <BottomNavigationAction 
              label="Despesas" 
              icon={<ReceiptIcon />}
            />
            <BottomNavigationAction 
              label="Transações" 
              icon={<AccountBalanceWalletIcon />}
            />
          </BottomNavigation>
        </MuiPaper>
      )}
    </Box>
  )
}

export default App
