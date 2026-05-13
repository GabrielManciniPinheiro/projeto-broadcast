import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// Criando o nosso tema customizado
const darkTheme = createTheme({
  palette: {
    mode: "dark", // Ativa o Dark Mode em todos os componentes do MUI
    primary: {
      main: "#f97316", // Laranja vibrante (equivalente ao orange-500 do Tailwind)
    },
    background: {
      default: "#111827", // Fundo principal da tela (cinza super escuro)
      paper: "#1f2937", // Fundo dos cartões/Papers (um pouco mais claro para destacar)
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={darkTheme}>
      {/* O CssBaseline injeta as cores de fundo do tema no <body> do HTML automaticamente */}
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
