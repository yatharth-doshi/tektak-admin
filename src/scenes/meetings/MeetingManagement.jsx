import { useEffect, useState } from "react";
import { Box, Typography, useTheme, Button, TextField, Tab, Tabs, CircularProgress, Alert, Avatar, Chip, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { meetingsAPI } from "../../Api";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`meeting-tabpanel-${index}`}
    aria-labelledby={`meeting-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const MeetingManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tabValue, setTabValue] = useState(0);
  const [userId, setUserId] = useState("");
  const [chatId, setChatId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // Meeting states
  const [userMeetings, setUserMeetings] = useState([]);
  const [chatMeetings, setChatMeetings] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError("");
  };

  const fetchMeetingsByUser = async () => {
    if (!userId) {
      setError("Please enter a User ID");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await meetingsAPI.getMeetingsByUser(userId);
      setUserMeetings(response.data || []);
      setUserInfo(response.user);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user meetings");
      setUserMeetings([]);
      setUserInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchMeetingsByChat = async () => {
    if (!chatId) {
      setError("Please enter a Chat ID");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await meetingsAPI.getMeetingsByChat(chatId);
      setChatMeetings(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch chat meetings");
      setChatMeetings([]);
    } finally {
      setLoading(false);
    }
  };

  const showDetails = (meeting) => {
    setSelectedMeeting(meeting);
    setDetailsDialogOpen(true);
  };

  const formatDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "N/A";
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = Math.round((end - start) / (1000 * 60)); // minutes
    return `${duration} min`;
  };

  const userMeetingColumns = [
    {
      field: "title",
      headerName: "Meeting Title",
      flex: 1.5,
      renderCell: (params) => (
        <Box>
          <Typography color={colors.greenAccent[300]} variant="body2" fontWeight="bold">
            {params.value || "Untitled Meeting"}
          </Typography>
          <Typography color={colors.grey[400]} variant="caption">
            {params.row.description?.substring(0, 50)}...
          </Typography>
        </Box>
      ),
    },
    {
      field: "startTime",
      headerName: "Start Time",
      flex: 1,
      valueGetter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "endTime",
      headerName: "End Time",
      flex: 1,
      valueGetter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 0.5,
      valueGetter: (params) => formatDuration(params.row.startTime, params.row.endTime),
    },
    {
      field: "participants",
      headerName: "Participants",
      flex: 0.8,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[400]} fontWeight="bold">
          {params.value?.length || 0}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      renderCell: (params) => {
        const status = params.value || "unknown";
        const now = new Date();
        const startTime = new Date(params.row.startTime);
        const endTime = new Date(params.row.endTime);
        
        let statusColor = colors.grey[500];
        let statusText = "Unknown";
        
        if (status === "scheduled") {
          if (now < startTime) {
            statusColor = colors.blueAccent[500];
            statusText = "Scheduled";
          } else if (now >= startTime && now <= endTime) {
            statusColor = colors.greenAccent[500];
            statusText = "Live";
          } else {
            statusColor = colors.grey[500];
            statusText = "Ended";
          }
        }
        
        return (
          <Chip
            label={statusText}
            size="small"
            sx={{ 
              backgroundColor: statusColor, 
              color: "white",
              fontWeight: "bold"
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            onClick={() => showDetails(params.row)}
            sx={{ color: colors.greenAccent[400] }}
          >
            <VisibilityIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const chatMeetingColumns = [
    {
      field: "title",
      headerName: "Meeting Title",
      flex: 1.5,
      renderCell: (params) => (
        <Box>
          <Typography color={colors.greenAccent[300]} variant="body2" fontWeight="bold">
            {params.value || "Untitled Meeting"}
          </Typography>
          <Typography color={colors.grey[400]} variant="caption">
            {params.row.description?.substring(0, 50)}...
          </Typography>
        </Box>
      ),
    },
    {
      field: "host",
      headerName: "Host",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          {params.value?.profileUrl && (
            <Avatar
              src={params.value.profileUrl}
              alt={params.value?.name || "Host"}
              sx={{ width: 30, height: 30, mr: 1 }}
            />
          )}
          <Box>
            <Typography color={colors.greenAccent[300]} variant="body2">
              {params.value?.name || "Unknown Host"}
            </Typography>
            <Typography color={colors.grey[300]} variant="caption">
              {params.value?.email || "N/A"}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: "startTime",
      headerName: "Start Time",
      flex: 1,
      valueGetter: (params) => new Date(params.value).toLocaleString(),
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 0.5,
      valueGetter: (params) => formatDuration(params.row.startTime, params.row.endTime),
    },
    {
      field: "participants",
      headerName: "Participants",
      flex: 0.8,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[400]} fontWeight="bold">
          {params.value?.length || 0}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      renderCell: (params) => {
        const status = params.value || "unknown";
        const now = new Date();
        const startTime = new Date(params.row.startTime);
        const endTime = new Date(params.row.endTime);
        
        let statusColor = colors.grey[500];
        let statusText = "Unknown";
        
        if (status === "scheduled") {
          if (now < startTime) {
            statusColor = colors.blueAccent[500];
            statusText = "Scheduled";
          } else if (now >= startTime && now <= endTime) {
            statusColor = colors.greenAccent[500];
            statusText = "Live";
          } else {
            statusColor = colors.grey[500];
            statusText = "Ended";
          }
        }
        
        return (
          <Chip
            label={statusText}
            size="small"
            sx={{ 
              backgroundColor: statusColor, 
              color: "white",
              fontWeight: "bold"
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            onClick={() => showDetails(params.row)}
            sx={{ color: colors.greenAccent[400] }}
          >
            <VisibilityIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const renderUserMeetingGrid = () => (
    <Box>
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
          onClick={fetchMeetingsByUser}
          disabled={loading}
          sx={{
            backgroundColor: colors.greenAccent[600],
            "&:hover": { backgroundColor: colors.greenAccent[500] },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Fetch Meetings"}
        </Button>
      </Box>

      {userInfo && (
        <Box display="flex" alignItems="center" gap={2} mb={3} p={2} backgroundColor={colors.primary[400]} borderRadius={2}>
          <Avatar
            src={userInfo.profileUrl}
            alt={userInfo.name}
            sx={{ width: 50, height: 50 }}
          />
          <Box>
            <Typography color={colors.greenAccent[300]} variant="h6">
              {userInfo.name}
            </Typography>
            <Typography color={colors.grey[300]} variant="body2">
              {userInfo.email}
            </Typography>
          </Box>
          <Box ml="auto">
            <StatBox
              title={`${userMeetings.length}`}
              subtitle="Total Meetings"
              icon={<VideoCallIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
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
          rows={userMeetings} 
          columns={userMeetingColumns} 
          getRowId={(row) => row._id || row.id}
          loading={loading}
        />
      </Box>
    </Box>
  );

  const renderChatMeetingGrid = () => (
    <Box>
      <Box display="flex" gap={2} mb={3} alignItems="center">
        <TextField
          label="Chat ID"
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ minWidth: 200 }}
        />
        <Button
          variant="contained"
          onClick={fetchMeetingsByChat}
          disabled={loading}
          sx={{
            backgroundColor: colors.greenAccent[600],
            "&:hover": { backgroundColor: colors.greenAccent[500] },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Fetch Meetings"}
        </Button>
      </Box>

      {chatMeetings.length > 0 && (
        <Box display="flex" alignItems="center" gap={2} mb={3} p={2} backgroundColor={colors.primary[400]} borderRadius={2}>
          <ChatIcon sx={{ fontSize: 40, color: colors.greenAccent[400] }} />
          <Box>
            <Typography color={colors.greenAccent[300]} variant="h6">
              Chat Room: {chatId}
            </Typography>
            <Typography color={colors.grey[300]} variant="body2">
              Meetings linked to this chat room
            </Typography>
          </Box>
          <Box ml="auto">
            <StatBox
              title={`${chatMeetings.length}`}
              subtitle="Total Meetings"
              icon={<VideoCallIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
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
          rows={chatMeetings} 
          columns={chatMeetingColumns} 
          getRowId={(row) => row._id || row.id}
          loading={loading}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ height: "87vh", overflowY: "auto", padding: "20px" }}>
      <Header title="MEETING MANAGEMENT" subtitle="View and manage video meetings" />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label="Meetings by User" 
            icon={<PersonIcon />} 
            iconPosition="start"
            sx={{ color: colors.greenAccent[300] }}
          />
          <Tab 
            label="Meetings by Chat" 
            icon={<ChatIcon />} 
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
        {renderUserMeetingGrid()}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderChatMeetingGrid()}
      </TabPanel>

      {/* Meeting Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Meeting Details</DialogTitle>
        <DialogContent>
          {selectedMeeting && (
            <Box>
              <Typography variant="h6" color={colors.greenAccent[300]} gutterBottom>
                {selectedMeeting.title || "Untitled Meeting"}
              </Typography>
              <Typography variant="body2" color={colors.grey[300]} paragraph>
                {selectedMeeting.description || "No description available"}
              </Typography>
              
              <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2} mb={2}>
                <Box>
                  <Typography variant="subtitle2" color={colors.greenAccent[300]}>
                    Start Time:
                  </Typography>
                  <Typography variant="body2" color={colors.grey[300]}>
                    {new Date(selectedMeeting.startTime).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color={colors.greenAccent[300]}>
                    End Time:
                  </Typography>
                  <Typography variant="body2" color={colors.grey[300]}>
                    {new Date(selectedMeeting.endTime).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color={colors.greenAccent[300]}>
                    Duration:
                  </Typography>
                  <Typography variant="body2" color={colors.grey[300]}>
                    {formatDuration(selectedMeeting.startTime, selectedMeeting.endTime)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color={colors.greenAccent[300]}>
                    Participants:
                  </Typography>
                  <Typography variant="body2" color={colors.grey[300]}>
                    {selectedMeeting.participants?.length || 0}
                  </Typography>
                </Box>
              </Box>

              {selectedMeeting.participants && selectedMeeting.participants.length > 0 && (
                <Box mb={2}>
                  <Typography variant="subtitle2" color={colors.greenAccent[300]} gutterBottom>
                    Participants:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {selectedMeeting.participants.map((participant, index) => (
                      <Chip
                        key={index}
                        label={`${participant.name || participant.email || 'Unknown'}`}
                        size="small"
                        sx={{ backgroundColor: colors.greenAccent[600], color: "white" }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {selectedMeeting.meetingLink && (
                <Box>
                  <Typography variant="subtitle2" color={colors.greenAccent[300]} gutterBottom>
                    Meeting Link:
                  </Typography>
                  <Typography variant="body2" color={colors.blueAccent[300]} sx={{ wordBreak: 'break-all' }}>
                    {selectedMeeting.meetingLink}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MeetingManagement;
