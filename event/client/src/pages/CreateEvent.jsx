import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
} from '@mui/material';
import { toast } from 'react-toastify';
import axios from 'axios';

const eventCategories = [
  { value: 'Academic', label: 'Academic' },
  { value: 'Cultural', label: 'Cultural' },
  { value: 'Sports', label: 'Sports' },
  { value: 'Technical', label: 'Technical' },
  { value: 'Workshop', label: 'Workshop' },
  { value: 'Seminar', label: 'Seminar' },
  { value: 'Other', label: 'Other' },
];

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    location: '',
    image: null,
    maxParticipants: '',
  });
  const navigate = useNavigate();

  const { title, description, category, date, location, image, maxParticipants } = formData;

  const onChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!maxParticipants || isNaN(Number(maxParticipants)) || Number(maxParticipants) < 1) {
      toast.error('Please enter a valid number for Max Participants');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/events',
        {
          title,
          description,
          category,
          date,
          location,
          maxParticipants: Number(maxParticipants),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      toast.success('Event created successfully');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          marginTop: 4,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Create New Event
        </Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Title"
            name="title"
            value={title}
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
            value={description}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            select
            label="Category"
            name="category"
            value={category}
            onChange={onChange}
          >
            {eventCategories.map((option) => (
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
            value={date}
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
            value={location}
            onChange={onChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Max Participants"
            name="maxParticipants"
            type="number"
            value={maxParticipants}
            onChange={onChange}
            inputProps={{ min: 1 }}
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload Image
            <input
              type="file"
              hidden
              name="image"
              onChange={onChange}
              accept="image/*"
            />
          </Button>
          {image && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {image.name}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Event
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateEvent; 