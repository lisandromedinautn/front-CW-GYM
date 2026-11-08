import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { Aplicacion } from './Aplicacion.tsx';

const raiz = document.getElementById('raiz');
if (!raiz) throw new Error('No se encontró el elemento #raiz en index.html');

createRoot(raiz).render(
  <StrictMode>
    <BrowserRouter>
      <Aplicacion />
    </BrowserRouter>
  </StrictMode>,
);
