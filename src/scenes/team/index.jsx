import { useEffect, useState } from "react";
import { Box, Typography, useTheme, Button, Avatar } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import StarIcon from '@mui/icons-material/Star';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { tokens } from "../../theme";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import TrafficIcon from "@mui/icons-material/Traffic";
import { useNavigate } from "react-router-dom";
import StatBox from "../../components/StatBox";
import Header from "../../components/Header";
import CRUDModal from "../../components/CRUDModal";
import img from '../podcast/image1.jpeg'
import UserVideo from "../../components/UserVideo";
import UserPodcast from "../../components/UserPodcast";
import UserEvents from "../../components/UserEvents";
import UserJobs from "../../components/UserJobs";
import { fetchAllUsers, updateUser, fetchUserAnalytics, fetchUserById, deleteUser } from "../../Api/adminApi";

const Team = ({ onBack, userId }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [team, setTeam] = useState([]);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [count, setCount] = useState(0)
  const [dailyUserCount, setDailyUserCount] = useState(0)
  const [monthlyUserCount, setMonthlyUserCount] = useState(0)
  const [weeklyUserCount, setWeeklyUserCount] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const navigate = useNavigate();

  // CRUD Modal states
  const [crudModalOpen, setCrudModalOpen] = useState(false);
  const [crudMode, setCrudMode] = useState('create');
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [crudLoading, setCrudLoading] = useState(false);


  // Fetch all users
  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchAllUsers();
        console.log("Fetched users:", result);
        
        // Handle different response structures
        const userData = result?.data || result || [];
        const userCount = result?.count || userData.length || 0;
        
        const updatedData = Array.isArray(userData) ? userData.map(user => ({
          ...user,
          active: true
        })) : [];
        
        setCount(userCount);
        setTeam(updatedData);
      } catch (error) {
        console.error('Fetching users error', error);
      }
    };
    getData();
  }, [refresh]);

  // Fetch user analytics
  useEffect(() => {
    const getUserAnalytics = async () => {
      try {
        const analytics = await fetchUserAnalytics();
        setDailyUserCount(analytics?.count?.daily || 0);
        setWeeklyUserCount(analytics?.count?.weekly || 0);
        setMonthlyUserCount(analytics?.count?.monthly || 0);
      } catch (error) {
        console.log('Error fetching user analytics:', error);
      }
    };
    getUserAnalytics();
  }, []);

  const DailyUserHandle = () => {
    navigate('/dailyuser');
  };

  const WeeklyUserHandle = () => {
    navigate('/weeklyuser');
  };

  const MonthlyUserHandle = () => {
    navigate('/monthlyuser');
  };


  const handleViewProfileClick = (user) => {
    setSelectedUser(user);
  };

  const handleBackClick = () => {
    setSelectedUser(null);
  };



  // Toggle user block status
  const deActivateUser = async (id, currentStatus) => {
    const isBlocked = currentStatus === "true";
    const updatedStatus = !isBlocked; 
    const data = { "isBlocked": updatedStatus.toString() }; 
  
    try {
      await updateUser(id, data);
      setRefresh(!refresh);
  
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // CRUD Handlers
  const handleCreateUser = () => {
    setCrudMode('create');
    setSelectedUserForEdit({});
    setCrudModalOpen(true);
  };

  const handleEditUser = (user) => {
    setCrudMode('edit');
    setSelectedUserForEdit(user);
    setCrudModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    setCrudMode('delete');
    setSelectedUserForEdit(user);
    setCrudModalOpen(true);
  };

  const handleCRUDSubmit = async (data) => {
    setCrudLoading(true);
    try {
      if (crudMode === 'create') {
        // Note: You'll need to implement createUser API
        alert('User creation feature needs backend implementation');
      } else if (crudMode === 'edit') {
        await updateUser(selectedUserForEdit.Users_PK, data);
        alert('User updated successfully');
      } else if (crudMode === 'delete') {
        await deleteUser(selectedUserForEdit.Users_PK);
        alert('User deleted successfully');
      }
      setRefresh(!refresh);
      setCrudModalOpen(false);
      setSelectedUserForEdit(null);
    } catch (error) {
      alert(`Failed to ${crudMode} user`);
    } finally {
      setCrudLoading(false);
    }
  };

  const handleCrudModalClose = () => {
    setCrudModalOpen(false);
    setSelectedUserForEdit(null);
  };


  const columns = [
    {
      field: "profile",
      headerName: "Profile",
      flex: 1,
      renderCell: (params) => (
        <Avatar alt={img} src={params.row.picUrl} />
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      valueGetter: (params) => params.row.name,
      cellClassName: (params) => params.row.active ? "name-column--cell" : "name-column--cell inactive",
    },
    {
      field: "isBlocked",
      headerName: "Status",
      flex: 1,
      valueGetter: (params) => params.row.isBlocked,
      cellClassName: (params) => params.row.active ? "" : "inactive",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      valueGetter: (params) => params.row.email,
      cellClassName: (params) => params.row.active ? "" : "inactive",
    },
    {
      field: "role",
      headerName: "Role",
      flex: 1,
      valueGetter: (params) => params.row.role,
      cellClassName: (params) => params.row.active ? "" : "inactive",
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300,
      renderCell: (params) => (
        <Box display="flex" gap="8px">
          <Button variant="contained" color="primary" size="small" onClick={() => handleViewProfileClick(params.row)}>
            Profile
          </Button>
          <Button 
            variant="contained" 
            color="info" 
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEditUser(params.row)}
          >
            Edit
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteUser(params.row)}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color={params.row.isBlocked === "true" ? "success" : "warning"}
            size="small"
            onClick={() => {
              console.log("Helllo ",params.row.Users_PK, params.row.isBlocked);
              deActivateUser(params.row.Users_PK, params.row.isBlocked); 
            }}
          >
            {params.row.isBlocked === "true" ? "Activate" : "Deactivate"}
          </Button>
        </Box>
      ),
    },
  ];

  // State to control the video modal visibility
  const [openVedioModal, setOpenVideoModal] = useState(false);
  const [openPodcastModal, setOpenPodcastModal] = useState(false);
  const [openEventsModal, setOpenEventsModal] = useState(false);
  const [openJobsModal, setOpenJobsModal] = useState(false);
  const [userDataJobsCount, setUserDataJobsCount] = useState(0);
  const [userDataVideoCount, setUserDataVideoCount] = useState(0);
  const [userDataPodcastCount, setUserDataPodcastCount] = useState(0);
  const [userDataEventCount, setUserDataEventCount] = useState(0);
  const [userDataJobs, setUserDataJobs] = useState([]);
  const [userDataVideo, setUserDataVideo] = useState([]);
  const [userDataPodcast, setUserDataPodcast] = useState([]);
  const [userDataEvent, setUserDataEvent] = useState([]);

  // Handler for modal
  const handleOpenVideoModal = () => setOpenVideoModal(true);
  const handleCloseVideoModal = () => setOpenVideoModal(false);
  const handleOpenPodcastModal = () => setOpenPodcastModal(true);
  const handleClosePodcastModal = () => setOpenPodcastModal(false);
  const handleOpenEventsModal = () => setOpenEventsModal(true);
  const handleCloseEventsModal = () => setOpenEventsModal(false);
  const handleOpenJobsModal = () => setOpenJobsModal(true);
  const handleCloseJobsModal = () => setOpenJobsModal(false);

  useEffect(() => {
    if (selectedUser) {
      const fetchUserDataCount = async () => {
        try {
          const response = await fetchUserById(selectedUser.Users_PK);
          const jobsData = response.data.jobs; 
          const podcastData = response.data.podcast; 
          const eventData = response.data.events; 
          const videoData = response.data.videos; 
          setUserDataJobsCount(jobsData); 
          setUserDataEventCount(eventData); 
          setUserDataPodcastCount(podcastData); 
          setUserDataVideoCount(videoData); 
          setUserDataJobs(jobsData)
          setUserDataEvent(eventData)
          setUserDataPodcast(podcastData)
          setUserDataVideo(videoData)
        } catch (error) {
          console.error("Error fetching user data count:", error);
        }
      };
  
      fetchUserDataCount();
    }
  }, [selectedUser]);


  if (selectedUser) {
    const textStyle = selectedUser.active
      ? {}
      : { color: 'red', filter: 'blur(2px)', textDecoration: 'line-through' };

    return (
      <Box m="40px 0" display="flex" flexDirection="column" alignItems="center" >
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          gap="20px"
          sx={{ width: "75%", height: "250px" }}
        >
          {/* Left side: Profile Image */}
          <Box
            flexBasis={{ xs: '100%', sm: '30%' }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor={colors.primary[400]}
            padding="20px"
            borderRadius="8px"
            boxShadow="0 3px 10px rgba(0, 0, 0, 0.2)"
          >
            <Avatar alt={selectedUser.name} src={selectedUser.picUrl} sx={{ width: '180px', height: '180px', border: `2px solid ${colors.grey[100]}` }} />
          </Box>
          {/* Right side: User Data */}
          <Box
            flexBasis={{ xs: '100%', sm: '70%' }}
            backgroundColor={colors.primary[400]}
            padding="20px"
            borderRadius="8px"
            boxShadow="0 3px 10px rgba(0, 0, 0, 0.2)"
          >
            <Typography variant="h4" sx={{ color: '#4CCEAC', marginTop: '12px' }} gutterBottom>
              {selectedUser.name}
            </Typography>
            <Typography variant="subtitle1" color={colors.grey[100]} gutterBottom>
              {selectedUser.role}
            </Typography>
            <Typography variant="subtitle1" color={colors.grey[100]} gutterBottom>
              Email{selectedUser.email}
            </Typography>

            {/* Rating component with yellow icon */}
            <Box display="flex" alignItems="center" marginBottom="10px">
              <Box>
                <StarIcon sx={{ color: '#FFD700', marginRight: '2px' }} />
                <StarIcon sx={{ color: '#FFD700', marginRight: '2px' }} />
                <StarIcon sx={{ color: '#FFD700', marginRight: '2px' }} />
                <StarIcon sx={{ color: '#FFD700', marginRight: '2px' }} />
                <StarIcon sx={{ color: '#FFD700', marginRight: '2px' }} />
              </Box>
              <Typography variant="body2" color={colors.grey[100]}>
                4.7 out of 5
              </Typography>
            </Box>
            <Typography variant="body2" color={colors.grey[100]} gutterBottom>
              Global rating
            </Typography>
            <Button variant="contained" sx={{ backgroundColor: '#4CCEAC', marginTop: '20px' }} onClick={handleBackClick}>
              Back to List
            </Button>
          </Box>
        </Box>
        {/* StatBoxes */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(4, 1fr)"
          gap="10px"
          mt="30px"
          sx={{ width: "75%" }}
        >
          <Box backgroundColor={colors.primary[400]} display="flex" alignItems="center" padding="30px 5px" justifyContent="center" boxShadow="0 3px 10px rgba(0, 0, 0, 0.2)" onClick={handleOpenJobsModal}>
            <StatBox
              subtitle="Total Jobs"
              title={userDataJobsCount.length}
              icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" boxShadow="0 3px 10px rgba(0, 0, 0, 0.2)"
            // onClick={handlepodcast}
            onClick={handleOpenPodcastModal}
          >
            <StatBox
              subtitle="Total Podcast"
              title={userDataPodcastCount.length}
              icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxShadow="0 3px 10px rgba(0, 0, 0, 0.2)"
            // onClick={handledailyviewer}
            // onClick={handlevideo}
            onClick={handleOpenVideoModal}
          >
            <StatBox
              subtitle="Total Video"
              title={userDataVideoCount.length}
              icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" boxShadow="0 3px 10px rgba(0, 0, 0, 0.2)" onClick={handleOpenEventsModal}>
            <StatBox
              subtitle="Total Events"
              title={userDataEventCount.length}
              icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
        </Box>
        <UserVideo open={openVedioModal} handleClose={handleCloseVideoModal} data={userDataVideo} />
        <UserEvents open={openEventsModal} handleClose={handleCloseEventsModal} data={userDataEvent} />
        <UserPodcast open={openPodcastModal} handleClose={handleClosePodcastModal} data={userDataPodcast} />
        <UserJobs open={openJobsModal} handleClose={handleCloseJobsModal} data={userDataJobs} />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "87vh", overflowY: "auto", padding: "20px" }}>
      <Box>
        <Box display="grid" gridTemplateColumns="repeat(6, 3fr)" gridAutoRows="140px" gap="20px">
          <Box display="flex" justifyContent="center" alignItems="center" gridColumn="span 6">
            <Header title="TOTAL USERS" subtitle="Managing the All Users" />
          </Box>
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" onClick={DailyUserHandle}>
            <StatBox
              subtitle="Daily User"
              title={dailyUserCount}
              icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" onClick={WeeklyUserHandle}>
            <StatBox
              title={weeklyUserCount}
              subtitle="Weekly User"
              icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" onClick={MonthlyUserHandle}>
            <StatBox
              title={monthlyUserCount}
              subtitle="Monthly User"
              icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
            <StatBox
              title={`${count}`}
              subtitle="Total User"
              icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
        </Box>

        {/* Add User Button - positioned after stat boxes and before data table */}
        <Box display="flex" justifyContent="flex-end" m="20px 0">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateUser}
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.grey[100],
              '&:hover': {
                backgroundColor: colors.greenAccent[500],
              }
            }}
          >
            Add User
          </Button>
        </Box>

        <Box m="40px 0 0 0" height="75vh" sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .name-column--cell.inactive": { filter: 'blur(2px)', color: 'red', textDecoration: 'line-through' },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
        }}>
          <DataGrid rows={team} columns={columns} getRowId={(row) => row.Users_PK} />
        </Box>

        {/* CRUD Modal */}
        <CRUDModal
          open={crudModalOpen}
          onClose={handleCrudModalClose}
          onSubmit={handleCRUDSubmit}
          mode={crudMode}
          data={selectedUserForEdit}
          loading={crudLoading}
          fields={[
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'role', label: 'Role', type: 'select', required: true, options: [
              { value: 'entrepreneur', label: 'Entrepreneur' },
              { value: 'investor', label: 'Investor' },
              { value: 'viewer', label: 'Viewer' }
            ]},
            { name: 'isBlocked', label: 'Status', type: 'select', required: true, options: [
              { value: 'false', label: 'Active' },
              { value: 'true', label: 'Blocked' }
            ]}
          ]}
        />
      </Box>
    </Box>
  );
};

export default Team;
