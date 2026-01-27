import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { tokens } from "../../theme";
import { createSubAdmin } from "../../Api/adminApi";

const AddSubAdminModal = ({ open, handleClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleSubAdmin = async () => {
    if (!email || !password) {
      alert("Please fill in all the fields before submitting");
      return;
    }
    
    setLoading(true);
    try {
      const response = await createSubAdmin({ email, password });
      alert("Sub-Admin added successfully");
      setEmail("");
      setPassword("");
      handleClose(); 
    } catch (err) {
      console.error("Error adding Sub-Admin:", err);
      alert("Failed to add Sub-Admin. Please try again.");
    } finally {
      setLoading(false);
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
          width: "400px",
          boxShadow: 24,
          p: 4,
          borderRadius: "8px",
        }}
      >
        <Typography variant="h4" mb={2} color= {colors.greenAccent[600]}>
          Add SubAdmin
        </Typography>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Button
          fullWidth
          variant="contained"
          disabled={loading}
          sx={{ mt: 2, backgroundColor:colors.greenAccent[600] }}
          onClick={handleSubAdmin}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>
      </Box>
    </Modal>
  );
};

export default AddSubAdminModal;
