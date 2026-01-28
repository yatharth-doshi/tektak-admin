import { useState, useEffect } from "react";

import { Box, Typography, useTheme, Button, Avatar } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { tokens } from "../../theme";

import Header from "../../components/Header";

import TrafficIcon from "@mui/icons-material/Traffic";

import StarIcon from '@mui/icons-material/Star';

import AddIcon from '@mui/icons-material/Add';

import EditIcon from '@mui/icons-material/Edit';

import DeleteIcon from '@mui/icons-material/Delete';

import StatBox from "../../components/StatBox";

import UserVideo from "../../components/UserVideo";

import UserPodcast from "../../components/UserPodcast";

import UserEvents from "../../components/UserEvents";

import UserJobs from "../../components/UserJobs";

import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';

import { useNavigate } from "react-router-dom";

import { fetchAllViewersCount } from "../../Api/Viewers/AllviewerCount.api";

import { fetchViewers, updateUser, fetchUserById, deleteUser } from "../../Api/adminApi";

import CRUDModal from "../../components/CRUDModal";



const Viewer = ({ onBack }) => {

  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  const [selectedUser, setSelectedUser] = useState(null);

  const [count, setCount] = useState(0)

  const [userCount, seUserCount] = useState(0)

  const [viewers, setViewers] = useState([])

  const [refresh, setRefresh] = useState(false)

  

  // CRUD Modal states

  const [crudModalOpen, setCrudModalOpen] = useState(false);

  const [crudMode, setCrudMode] = useState('create');

  const [selectedViewer, setSelectedViewer] = useState(null);

  const [crudLoading, setCrudLoading] = useState(false);

  

  const navigate = useNavigate()



  const DailyViewerHandle = () => {

    navigate('/dailyViewer')

  }

  const WeeklyViewerHandle = () => {

    navigate('/weeklyViewer')

  }

  const MonthlyViewerHandle = () => {

    navigate('/monthlyViewer')

  }



  // CRUD Handlers

  const handleCreateViewer = () => {

    setCrudMode('create');

    setSelectedViewer({});

    setCrudModalOpen(true);

  };



  const handleEditViewer = (viewer) => {

    setCrudMode('edit');

    setSelectedViewer(viewer);

    setCrudModalOpen(true);

  };



  const handleDeleteViewer = (viewer) => {

    setCrudMode('delete');

    setSelectedViewer(viewer);

    setCrudModalOpen(true);

  };



  const handleCRUDSubmit = async (data) => {

    setCrudLoading(true);

    try {

      if (crudMode === 'create') {

        alert('Create functionality needs to be implemented in backend API');

      } else if (crudMode === 'edit') {

        await updateUser(selectedViewer.Users_PK, data);

        alert('Viewer updated successfully');

      } else if (crudMode === 'delete') {

        await deleteUser(selectedViewer.Users_PK);

        alert('Viewer deleted successfully');

      }

      setRefresh(!refresh);

    } catch (error) {

      alert(`Failed to ${crudMode} viewer`);

    } finally {

      setCrudLoading(false);

    }

  };



  const handleCrudModalClose = () => {

    setCrudModalOpen(false);

    setSelectedViewer(null);

  };

  const handleViewProfileClick = (user) => {

    setSelectedUser(user);

  };



  const handleActiveToggle = (userId) => {

    const updatedTeamData = viewer.map((user) =>

      user.Users_PK === userId ? { ...user, active: !user.active } : user

    );

    setViewer(updatedTeamData);

    if (selectedUser && selectedUser.Users_PK === userId) {

      setSelectedUser({ ...selectedUser, active: !selectedUser.active });

    }

  };



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





  // ////////////////////////////////////////////// //

  const [viewer, setViewer] = useState([])

  const [dailyViewerCount, setDailyViewerCount] = useState(0)

  const [monthlyViewerCount, setMonthlyViewerCount] = useState(0)

  const [weeklyViewerCount, setWeeklyViewerCount] = useState(0)





  useEffect(() => {

    const getData = async () => {

      try {

        const result = await fetchViewers();

        console.log("Viewer API response:", result);

        

        // Handle different response structures

        const viewerData = result?.data?.data || result?.data || result || [];

        const viewerCount = result?.data?.count || result?.count || viewerData.length || 0;

        console.log("Viewer data extracted:", viewerData);
        console.log("Viewer count extracted:", viewerCount);

        

        const updatedData = Array.isArray(viewerData) ? viewerData.map(user => ({

          ...user,

          active: true

        })) : [];



        console.log("Updated viewer data:", updatedData);



        setCount(viewerCount);

        setViewer(updatedData);

      }

      catch (error) {

        console.error('Fetching data error', error);

      }

    }

    getData();

  }, [refresh])



  // Handle Diactivate User 

  const deActivateUser = async (id, currentStatus) => {

    console.log(currentStatus, "currentStatus");



    const isBlocked = currentStatus === "true";

    const updatedStatus = !isBlocked;

    const data = { "isBlocked": updatedStatus.toString() };



    console.log('Toggling block status for user ID:', id, 'New Status:', updatedStatus);



    try {

      const response = await updateUser(id, data);

      console.log('Response:', response);

      setRefresh(!refresh)



    } catch (error) {

      console.error('Error updating user status:', error);

    }

  };



  const handleBackClick = () => {

    setSelectedUser(null)

  }



  // Get Count By Day 

  useEffect(() => {

    const getUserCount = async () => {

      try {

        const users = await fetchAllViewersCount();

        console.log("Viewer Analytics:", users);

        setDailyViewerCount(users?.count?.daily || 0);

        setWeeklyViewerCount(users?.count?.weekly || 0);

        setMonthlyViewerCount(users?.count?.monthly || 0);

      } catch (error) {

        console.log(error);

      }

    };

    getUserCount();

  }, []);



  // handle Sub Admin 

  // const onSubAdminClick = async (userId) => {

  //   try {

  //     const result = await handleSubAdmin(userId);

  //     console.log("Sub-admin created:", result);

  //   } catch (error) {

  //     console.error("Failed to create sub-admin:", error.message);

  //   }

  // };



  // /////////////////////////////////////////////  //

  const columns = [

    { field: "id", headerName: "ID", valueGetter: (params) => params.row.Users_PK, minWidth: 150 },

    {

      field: "name",

      headerName: "Name",

      flex: 1,

      valueGetter: (params) => params.row.name,

      cellClassName: (params) => params.row.active ? "name-column--cell" : "name-column--cell inactive",

      minWidth: 150,

      flex: 1,

    },

    {

      field: "email",

      headerName: "Email",

      flex: 1,

      valueGetter: (params) => params.row.email,

      cellClassName: (params) => params.row.active ? "" : "inactive",

      minWidth: 200, // Emails are usually longer, so we set a larger minWidth

      flex: 1,

    },

    {

      field: "role",

      headerName: "Role",

      flex: 1,

      valueGetter: (params) => params.row.role,

      cellClassName: (params) => params.row.active ? "" : "inactive",

      minWidth: 150, // Set width for roles

      flex: 1,

    },

    {

      field: 'actions',

      headerName: 'Actions',

      renderCell: (params) => (

        <Box display="flex" gap="8px" flexWrap="wrap">

          <Button variant="contained" color="primary" size="small" onClick={() => handleViewProfileClick(params.row)}>

            Profile

          </Button>

          <Button

            variant="contained"

            color="info"

            size="small"

            startIcon={<EditIcon />}

            onClick={() => handleEditViewer(params.row)}

          >

            Edit

          </Button>

          <Button

            variant="contained"

            color="error"

            size="small"

            startIcon={<DeleteIcon />}

            onClick={() => handleDeleteViewer(params.row)}

          >

            Delete

          </Button>

          <Button

            variant="contained"

            color={params.row.isBlocked === "true" ? "success" : "warning"}

            size="small"

            onClick={() => {

              deActivateUser(params.row.Users_PK, params.row.isBlocked);

            }}

          >

            {params.row.isBlocked === "true" ? "Activate" : "Deactivate"}

          </Button>

        </Box>

      ),

      minWidth: 400,

      align: "center",

    },

  ];



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

          console.log(response.data, "Hello Selected user data count"); 

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

            <Typography variant="body2" color={colors.grey[100]} gutterBottom>

              {selectedUser.email}

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

          <Box backgroundColor={colors.primary[400]} display="flex" alignItems="center" padding="30px 5px" justifyContent="center" boxShadow="0 3px 10px rgba(0, 0, 0, 0.2)"

            onClick={handleOpenJobsModal}

          >

            <StatBox

              subtitle="Total Jobs"

              title={userDataJobsCount.length}

              icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}

            />

          </Box>

          <Box backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" boxShadow="0 3px 10px rgba(0, 0, 0, 0.2)"

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

            onClick={handleOpenVideoModal}

          >

            <StatBox

              subtitle="Total Video"

              title={userDataVideoCount.length}

              icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}

            />

          </Box>

          <Box backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" boxShadow="0 3px 10px rgba(0, 0, 0, 0.2)"

            onClick={handleOpenEventsModal}

          >

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

      <Box component="div" >

        <Box display="grid" gridTemplateColumns="repeat(6, 3fr)" gridAutoRows="140px" gap="20px">
          <Box display="flex" justifyContent="center" alignItems="center" gridColumn="span 6">
            <Header title="TOTAL VIEWER" subtitle="Managing the All Viewer" />
          </Box>
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" onClick={DailyViewerHandle}>
            <StatBox
              title={dailyViewerCount}
              subtitle="Daily Viewer"
              icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" onClick={WeeklyViewerHandle}>
            <StatBox
              title={weeklyViewerCount}
              subtitle="Weekly Viewer"
              icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" onClick={MonthlyViewerHandle}>
            <StatBox
              title={monthlyViewerCount}
              subtitle="Monthly Viewer"
              icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
            <StatBox
              title={`${count}`}
              subtitle="Total Viewer"
              icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
        </Box>

        {/* Add Viewer Button - positioned after stat boxes and before data table */}
        <Box display="flex" justifyContent="flex-end" m="20px 0">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateViewer}
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.grey[100],
              '&:hover': {
                backgroundColor: colors.greenAccent[500],
              }
            }}
          >
            Add Viewer
          </Button>
        </Box>

        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": { border: "none" },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",

              padding: '8px',  // Add padding for better readability

            },

            "& .name-column--cell": {

              color: colors.greenAccent[300]

            },

            "& .name-column--cell.inactive": {

              filter: 'blur(2px)',

              color: 'red',

              textDecoration: 'line-through'

            },

            "& .MuiDataGrid-columnHeaders": {

              backgroundColor: colors.blueAccent[700],

              borderBottom: "none",

              fontSize: '16px',  // Larger header text

              fontWeight: 'bold', // Bold headers for better distinction

              textAlign: 'center',  // Center align the header text

            },

            "& .MuiDataGrid-virtualScroller": {

              backgroundColor: colors.primary[400]

            },

            "& .MuiDataGrid-footerContainer": {

              borderTop: "none",

              backgroundColor: colors.blueAccent[700],

              padding: '10px'  // Add padding for better spacing

            },

            "& .MuiCheckbox-root": {

              color: `${colors.greenAccent[200]} !important`

            },

          }}

        >

          <DataGrid

            checkboxSelection

            rows={viewer}

            columns={columns.map((column) => ({

              ...column,

              flex: 1,  // Ensure equal width for all columns

              headerAlign: 'center',  // Center-align the header text

              align: 'center',  // Center-align the cell text

            }))}

            getRowId={(row) => row.Users_PK}

          />

        </Box>



        {/* CRUD Modal */}

        <CRUDModal

          open={crudModalOpen}

          handleClose={handleCrudModalClose}

          mode={crudMode}

          title={`${crudMode === 'create' ? 'Add' : crudMode === 'edit' ? 'Edit' : 'Delete'} Viewer`}

          initialData={selectedViewer}

          fields={[

            { name: 'name', label: 'Name', required: true },

            { name: 'email', label: 'Email', required: true, type: 'email' },

            { name: 'role', label: 'Role', required: true },

            { name: 'phone', label: 'Phone', type: 'tel' },

            { name: 'address', label: 'Address' },

            { name: 'city', label: 'City' },

            { name: 'country', label: 'Country' },

          ]}

          onSubmit={handleCRUDSubmit}

          loading={crudLoading}

        />



      </Box>

    </Box>

  );

};



export default Viewer;

