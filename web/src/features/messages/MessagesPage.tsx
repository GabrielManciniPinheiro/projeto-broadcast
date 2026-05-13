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
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  SelectChangeEvent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMessages } from "../../hooks/useMessages";
import { useContacts } from "../../hooks/useContacts";

export function MessagesPage() {
  const { connectionId } = useParams<{ connectionId: string }>();
  const navigate = useNavigate();

  const { messages, addMessage, removeMessage, updateMessage } =
    useMessages(connectionId);
  const { contacts } = useContacts(connectionId);

  const [text, setText] = useState("");
  const [scheduledFor, setScheduledFor] = useState("");
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "todos" | "agendado" | "enviado"
  >("todos");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleToggleContact = (contactId: string) => {
    setSelectedContacts((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !scheduledFor || selectedContacts.length === 0) {
      alert("Preencha o texto, o horário e selecione pelo menos um contato!");
      return;
    }

    if (editingId) {
      updateMessage(editingId, text, scheduledFor);
      setEditingId(null);
    } else {
      addMessage(text, selectedContacts, scheduledFor);
    }

    setText("");
    setScheduledFor("");
    setSelectedContacts([]);
  };

  const handleEdit = (
    id: string,
    currentText: string,
    currentScheduledFor: string,
  ) => {
    setEditingId(id);
    setText(currentText);
    setScheduledFor(currentScheduledFor);
  };

  const handleFilterChange = (e: SelectChangeEvent) => {
    setFilterStatus(e.target.value as "todos" | "agendado" | "enviado");
  };

  const filteredMessages = messages.filter((msg) => {
    if (filterStatus === "todos") return true;
    return msg.status === filterStatus;
  });

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex items-center gap-4">
          <IconButton
            onClick={() => navigate("/connections")}
            aria-label="voltar"
            color="primary"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" className="font-bold">
            Mensagens e Disparos
          </Typography>
        </header>

        <Paper className="mb-8 p-6 shadow-md">
          <Typography variant="h6" className="mb-4 font-semibold">
            {editingId ? "Editar Agendamento" : "Nova Mensagem"}
          </Typography>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <TextField
              label="Texto da Mensagem"
              variant="outlined"
              multiline
              rows={3}
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div className="flex gap-4">
              <TextField
                label="Agendar para"
                type="datetime-local"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="w-1/3"
              />
            </div>

            {!editingId && (
              <Box className="mt-2 max-h-48 overflow-y-auto rounded border border-gray-700 bg-gray-800 p-4">
                <Typography
                  variant="subtitle2"
                  className="mb-2 font-bold text-gray-300"
                >
                  Selecione os Contatos para Envio:
                </Typography>
                {contacts.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    Nenhum contato cadastrado nesta conexão.
                  </Typography>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {contacts.map((contact) => (
                      <FormControlLabel
                        key={contact.id}
                        control={
                          <Checkbox
                            color="primary"
                            checked={selectedContacts.includes(contact.id)}
                            onChange={() => handleToggleContact(contact.id)}
                          />
                        }
                        label={`${contact.name} (${contact.phone})`}
                      />
                    ))}
                  </div>
                )}
              </Box>
            )}

            <div className="mt-2 flex justify-end gap-2">
              {editingId && (
                <Button
                  variant="text"
                  color="inherit"
                  onClick={() => {
                    setEditingId(null);
                    setText("");
                    setScheduledFor("");
                  }}
                >
                  Cancelar
                </Button>
              )}
              <Button type="submit" variant="contained" color="primary">
                {editingId ? "Salvar Alterações" : "Agendar Disparo"}
              </Button>
            </div>
          </form>
        </Paper>

        <Paper className="p-6 shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <Typography variant="h6" className="font-semibold">
              Histórico de Mensagens
            </Typography>
            <FormControl size="small" className="w-48">
              <InputLabel>Filtrar Status</InputLabel>
              <Select
                value={filterStatus}
                label="Filtrar Status"
                onChange={handleFilterChange}
              >
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="agendado">Agendados</MenuItem>
                <MenuItem value="enviado">Enviados</MenuItem>
              </Select>
            </FormControl>
          </div>

          <List>
            {filteredMessages.length === 0 && (
              <ListItem>
                <ListItemText
                  primary="Nenhuma mensagem encontrada para este filtro."
                  className="text-center"
                />
              </ListItem>
            )}
            {filteredMessages.map((msg) => (
              <ListItem
                key={msg.id}
                secondaryAction={
                  <Box className="flex items-center">
                    <IconButton
                      edge="end"
                      onClick={() =>
                        handleEdit(msg.id, msg.text, msg.scheduledFor)
                      }
                      disabled={msg.status === "enviado"}
                    >
                      <EditIcon
                        color={msg.status === "enviado" ? "disabled" : "info"}
                      />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => removeMessage(msg.id)}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                }
                className="mb-2 rounded-lg border border-gray-700 bg-gray-800"
              >
                <ListItemText
                  primary={msg.text}
                  secondary={`Agendado: ${new Date(msg.scheduledFor).toLocaleString()} | Contatos: ${msg.contactIds.length}`}
                />
                <Chip
                  label={msg.status.toUpperCase()}
                  color={msg.status === "enviado" ? "success" : "warning"}
                  size="small"
                  className="mr-12 text-white font-bold"
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
    </div>
  );
}
