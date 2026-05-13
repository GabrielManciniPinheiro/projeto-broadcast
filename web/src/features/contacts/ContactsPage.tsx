import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useContacts } from "../../hooks/useContacts";

export function ContactsPage() {
  const { connectionId } = useParams<{ connectionId: string }>();
  const navigate = useNavigate();

  const { contacts, addContact, removeContact, updateContact } =
    useContacts(connectionId);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    if (editingId) {
      updateContact(editingId, name, phone);
      setEditingId(null);
    } else {
      addContact(name, phone);
    }
    setName("");
    setPhone("");
  };

  const handleEdit = (
    id: string,
    currentName: string,
    currentPhone: string,
  ) => {
    setEditingId(id);
    setName(currentName);
    setPhone(currentPhone);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex items-center gap-4">
          <IconButton
            onClick={() => navigate("/connections")}
            aria-label="voltar"
            color="primary"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" className="font-bold">
            Contatos da Conexão
          </Typography>
        </header>

        <Paper className="mb-8 p-6 shadow-md">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <TextField
              label="Nome"
              variant="outlined"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Telefone (ex: 5511999999999)"
              variant="outlined"
              size="small"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="whitespace-nowrap"
            >
              {editingId ? "Salvar" : "Adicionar"}
            </Button>
            {editingId && (
              <Button
                variant="text"
                color="inherit"
                onClick={() => {
                  setEditingId(null);
                  setName("");
                  setPhone("");
                }}
              >
                Cancelar
              </Button>
            )}
          </form>
        </Paper>

        <Paper className="shadow-md">
          <List>
            {contacts.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="Nenhum contato cadastrado nesta conexão."
                  className="text-center"
                />
              </ListItem>
            )}
            {contacts.map((contact) => (
              <ListItem
                key={contact.id}
                secondaryAction={
                  <Box className="flex items-center">
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      color="info"
                      onClick={() =>
                        handleEdit(contact.id, contact.name, contact.phone)
                      }
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      color="error"
                      onClick={() => removeContact(contact.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
                className="border-b border-gray-700 last:border-0"
              >
                <ListItemText
                  primary={contact.name}
                  secondary={contact.phone}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
    </div>
  );
}
