import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { tokens } from '../theme';

const CRUDModal = ({ 
  open, 
  handleClose, 
  mode, // 'create', 'edit', 'delete'
  title,
  initialData = {},
  fields = [],
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState({});
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  React.useEffect(() => {
    if (initialData && typeof initialData === 'object') {
      setFormData(initialData);
    } else {
      setFormData({});
    }
  }, [initialData, open]);

  const handleChange = (field) => (event) => {
    if (field && typeof field === 'string') {
      setFormData({ ...formData, [field]: event.target.value });
    }
  };

  // Guard clause: don't render if essential props are missing
  if (!open || !mode || !title) {
    return null;
  }

  const handleSubmit = async () => {
    // Basic validation
    if (!fields || !Array.isArray(fields)) {
      await onSubmit(formData);
      if (!loading) {
        handleClose();
      }
      return;
    }

    const requiredFields = fields.filter(field => field && field.required);
    const missingFields = requiredFields.filter(field => field.name && !formData[field.name]);
    
    if (missingFields.length > 0 && mode !== 'delete') {
      alert(`Please fill in: ${missingFields.map(f => f.label || f.name).join(', ')}`);
      return;
    }

    await onSubmit(formData);
    if (!loading) {
      handleClose();
    }
  };

  const renderField = (field, index) => {
    if (!field) {
      return null;
    }

    if (!field.name) {
      return null;
    }

    try {
      const commonProps = {
        fullWidth: true,
        label: field.label || field.name,
        variant: "outlined",
        value: formData && formData[field.name] ? formData[field.name] : '',
        onChange: handleChange(field.name),
        margin: "normal",
        disabled: mode === 'delete',
        required: field.required && mode !== 'delete',
        type: field.type || 'text'
      };

      if (field.type === 'select' && field.options) {
        return (
          <TextField
            {...commonProps}
            select
            SelectProps={{ native: true }}
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        );
      }

      return <TextField {...commonProps} />;
    } catch (error) {
      return null;
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        backgroundColor={colors.primary[400]}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: mode === 'delete' ? "400px" : "500px",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: 24,
          p: 4,
          borderRadius: "8px",
        }}
      >
        <Typography variant="h4" mb={2} color={colors.greenAccent[600]}>
          {title}
        </Typography>

        {mode === 'delete' ? (
          <Typography mb={2}>
            Are you sure you want to delete this item? This action cannot be undone.
          </Typography>
        ) : (
          fields && fields.length > 0 ? (
            fields.map((field, index) => {
              return (
                field && field.name ? (
                  <div key={field.name || index}>
                    {renderField(field, index)}
                  </div>
                ) : (
                  <div key={`invalid-${index}`} style={{display: 'none'}} />
                )
              );
            })
          ) : (
            <Typography>No fields to display</Typography>
          )
        )}

        <Box display="flex" gap="10px" mt={3}>
          <Button
            variant="contained"
            color="error"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color={mode === 'delete' ? 'error' : 'primary'}
            onClick={handleSubmit}
            disabled={loading}
            sx={{ backgroundColor: mode === 'delete' ? colors.redAccent[600] : colors.greenAccent[600] }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 
             mode === 'create' ? 'Create' : 
             mode === 'edit' ? 'Update' : 'Delete'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CRUDModal;
