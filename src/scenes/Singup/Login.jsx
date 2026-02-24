import { useState } from "react";
import { Box, Button, TextField, Typography, useTheme, Alert, CircularProgress } from "@mui/material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import { authAPI, setAuthToken } from "../../Api";
import { debugLoginResponse } from "../../utils/authTest";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate()
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(formData);
      
      // Debug the actual response structure
      debugLoginResponse(response);
      
      // Store JWT token - handle different response structures
      const token = response.token || response.authtoken || response.data?.token || response.data?.authtoken;
      
      if (token) {
        setAuthToken(token);
        console.log("Login successful, token stored");
        navigate('/');
      } else {
        console.error("No token found in response:", response);
        setError("Login successful but no token received. Check console for response structure.");
      }
      
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: colors.primary[400],
        padding: "20px",
      }}
    >

      <Box
        sx={{
          backgroundColor: colors.primary[500], // Same primary color used in Events component
          padding: "30px",
          borderRadius: "10px",
          boxShadow: 3,
          width: "100%",
          height: "50vh",
          maxWidth: "330px",
        }}
      >
        <Typography variant="h1" sx={{ color: colors.greenAccent[500], marginBottom: "20px", textAlign: "center" }}>
          Log In
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            sx={{
              marginBottom: "15px",
              input: {
                color: colors.greenAccent[500],
              },
              label: {
                color: colors.greenAccent[500],
              },
            }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            sx={{
              marginBottom: "15px",
              input: {
                color: colors.greenAccent[500], 
              },
              label: {
                color: colors.greenAccent[500], 
              },
            }}
          />


          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: colors.greenAccent[600],
              "&:hover": {
                backgroundColor: colors.greenAccent[500],
              },
              color: colors.grey[100],
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </form>
      </Box>
    </Box>
  );
};

export default Login;
