import { useState } from "react";
import { Box, Typography, useTheme, Button, TextField, Tab, Tabs, CircularProgress, Alert, Chip, Avatar, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PodcastsIcon from "@mui/icons-material/Podcasts";
import EventIcon from "@mui/icons-material/Event";
import WorkIcon from "@mui/icons-material/Work";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { contentAPI } from "../../Api";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`content-tabpanel-${index}`}
    aria-labelledby={`content-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const UserContentManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tabValue, setTabValue] = useState(0);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedContent, setSelectedContent] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  // Content states
  const [videos, setVideos] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError("");
  };

  const fetchUserContent = async (type) => {
    if (!userId) {
      setError("Please enter a User ID");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      let response;
      switch (type) {
        case 'videos':
          response = await contentAPI.getVideosByUser(userId);
          setVideos(response.data || []);
          setUserInfo(response.user);
          break;
        case 'podcasts':
          response = await contentAPI.getPodcastsByUser(userId);
          setPodcasts(response.data || []);
          setUserInfo(response.user);
          break;
        case 'events':
          response = await contentAPI.getEventsByUser(userId);
          setEvents(response.data || []);
          setUserInfo(response.user);
          break;
        case 'jobs':
          response = await contentAPI.getJobsByUser(userId);
          setJobs(response.data || []);
          setUserInfo(response.user);
          break;
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to fetch user ${type}`);
      // Clear the specific content type on error
      switch (type) {
        case 'videos': setVideos([]); break;
        case 'podcasts': setPodcasts([]); break;
        case 'events': setEvents([]); break;
        case 'jobs': setJobs([]); break;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type.slice(0, -1)}?`)) {
      return;
    }
    
    try {
      switch (type) {
        case 'videos':
          await contentAPI.deleteVideo(id);
          setVideos(videos.filter(v => v._id !== id));
          break;
        case 'podcasts':
          await contentAPI.deletePodcast(id);
          setPodcasts(podcasts.filter(p => p._id !== id));
          break;
        case 'events':
          await contentAPI.deleteEvent(id);
          setEvents(events.filter(e => e._id !== id));
          break;
        case 'jobs':
          await contentAPI.deleteJob(id);
          setJobs(jobs.filter(j => j._id !== id));
          break;
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to delete ${type.slice(0, -1)}`);
    }
  };

  const showDetails = (content) => {
    setSelectedContent(content);
    setDetailsDialogOpen(true);
  };

  const videoColumns = [
    {
      field: "thumbnailUrl",
      headerName: "Thumbnail",
      flex: 0.5,
      renderCell: (params) => (
        <Box
          component="img"
          src={params.value || "/placeholder-video.jpg"}
          alt="Video thumbnail"
          sx={{ width: 60, height: 40, objectFit: "cover", borderRadius: 1 }}
        />
      ),
    },
    {
      field: "videoName",
      headerName: "Video Title",
      flex: 1.5,
      renderCell: (params) => (
        <Box>
          <Typography color={colors.greenAccent[300]} variant="body2" fontWeight="bold">
            {params.value || "Untitled"}
          </Typography>
          <Typography color={colors.grey[400]} variant="caption">
            {params.row.description?.substring(0, 50)}...
          </Typography>
        </Box>
      ),
    },
    {
      field: "views",
      headerName: "Views",
      flex: 0.5,
      renderCell: (params) => (
        <Typography color={colors.grey[300]}>
          {params.value || 0}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created",
      flex: 1,
      valueGetter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            onClick={() => showDetails(params.row)}
            sx={{ color: colors.greenAccent[400] }}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete('videos', params.row._id)}
            sx={{ color: colors.redAccent[400] }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const podcastColumns = [
    {
      field: "picUrl",
      headerName: "Cover",
      flex: 0.5,
      renderCell: (params) => (
        <Box
          component="img"
          src={params.value || "/placeholder-podcast.jpg"}
          alt="Podcast cover"
          sx={{ width: 60, height: 40, objectFit: "cover", borderRadius: 1 }}
        />
      ),
    },
    {
      field: "audioName",
      headerName: "Podcast Title",
      flex: 1.5,
      renderCell: (params) => (
        <Box>
          <Typography color={colors.greenAccent[300]} variant="body2" fontWeight="bold">
            {params.value || "Untitled"}
          </Typography>
          <Typography color={colors.grey[400]} variant="caption">
            {params.row.description?.substring(0, 50)}...
          </Typography>
        </Box>
      ),
    },
    {
      field: "guestSpeakers",
      headerName: "Guests",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" flexWrap="wrap" gap={0.5}>
          {params.value?.slice(0, 2).map((speaker, index) => (
            <Chip
              key={index}
              label={speaker}
              size="small"
              sx={{ backgroundColor: colors.greenAccent[600], color: "white" }}
            />
          ))}
          {params.value?.length > 2 && (
            <Chip
              label={`+${params.value.length - 2}`}
              size="small"
              variant="outlined"
              sx={{ borderColor: colors.greenAccent[400], color: colors.greenAccent[400] }}
            />
          )}
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created",
      flex: 1,
      valueGetter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            onClick={() => showDetails(params.row)}
            sx={{ color: colors.greenAccent[400] }}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete('podcasts', params.row._id)}
            sx={{ color: colors.redAccent[400] }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const eventColumns = [
    {
      field: "coverUrl",
      headerName: "Cover",
      flex: 0.5,
      renderCell: (params) => (
        <Box
          component="img"
          src={params.value || "/placeholder-event.jpg"}
          alt="Event cover"
          sx={{ width: 60, height: 40, objectFit: "cover", borderRadius: 1 }}
        />
      ),
    },
    {
      field: "title",
      headerName: "Event Title",
      flex: 1.5,
      renderCell: (params) => (
        <Box>
          <Typography color={colors.greenAccent[300]} variant="body2" fontWeight="bold">
            {params.value || "Untitled"}
          </Typography>
          <Typography color={colors.grey[400]} variant="caption">
            {params.row.description?.substring(0, 50)}...
          </Typography>
        </Box>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 0.8,
      valueGetter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.grey[300]}>
          {params.value || "Online"}
        </Typography>
      ),
    },
    {
      field: "ticketArray",
      headerName: "Tickets",
      flex: 0.5,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[400]} fontWeight="bold">
          {params.value?.length || 0}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            onClick={() => showDetails(params.row)}
            sx={{ color: colors.greenAccent[400] }}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete('events', params.row._id)}
            sx={{ color: colors.redAccent[400] }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const jobColumns = [
    {
      field: "logoUrl",
      headerName: "Logo",
      flex: 0.5,
      renderCell: (params) => (
        <Box
          component="img"
          src={params.value || "/placeholder-job.jpg"}
          alt="Company logo"
          sx={{ width: 60, height: 40, objectFit: "cover", borderRadius: 1 }}
        />
      ),
    },
    {
      field: "title",
      headerName: "Job Title",
      flex: 1.5,
      renderCell: (params) => (
        <Box>
          <Typography color={colors.greenAccent[300]} variant="body2" fontWeight="bold">
            {params.value || "Untitled"}
          </Typography>
          <Typography color={colors.grey[400]} variant="caption">
            {params.row.companyName}
          </Typography>
        </Box>
      ),
    },
    {
      field: "location",
      headerName: "Location",
      flex: 0.8,
      renderCell: (params) => (
        <Typography color={colors.grey[300]}>
          {params.value || "Remote"}
        </Typography>
      ),
    },
    {
      field: "jobType",
      headerName: "Type",
      flex: 0.5,
      renderCell: (params) => (
        <Chip
          label={params.value || "Full-time"}
          size="small"
          sx={{ backgroundColor: colors.greenAccent[600], color: "white" }}
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Posted",
      flex: 1,
      valueGetter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            onClick={() => showDetails(params.row)}
            sx={{ color: colors.greenAccent[400] }}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete('jobs', params.row._id)}
            sx={{ color: colors.redAccent[400] }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const renderContentGrid = (data, type, columns) => (
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
          onClick={() => fetchUserContent(type)}
          disabled={loading}
          sx={{
            backgroundColor: colors.greenAccent[600],
            "&:hover": { backgroundColor: colors.greenAccent[500] },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : `Fetch ${type}`}
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
              title={`${data.length}`}
              subtitle={`Total ${type}`}
              icon={
                type === 'videos' ? <VideoLibraryIcon /> :
                type === 'podcasts' ? <PodcastsIcon /> :
                type === 'events' ? <EventIcon /> :
                <WorkIcon />
              }
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
          rows={data} 
          columns={columns} 
          getRowId={(row) => row._id || row.id}
          loading={loading}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ height: "87vh", overflowY: "auto", padding: "20px" }}>
      <Header title="USER CONTENT MANAGEMENT" subtitle="View and manage user-generated content" />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label="Videos" 
            icon={<VideoLibraryIcon />} 
            iconPosition="start"
            sx={{ color: colors.greenAccent[300] }}
          />
          <Tab 
            label="Podcasts" 
            icon={<PodcastsIcon />} 
            iconPosition="start"
            sx={{ color: colors.greenAccent[300] }}
          />
          <Tab 
            label="Events" 
            icon={<EventIcon />} 
            iconPosition="start"
            sx={{ color: colors.greenAccent[300] }}
          />
          <Tab 
            label="Jobs" 
            icon={<WorkIcon />} 
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
        {renderContentGrid(videos, 'videos', videoColumns)}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderContentGrid(podcasts, 'podcasts', podcastColumns)}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {renderContentGrid(events, 'events', eventColumns)}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {renderContentGrid(jobs, 'jobs', jobColumns)}
      </TabPanel>

      {/* Content Details Dialog */}
      <Dialog
        open={detailsDialogOpen}
        onClose={() => setDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Content Details</DialogTitle>
        <DialogContent>
          {selectedContent && (
            <Box>
              <Typography variant="h6" color={colors.greenAccent[300]} gutterBottom>
                {selectedContent.videoName || selectedContent.audioName || selectedContent.title}
              </Typography>
              <Typography variant="body2" color={colors.grey[300]} paragraph>
                {selectedContent.description}
              </Typography>
              <Box display="flex" gap={2} mb={2}>
                <Typography variant="caption" color={colors.grey[400]}>
                  Created: {new Date(selectedContent.createdAt).toLocaleDateString()}
                </Typography>
                {selectedContent.views && (
                  <Typography variant="caption" color={colors.grey[400]}>
                    Views: {selectedContent.views}
                  </Typography>
                )}
              </Box>
              {selectedContent.guestSpeakers && (
                <Box mb={2}>
                  <Typography variant="subtitle2" color={colors.greenAccent[300]} gutterBottom>
                    Guest Speakers:
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {selectedContent.guestSpeakers.map((speaker, index) => (
                      <Chip
                        key={index}
                        label={speaker}
                        size="small"
                        sx={{ backgroundColor: colors.greenAccent[600], color: "white" }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              {selectedContent.ticketArray && (
                <Typography variant="caption" color={colors.grey[400]}>
                  Tickets Sold: {selectedContent.ticketArray.length}
                </Typography>
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

export default UserContentManagement;
