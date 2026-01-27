import { Box, useTheme, Button, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StatBox from "../../components/StatBox";
import { tokens } from "../../theme";
import WorkIcon from '@mui/icons-material/Work';
import DeleteIcon from '@mui/icons-material/Delete';
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { fetchAllJobs, toggleJobActivation, deleteJob, fetchJobAnalytics } from "../../Api/adminApi";



const GetJobs = () => {

  const [count, setCount] = useState(0)
  const [jobs, setJobs] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedJobId, setSelectedJobId] = useState(null)
  const navigate = useNavigate()
  const [dailyJobsCount, setDailyJobsCount] = useState(0)
  const [monthlyJobsCount, setMonthlyJobsCount] = useState(0)
  const [weeklyJobsCount, setWeeklyJobsCount] = useState(0)

  // Fetch all jobs
  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchAllJobs();
        console.log("Fetched jobs:", result);
        const updatedData = result.data.map(job => ({
          ...job,
          active: true
        }));
        setCount(result.count)
        setJobs(updatedData);
      }
      catch (error) {
        console.error('Fetching jobs error', error);
      }
    }
    getData();
  }, [refresh])

  // Fetch job analytics
  useEffect(() => {
    const getJobAnalytics = async () => {
      try {
        const analytics = await fetchJobAnalytics(); 
        setDailyJobsCount(analytics?.count?.daily || 0);
        setWeeklyJobsCount(analytics?.count?.weekly || 0);
        setMonthlyJobsCount(analytics?.count?.monthly || 0);
      } catch (error) {
        console.log('Error fetching job analytics:', error);
      }
    };
    getJobAnalytics();
  }, []);

  const handleDailyJobs = () => navigate('/dailyJobs')
  const handleWeeklyJobs = () => navigate('/weeklyJobs')
  const handleMonthlyJobs = () => navigate('/monthlyJobs')
  const handleUser = (id) => navigate('/userProfile', { state: { userPK: id } });

  // Toggle job activation
  const toggleActivation = async (jobId, currentStatus) => {
    try {
      const updatedStatus = currentStatus === "true" ? "false" : "true";
      await toggleJobActivation(jobId, updatedStatus);
      setJobs(jobs.map(job =>
        job._id === jobId ? { ...job, isActivated: updatedStatus } : job
      ));
    } catch (error) {
      console.error('Error updating job activation status', error);
    }
  };

  // Delete job
  const handleDeleteClick = (jobId) => {
    setSelectedJobId(jobId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteJob(selectedJobId);
      setRefresh(!refresh);
      setDeleteDialogOpen(false);
      setSelectedJobId(null);
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedJobId(null);
  };


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box sx={{height:"87vh",overflowY:"auto", padding:"20px"}}>
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
          <Header title="TOTAL JOBS" subtitle="Managing the All Jobs" />
        </Box>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px">
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={handleDailyJobs}
        >
          <StatBox
            subtitle="Daily Jobs"
            title = {dailyJobsCount}
            icon={
              <WorkIcon
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
          onClick={handleWeeklyJobs}
        >
          <StatBox
            title={weeklyJobsCount}
            subtitle="Weekly Jobs"
            icon={
              <WorkIcon
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
          onClick={handleMonthlyJobs}
        >
          <StatBox
            title={monthlyJobsCount}
            subtitle="Monthly Jobs"

            icon={
              <WorkIcon
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
            title={`${count}`}
            subtitle="Total Jobs"
            icon={
              <WorkIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
      </Box>
      <Box my={3} backgroundColor={colors.primary[400]} p={4}>
        <Box
          display="flex"
          flexWrap="wrap" 
          gap={2}
          overflow="hidden" 
        >
          {jobs.map((job, index) => (
            <Box
              height="auto" 
              width={{ xs: "100%", sm: "48%", md: "32%" }}
              flexShrink={0}
              boxShadow={3}
              borderRadius={2}
              border={1}
              borderColor="grey.300"
              position="relative"
              p={2}
              mb={2} 
            >
              <Box>
                <Box display="flex" gap={2} alignItems="center">
                  <IconButton
                    style={{
                      backgroundColor: "rgb(61,165,138)",
                      borderRadius: "50%",
                      color: "white",
                      fontSize: "2rem",
                      padding: "0.5rem",
                    }}
                  >
                    {/* <TbBrandNeteaseMusic /> */}
                  </IconButton>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" style={{ color: "#4CCEAC" }}>
                      {job.jobTitle}
                    </Typography>
                    <Typography variant="body2" >{job.applicationDeadline}</Typography>
                  </Box>
                </Box>
                <Typography variant="body2" mt={2} color="textSecondary">
                  {job.workplaceType}
                </Typography>
                <Typography variant="body2" mt={1} color="textSecondary">
                  {job.salaryRange}
                </Typography>
              </Box>
              <Box textAlign="center" mt={2}>
              <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: job.isActivated === "true" ? "#4CCEAC" : "#EEEEEE",
                    color: job.isActivated === "true" ? "white" : "black",
                    "&:hover": {
                      bgcolor: job.isActivated === "true" ? "#3BA68F" : "#CCCCCC",
                    },
                  }}
                  onClick={() => toggleActivation(job._id, job.isActivated)}
                >
                  {job.isActivated === "true" ? "Deactivate" : "Activate"}
                </Button>
                <Box display="flex" gap={1} mt={1}>
                  <Button variant="contained" color="secondary" fullWidth
                    onClick={()=> handleUser(job?.poster?.Users_PK)}
                  >
                    View Profile
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error" 
                    onClick={() => handleDeleteClick(job._id)}
                    sx={{ minWidth: "50px" }}
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this job? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GetJobs;
