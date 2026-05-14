import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button, TextField, Typography, Paper, Box } from "@mui/material";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (error) {
      console.error("Erro na autenticação", error);
      alert(
        "Erro ao autenticar. Verifique suas credenciais e tente novamente.",
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Paper className="w-full max-w-md p-8 shadow-xl">
        <Box className="mb-8 text-center">
          <Typography variant="h4" className="mb-2 font-bold">
            Broadcast SaaS
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isLogin
              ? "Faça login para gerenciar seus disparos"
              : "Crie sua conta para começar"}
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <TextField
            label="E-mail"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            className="mt-2 py-3 font-bold"
          >
            {isLogin ? "Entrar" : "Cadastrar"}
          </Button>
        </form>

        <Box className="mt-6 text-center">
          <Button
            variant="text"
            color="inherit"
            size="small"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Não tem uma conta? Cadastre-se"
              : "Já tem uma conta? Faça login"}
          </Button>
        </Box>
      </Paper>
    </div>
  );
}
