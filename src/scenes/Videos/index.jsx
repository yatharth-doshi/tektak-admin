import { Box, Button, Typography, useTheme, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllVideos, deleteVideo, fetchVideoAnalytics } from "../../Api/adminApi";
import { useInView } from "react-intersection-observer";

const Videos = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [videos, setVideos] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dailyVideosCount, setDailyVideosCount] = useState(0);
  const [monthlyVideosCount, setMonthlyVideosCount] = useState(0);
  const [weeklyVideosCount, setWeeklyVideosCount] = useState(0);

  // Fetch all videos
  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchAllVideos();
        const updatedData = result.data.map((video) => ({
          ...video,
          active: true,
        }));
        setCount(result.count);
        setVideos(updatedData);
      } catch (error) {
        console.error("Fetching videos error", error);
      }
    };
    getData();
  }, [refresh]);

  // Fetch video analytics
  useEffect(() => {
    const getVideoAnalytics = async () => {
      try {
        const analytics = await fetchVideoAnalytics();
        setDailyVideosCount(analytics?.count?.daily || 0);
        setWeeklyVideosCount(analytics?.count?.weekly || 0);
        setMonthlyVideosCount(analytics?.count?.monthly || 0);
      } catch (error) {
        console.log('Error fetching video analytics:', error);
      }
    };
    getVideoAnalytics();
  }, []);

  // Delete video handlers
  const handleDeleteClick = (videoId) => {
    setSelectedVideoId(videoId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteVideo(selectedVideoId);
      setRefresh(!refresh);
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

  const handleDailyVideos = () => navigate("/dailyVideos");
  const handleWeeklyVideos = () => navigate("/weeklyVideos");
  const handleMonthlyVideos = () => navigate("/monthlyVideos");
  const handleUser = (id) => navigate("/userProfile", { state: { userPK: id } });

  return (
    <Box sx={{ height: "87vh", overflowY: "auto" }}>
      <Box m="20px">
        <Box display="grid" gridTemplateColumns="repeat(6, 3fr)" gap="20px">
          <Box display="flex" justifyContent="space-between" alignItems="center" gridColumn="span 6">
            <Header title="TOTAL video" subtitle="Managing the All video" />
          </Box>
        </Box>
      </Box>

      <Box m="20px">
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap="20px">
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={handleDailyVideos}
          >
            <StatBox
              subtitle="Daily Video"
              title={dailyVideosCount}
              icon={<PlayCircleIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={handleWeeklyVideos}
          >
            <StatBox
              title={weeklyVideosCount}
              subtitle="Weekly Video"
              icon={<OndemandVideoIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={handleMonthlyVideos}
          >
            <StatBox
              title={monthlyVideosCount}
              subtitle="Monthly Video"
              icon={<VideoLibraryIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <StatBox
              title={count}
              subtitle="Total Video"
              icon={<LibraryAddIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
        </Box>

        <Box my="20px" display="grid" gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap="20px">
          {videos.map((video, index) => {
            return (
              <VideoCard
                key={index}
                video={video}
                colors={colors}
                handleUser={handleUser}
                handleDeleteClick={handleDeleteClick}
              />
            );
          })}
        </Box>

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
    </Box>
  );
};

const VideoCard = ({ video, colors, handleUser, handleDeleteClick }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <Box
      ref={ref}
      backgroundColor={colors.primary[400]}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding="10px"
      position="relative"
    >
      {inView ? (
        <video
          src={video.videoUrl}
          width="100%"
          height={"200px"}
          style={{ objectFit: "cover" }}
          controls
        ></video>
      ) : (
        <Box width="100%" height="200px" backgroundColor={colors.grey[500]} />
      )}
      <Box display="flex" gap={1} mt={1} width="100%">
        <Button variant="contained" color="secondary" fullWidth onClick={() => handleUser(video.userId)}>
          View Profile
        </Button>
        <Button variant="contained" color="error" onClick={() => handleDeleteClick(video._id)}>
          <DeleteIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default Videos;
