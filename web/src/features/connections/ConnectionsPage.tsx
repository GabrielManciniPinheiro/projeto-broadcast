import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useConnections } from "../../hooks/useConnections";
import { useAuth } from "../../hooks/useAuth";

export function ConnectionsPage() {
  const { connections, addConnection, removeConnection, updateConnection } =
    useConnections();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    if (editingId) {
      updateConnection(editingId, newName);
      setEditingId(null);
    } else {
      addConnection(newName);
    }
    setNewName("");
  };

  const handleEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setNewName(currentName);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center justify-between">
          <Typography variant="h4" className="font-bold">
            Minhas Conexões
          </Typography>
          <div className="flex items-center gap-4">
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={logout}
            >
              Sair
            </Button>
          </div>
        </header>

        <Paper className="mb-8 p-6 shadow-md">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <TextField
              label="Nome da Conexão"
              variant="outlined"
              size="small"
              fullWidth
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary">
              {editingId ? "Salvar" : "Adicionar"}
            </Button>
            {editingId && (
              <Button
                variant="text"
                onClick={() => {
                  setEditingId(null);
                  setNewName("");
                }}
              >
                Cancelar
              </Button>
            )}
          </form>
        </Paper>

        <Paper className="shadow-md">
          <List>
            {connections.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="Nenhuma conexão encontrada. Adicione uma acima!"
                  className="text-center"
                />
              </ListItem>
            )}
            {connections.map((conn) => (
              <ListItem
                key={conn.id}
                secondaryAction={
                  <Box className="flex items-center gap-2">
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() =>
                        navigate(`/connections/${conn.id}/messages`)
                      }
                    >
                      Mensagens
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={() =>
                        navigate(`/connections/${conn.id}/contacts`)
                      }
                    >
                      Contatos
                    </Button>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      color="info"
                      onClick={() => handleEdit(conn.id, conn.name)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      color="error"
                      onClick={() => removeConnection(conn.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
                className="border-b border-gray-700 last:border-0"
              >
                <ListItemText primary={conn.name} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
    </div>
  );
}
