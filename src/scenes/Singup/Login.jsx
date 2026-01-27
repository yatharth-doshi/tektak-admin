import { useState } from "react";
import { Box, Button, TextField, Typography, useTheme, CircularProgress } from "@mui/material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../Api/adminApi";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate()
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    __login__();
  };

  const __login__ = async () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await adminLogin(formData);
      if (data.message === 'success') {
        document.cookie = `teqtak-admin-token=${data.authtoken}`;
        navigate('/');
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

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


          {error && (
            <Typography color="error" sx={{ marginBottom: "15px", textAlign: "center" }}>
              {error}
            </Typography>
          )}

          <Button
            onClick={__login__}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;
