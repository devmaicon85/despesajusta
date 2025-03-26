import { useState, useEffect } from 'react';
import {
  Snackbar,
  Button,
  Box,
  Typography,
  Stack,
} from '@mui/material';
import InstallIcon from '@mui/icons-material/InstallDesktop';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setOpen(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setOpen(false);
      }
    } catch (error) {
      console.error('Erro ao instalar o PWA:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!deferredPrompt) return null;

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      sx={{
        bottom: { xs: 80, sm: 24 },
        '& .MuiSnackbarContent-root': {
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: 3,
          borderRadius: 2,
          p: 2,
          width: '100%',
          maxWidth: { xs: '90%', sm: '400px' },
        },
      }}
    >
      <Stack spacing={2} width="100%">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <InstallIcon color="primary" fontSize="large" />
          <Typography variant="body1">
            Instale o despesaJusta para uma experiência melhor
          </Typography>
        </Box>
        <Stack 
          direction="column" 
          spacing={1} 
          width="100%"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleInstall}
            fullWidth
            sx={{ textTransform: 'none' }}
          >
            Instalar
          </Button>
          <Button
            color="inherit"
            onClick={handleClose}
            fullWidth
            sx={{ textTransform: 'none' }}
          >
            Agora não
          </Button>
        </Stack>
      </Stack>
    </Snackbar>
  );
} 