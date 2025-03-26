import { useState, useEffect } from 'react';
import {
  Dialog,
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
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-paper': {
          width: '100%',
          maxWidth: { xs: '90%', sm: '400px' },
          m: 2,
          p: 2,
          borderRadius: 2,
        },
      }}
    >
      <Stack spacing={3}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <InstallIcon color="primary" sx={{ fontSize: 48 }} />
          <Typography variant="body1">
            Instale o despesaJusta para uma experiência melhor
          </Typography>
        </Stack>

        <Stack spacing={1}>
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
            variant="text"
            color="inherit"
            onClick={handleClose}
            fullWidth
            sx={{ textTransform: 'none' }}
          >
            Agora não
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
} 