import { Box, IconButton, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";
import axios from "axios";
import BackspaceIcon from '@mui/icons-material/Backspace';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import { fetchAllVideoCount } from "../../Api/Video/AllVideoCount";
import CRUDModal from "../../components/CRUDModal";


const DailyVideos = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [videos, setVideos] = useState([])
  const navigate = useNavigate()
  
  // CRUD Modal states
  const [crudModalOpen, setCrudModalOpen] = useState(false);
  const [crudMode, setCrudMode] = useState('create');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [crudLoading, setCrudLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);

  useEffect(() => {
    const getVideoCount = async () => {
        try {
            const users = await fetchAllVideoCount();
            setVideos(users.todayVideos);

        } catch (error) {
            console.error(error);
        }
    };
    getVideoCount();
}, []);

  const handleDeleteVideoOld = async (vidId) => {
    try {
      await axios.post(`http://localhost:5000/upload/delete/${vidId}`);
      setVideos((prevVideos) => prevVideos.filter((video) => video._id !== vidId));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const handleDeleteVideo = (video) => {
    setCrudMode('delete');
    setSelectedVideo(video);
    setCrudModalOpen(true);
  };

  const handleCreateVideo = () => {
    setCrudMode('create');
    setSelectedVideo({});
    setCrudModalOpen(true);
  };

  const handleEditVideo = (video) => {
    setCrudMode('edit');
    setSelectedVideo(video);
    setCrudModalOpen(true);
  };

  const [refresh, setRefresh] = useState(false);

  const handleCRUDSubmit = async (data) => {
    setCrudLoading(true);
    try {
      if (crudMode === 'create') {
        // Create video logic here
        alert('Video created successfully');
      } else if (crudMode === 'edit') {
        // Update video logic here
        alert('Video updated successfully');
      } else if (crudMode === 'delete') {
        await axios.post(`http://localhost:5000/upload/delete/${selectedVideo._id}`);
        setVideos((prevVideos) => prevVideos.filter((video) => video._id !== selectedVideo._id));
        alert('Video deleted successfully');
      }
      setRefresh(!refresh);
    } catch (error) {
      alert(`Failed to ${crudMode} video`);
    } finally {
      setCrudLoading(false);
    }
  };

  const handleCrudModalClose = () => {
    setCrudModalOpen(false);
    setSelectedVideo(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.post(`http://localhost:5000/upload/delete/${selectedVideoId}`);
      setVideos((prevVideos) => prevVideos.filter((video) => video._id !== selectedVideoId));
      setDeleteDialogOpen(false);
      setSelectedVideoId(null);
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedVideoId(null);
  };

  return (
    <>

      <Box sx={{ height: "87vh", overflowY: "auto" }}>
        <Box m="20px">
          <IconButton onClick={() => navigate('/videos')} sx={{ mb: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box
            display="grid"
            gridTemplateColumns="repeat(6, 3fr)"
            gridAutoRows="140px"
            gap="20px"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              gridColumn="span 6"
            >
              <Header title="DAILY VIDEO" subtitle="Managing Daily Video" />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateVideo}
                sx={{
                  backgroundColor: colors.greenAccent[600],
                  color: colors.grey[100],
                  '&:hover': {
                    backgroundColor: colors.greenAccent[500],
                  }
                }}
              >
                Add Video
              </Button>
            </Box>
          </Box>
        </Box>

        <Box m="20px">
          <Box
            my="20px"
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            gap="20px"
          >
            {videos.map((video, index) => (
              <Box
                key={index}
                backgroundColor={colors.primary[400]}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                padding="10px"
              >
                <video
                  src={video.videoUrl}
                  width="100%"
                  height={"200px"}
                  style={{ objectFit: "cover" }}
                  controls
                ></video>
                <Box display="flex" gap={1} mt={1} width="100%">
                  <Button 
                    variant="contained" 
                    color="info" 
                    size="small"
                    onClick={() => handleEditVideo(video)}
                    sx={{ minWidth: "50px" }}
                  >
                    <EditIcon />
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error" 
                    size="small"
                    onClick={() => handleDeleteVideo(video)}
                    sx={{ minWidth: "50px" }}
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>

        </Box>

        {/* CRUD Modal */}
        <CRUDModal
          open={crudModalOpen}
          handleClose={handleCrudModalClose}
          mode={crudMode}
          title={`${crudMode === 'create' ? 'Add' : crudMode === 'edit' ? 'Edit' : 'Delete'} Daily Video`}
          initialData={selectedVideo}
          fields={[
            { name: 'title', label: 'Video Title', required: true },
            { name: 'videoUrl', label: 'Video URL', required: true },
            { name: 'description', label: 'Description', required: true },
            { name: 'duration', label: 'Duration' },
            { name: 'thumbnailUrl', label: 'Thumbnail URL' },
            { name: 'category', label: 'Category' },
          ]}
          onSubmit={handleCRUDSubmit}
          loading={crudLoading}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this video? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>

  );
};

export default DailyVideos;
