import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const EditRecordDialog = ({ open, record, onClose, onSubmit, existingRecords }) => {
  const [error, setError] = useState(null);
  
  const schema = yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string()
      .email('Invalid email format')
      .required('Email is required')
      .test('unique', 'Email must be unique', function(value) {
        const { createError } = this;
        const isDuplicate = existingRecords?.some(existingRecord => 
          existingRecord.email === value && existingRecord.id !== record.id
        );
        return !isDuplicate || createError({ message: 'Email must be unique' });
      }),
  }).required();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: record?.id || '',
      name: record?.name || '',
      email: record?.email || '',
    }
  });

  const onFormSubmit = (data) => {
    setError(null);
    const result = onSubmit({
      ...data,
      id: record.id
    });
    
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Client Record</DialogTitle>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          <TextField
            margin="dense"
            label="ID"
            fullWidth
            disabled
            value={record?.id || ''}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            {...register('email')}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditRecordDialog; 