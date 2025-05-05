import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import { format } from 'date-fns';
import axios from 'axios';
import { toast } from 'react-toastify';

const eventTypes = [
  { value: 'academic', label: 'Academic' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'sports', label: 'Sports' },
  { value: 'technical', label: 'Technical' },
  { value: 'other', label: 'Other' },
];

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: '',
    date: '',
    location: '',
    image: null,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
        setFormData({
          title: response.data.title,
          description: response.data.description,
          eventType: response.data.eventType,
          date: format(new Date(response.data.date), "yyyy-MM-dd'T'HH:mm"),
          location: response.data.location,
          image: null,
        });
      } catch (error) {
        toast.error('Failed to fetch event details');
      }
    };

    fetchEvent();
  }, [id]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleUpdate = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('eventType', formData.eventType);
      formDataToSend.append('date', formData.date);
      formDataToSend.append('location', formData.location);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await axios.put(
        `http://localhost:5000/api/events/${id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setEvent(response.data);
      handleClose();
      toast.success('Event updated successfully');
    } catch (error) {
      toast.error('Failed to update event');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/events/${id}`);
      toast.success('Event deleted successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  if (!event) return null;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4">{event.title}</Typography>
          <Box>
            <Button variant="contained" onClick={handleOpen} sx={{ mr: 2 }}>
              Edit
            </Button>
            <Button variant="contained" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Box>
        </Box>

        {event.image && (
          <Box sx={{ mb: 4 }}>
            <img
              src={event.image}
              alt={event.title}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </Box>
        )}

        <Typography variant="body1" paragraph>
          {event.description}
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>Type:</strong> {event.eventType}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>Date:</strong> {format(new Date(event.date), 'PPP p')}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>Location:</strong> {event.location}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Created by:</strong> {event.createdBy.name}
        </Typography>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Event</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            multiline
            rows={4}
            label="Description"
            name="description"
            value={formData.description}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            select
            label="Event Type"
            name="eventType"
            value={formData.eventType}
            onChange={onChange}
          >
            {eventTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            required
            fullWidth
            type="datetime-local"
            label="Date and Time"
            name="date"
            value={formData.date}
            onChange={onChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={onChange}
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload New Image
            <input
              type="file"
              hidden
              name="image"
              onChange={onChange}
              accept="image/*"
            />
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventDetails; 