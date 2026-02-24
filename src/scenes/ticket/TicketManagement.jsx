import { useState } from "react";
import { Box, Typography, useTheme, Button, TextField, Tab, Tabs, CircularProgress, Alert } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import TrafficIcon from "@mui/icons-material/Traffic";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import { ticketsAPI } from "../../Api";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`ticket-tabpanel-${index}`}
    aria-labelledby={`ticket-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const TicketManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tabValue, setTabValue] = useState(0);
  const [eventTickets, setEventTickets] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [eventId, setEventId] = useState("");
  const [userId, setUserId] = useState("");
  const [eventStats, setEventStats] = useState({ total: 0, revenue: 0 });
  const [userStats, setUserStats] = useState({ total: 0, spent: 0 });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError("");
  };

  const fetchEventTickets = async () => {
    if (!eventId) {
      setError("Please enter an Event ID");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const response = await ticketsAPI.getTicketsByEvent(eventId);
      setEventTickets(response.data || []);
      setEventStats({
        total: response.total || 0,
        revenue: response.totalRevenue || 0
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch event tickets");
      setEventTickets([]);
      setEventStats({ total: 0, revenue: 0 });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTickets = async () => {
    if (!userId) {
      setError("Please enter a User ID");
      return;
    }
    
    setLoading(true);
    setError("");
    try {
      const response = await ticketsAPI.getTicketsByUser(userId);
      setUserTickets(response.data || []);
      setUserStats({
        total: response.total || 0,
        spent: response.totalSpent || 0
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user tickets");
      setUserTickets([]);
      setUserStats({ total: 0, spent: 0 });
    } finally {
      setLoading(false);
    }
  };

  const eventColumns = [
    {
      field: "buyer",
      headerName: "Buyer",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          {params.value?.profileUrl && (
            <Box
              component="img"
              src={params.value.profileUrl}
              alt={params.value?.name || "User"}
              sx={{ width: 30, height: 30, borderRadius: "50%", mr: 1 }}
            />
          )}
          <Box>
            <Typography color={colors.greenAccent[300]} variant="body2">
              {params.value?.name || "N/A"}
            </Typography>
            <Typography color={colors.grey[300]} variant="caption">
              {params.value?.email || "N/A"}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "totalAmount",
      headerName: "Amount",
      flex: 0.5,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[400]} fontWeight="bold">
          ${params.value || 0}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Purchase Date",
      flex: 1,
      valueGetter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      renderCell: (params) => (
        <Box
          px={1}
          py={0.5}
          borderRadius={1}
          backgroundColor={
            params.value === "active" ? colors.greenAccent[600] : colors.redAccent[600]
          }
          color="white"
          textAlign="center"
        >
          {params.value || "Unknown"}
        </Box>
      ),
    },
  ];

  const userTicketColumns = [
    {
      field: "event",
      headerName: "Event",
      flex: 1.5,
      renderCell: (params) => (
        <Box>
          <Typography color={colors.greenAccent[300]} variant="body2" fontWeight="bold">
            {params.value?.title || "N/A"}
          </Typography>
          <Typography color={colors.grey[300]} variant="caption">
            {params.value?.date ? new Date(params.value.date).toLocaleDateString() : "N/A"}
          </Typography>
          <Typography color={colors.grey[400]} variant="caption">
            {params.value?.location || "N/A"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "totalAmount",
      headerName: "Amount",
      flex: 0.5,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[400]} fontWeight="bold">
          ${params.value || 0}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Purchase Date",
      flex: 1,
      valueGetter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      renderCell: (params) => (
        <Box
          px={1}
          py={0.5}
          borderRadius={1}
          backgroundColor={
            params.value === "active" ? colors.greenAccent[600] : colors.redAccent[600]
          }
          color="white"
          textAlign="center"
        >
          {params.value || "Unknown"}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: "87vh", overflowY: "auto", padding: "20px" }}>
      <Header title="TICKET MANAGEMENT" subtitle="View tickets by event or user" />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label="Tickets by Event" 
            icon={<EventIcon />} 
            iconPosition="start"
            sx={{ color: colors.greenAccent[300] }}
          />
          <Tab 
            label="Tickets by User" 
            icon={<PersonIcon />} 
            iconPosition="start"
            sx={{ color: colors.greenAccent[300] }}
          />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TabPanel value={tabValue} index={0}>
        <Box display="flex" gap={2} mb={3} alignItems="center">
          <TextField
            label="Event ID"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="contained"
            onClick={fetchEventTickets}
            disabled={loading}
            sx={{
              backgroundColor: colors.greenAccent[600],
              "&:hover": { backgroundColor: colors.greenAccent[500] },
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Fetch Tickets"}
          </Button>
        </Box>

        {eventTickets.length > 0 && (
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px" mb={3}>
            <Box gridColumn="span 6" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
              <StatBox
                title={`${eventStats.total}`}
                subtitle="Total Tickets"
                icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            </Box>
            <Box gridColumn="span 6" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
              <StatBox
                title={`$${eventStats.revenue}`}
                subtitle="Total Revenue"
                icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            </Box>
          </Box>
        )}

        <Box height="60vh" sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
        }}>
          <DataGrid 
            rows={eventTickets} 
            columns={eventColumns} 
            getRowId={(row) => row._id || row.id}
            loading={loading}
          />
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box display="flex" gap={2} mb={3} alignItems="center">
          <TextField
            label="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            variant="outlined"
            size="small"
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="contained"
            onClick={fetchUserTickets}
            disabled={loading}
            sx={{
              backgroundColor: colors.greenAccent[600],
              "&:hover": { backgroundColor: colors.greenAccent[500] },
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Fetch Tickets"}
          </Button>
        </Box>

        {userTickets.length > 0 && (
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px" mb={3}>
            <Box gridColumn="span 6" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
              <StatBox
                title={`${userStats.total}`}
                subtitle="Total Tickets"
                icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            </Box>
            <Box gridColumn="span 6" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
              <StatBox
                title={`$${userStats.spent}`}
                subtitle="Total Spent"
                icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
              />
            </Box>
          </Box>
        )}

        <Box height="60vh" sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
        }}>
          <DataGrid 
            rows={userTickets} 
            columns={userTicketColumns} 
            getRowId={(row) => row._id || row.id}
            loading={loading}
          />
        </Box>
      </TabPanel>
    </Box>
  );
};

export default TicketManagement;
