import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { tokens } from "../../theme";
import { useTheme, Box, Typography, Button, Card, CardMedia, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import StatBox from "../../components/StatBox";
import PodcastsIcon from '@mui/icons-material/Podcasts';
import DeleteIcon from '@mui/icons-material/Delete';
import img3 from './img3.jpeg';
import { fetchAllPodcasts, deletePodcast, fetchPodcastAnalytics } from "../../Api/adminApi";


const Podcast = () => {
  const navigate = useNavigate()
  const [count, setCount] = useState(0);
  const [podcast, setPodcast] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPodcastId, setSelectedPodcastId] = useState(null);
  const [dailyPodcastsCount, setDailyPodcastsCount] = useState(0);
  const [monthlyPodcastsCount, setMonthlyPodcastsCount] = useState(0);
  const [weeklyPodcastsCount, setWeeklyPodcastsCount] = useState(0);

  // Fetch all podcasts
  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchAllPodcasts();
        const updatedData = result.data.map(item => ({
          ...item,
          active: true,
        }));
        setCount(result.count);
        setPodcast(updatedData);
      } catch (error) {
        console.error('Fetching podcasts error', error);
      }
    };
    getData();
  }, [refresh]);

  // Fetch podcast analytics
  useEffect(() => {
    const getPodcastAnalytics = async () => {
      try {
        const analytics = await fetchPodcastAnalytics();
        setDailyPodcastsCount(analytics?.count?.daily || 0);
        setWeeklyPodcastsCount(analytics?.count?.weekly || 0);
        setMonthlyPodcastsCount(analytics?.count?.monthly || 0);
      } catch (error) {
        console.log('Error fetching podcast analytics:', error);
      }
    };
    getPodcastAnalytics();
  }, []);

  const { img } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleUser = (id) => {
    navigate('/userProfile', { state: { userPK: id } });
  };

  const handleDetailClick = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };

  // Delete podcast handlers
  const handleDeleteClick = (podcastId) => {
    setSelectedPodcastId(podcastId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePodcast(selectedPodcastId);
      setRefresh(!refresh);
      setDeleteDialogOpen(false);
      setSelectedPodcastId(null);
    } catch (error) {
      console.error("Error deleting podcast:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedPodcastId(null);
  };

  const handleClose = () => {
    setOpen(false); // Close the modal
  };

  const handleDailyPodcast = () => {
    navigate('/dailyPodcast')
  }
  const handleWeeklyPodcast = () => {
    navigate('/weeklyPodcats')
  }
  const handleMonthlyPodcast = () => {
    navigate('/monthlyPodcast')
  }

  return (
    <Fragment>
      <Box px={6} overflow="auto" position="relative" sx={{ height: "87vh", overflowY: "auto", padding: "20px" }}>
        {/* Stats */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(12, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={handleDailyPodcast}
          >
            <StatBox
              subtitle="Daily Podcast"
              title={dailyPodcastsCount}
              icon={
                <PodcastsIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={handleWeeklyPodcast}
          >
            <StatBox
              title={weeklyPodcastsCount}
              subtitle="Weekly Podcast"
              icon={
                <PodcastsIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            onClick={handleMonthlyPodcast}
          >
            <StatBox
              title={monthlyPodcastsCount}
              subtitle="Monthly Podcast"
              icon={
                <PodcastsIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
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
              subtitle="Total Podcast"
              icon={
                <PodcastsIcon
                  sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                />
              }
            />
          </Box>
        </Box>

        {/* Similar Podcasts Section */}
        <Typography variant="h6" mt={4} mb={2} style={{ color: "#4CCEAC" }}>Similar Podcasts</Typography>
        <Box display="flex" flexWrap="wrap" gap={2} >
          {podcast.map((elm, ind) => (
            <Card key={ind} sx={{ width: { xs: '100%', sm: '32%' }, position: 'relative', height: '300px' }}>
              <CardMedia
                component="img"
                image={elm.picUrl ? elm.picUrl : img3}
                alt={`Img-${ind}`}
                sx={{ height: '100%' }}
              />
              <Box position="absolute" bottom={0} left={0} width="100%" bgcolor="rgba(0,0,0,0.6)" color="white" p={2}>
                <Typography variant="h4" style={{ color: "#4CCEAC" }}>{elm.episodeTitle}</Typography>
                <Typography variant="h6">Type : {elm.podcastType}</Typography>
                <Typography variant="h6">Poster Name: {elm?.user?.name || "Hello"}</Typography>
                <Box display="flex" justifyContent="space-between" gap={1}>
                  <Button variant="contained" color="secondary" onClick={() => handleDetailClick(elm)}>
                    Detail
                  </Button>
                  <Button variant="contained" color="secondary" onClick={() =>handleUser(elm.userID)}>
                    View Profile
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleDeleteClick(elm._id)}>
                    <DeleteIcon />
                  </Button>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this podcast? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} color="primary">Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
          </DialogActions>
        </Dialog>

        {/* Modal for Podcast Details */}
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle sx={{ backgroundColor: colors.primary[400], color: colors.greenAccent[100] }}>
            Podcast Details
          </DialogTitle>
          <DialogContent
            sx={{ backgroundColor: colors.primary[400] }}
          >
            {selectedImage && (
              <Box display="flex" gap={4}>
                <Card sx={{ width: { xs: '100%', sm: '40%' }, maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    image={selectedImage.picUrl || img3}
                    alt="Podcast Image"
                    sx={{ height: { lg: '230px', sm: 'auto' }, width: '100%' }}
                  />
                </Card>
                <Box width="60%" mx="auto">
                  <Typography variant="h3" style={{ color: "#4CCEAC" }}>
                    {selectedImage.episodeTitle}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: "12px" }}>
                    Episode No: {selectedImage.episodeNumber}
                  </Typography>
                  <Typography variant="body1" sx={{ my: "7px" }}>
                    {selectedImage.episodeDescription}
                  </Typography>
                  <Typography variant="body1" sx={{ my: "7px" }}>
                    Title : {selectedImage.podcastType}
                  </Typography>
                  <Typography variant="body2" sx={{ my: "7px" }}>
                    Session: {selectedImage.seasonNumber}
                  </Typography>
                  <Typography variant="body2" sx={{ my: "7px" }}>
                    Duration: {selectedImage.podcastDuration}
                  </Typography>
                  {/* <Typography variant="h5" sx={{ my: "7px" }}>
                    Speaker: {selectedImage.speakers}
                  </Typography> */}
                  {/* <Typography variant="h6" style={{ color: "#4CCEAC" }} sx={{ mt: "20px" }}>
                    Publisher: {selectedImage.user.name}
                  </Typography> */}
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ backgroundColor: colors.primary[400] }}>
            <Button onClick={handleClose} color="info">
              Close
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
    </Fragment>
  );
};

export default Podcast;
