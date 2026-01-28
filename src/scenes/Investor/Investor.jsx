import { useEffect, useState } from "react";

import { Box, Typography, useTheme, Button, Avatar } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { tokens } from "../../theme";

import { mockDataTeam } from "../../data/mockData";

import Header from "../../components/Header";

import TrafficIcon from "@mui/icons-material/Traffic";

import StatBox from "../../components/StatBox";

import StarIcon from '@mui/icons-material/Star';

import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';

import AddIcon from '@mui/icons-material/Add';

import EditIcon from '@mui/icons-material/Edit';

import DeleteIcon from '@mui/icons-material/Delete';

import { useNavigate } from "react-router-dom";

import UserVideo from "../../components/UserVideo";

import UserPodcast from "../../components/UserPodcast";

import UserEvents from "../../components/UserEvents";

import UserJobs from "../../components/UserJobs";

import { fetchAllInvestorsCount } from "../../Api/Investors/allInvestorCount.api";

import { fetchInvestors, updateUser, fetchUserById, deleteUser } from "../../Api/adminApi";

import CRUDModal from "../../components/CRUDModal";





const Investor = ({ onBack }) => {

  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  const [teamData, setTeamData] = useState(mockDataTeam);

  const [selectedUser, setSelectedUser] = useState(null);

  const [count, setCount] = useState(0);

  const [dailyInvestorCount, setDailyInvestorCount] = useState(0);

  const [weeklyInvestorCount, setWeeklyInvestorCount] = useState(0);

  const [monthlyInvestorCount, setMonthlyInvestorCount] = useState(0);

  const [refresh, setRefresh] = useState(false)

  

  // CRUD Modal states

  const [crudModalOpen, setCrudModalOpen] = useState(false);

  const [crudMode, setCrudMode] = useState('create');

  const [selectedInvestor, setSelectedInvestor] = useState(null);

  const [crudLoading, setCrudLoading] = useState(false);



  const navigate = useNavigate()



  const DailyInvestorHandle = () => {

    navigate('/dailyinvestor')

  }

  const WeeklyInvestorHandle = () => {

    navigate('/weeklyinvestor')

  }

  const MonthlyInvestorHandle = () => {

    navigate('/monthlyinvestor')

  }



  const handleViewProfileClick = (user) => {

    setSelectedUser(user);

  };



  const [investors, setInvestors] = useState([])



  useEffect(() => {

    const getUserCount = async () => {

      try {

        const users = await fetchAllInvestorsCount();

        setDailyInvestorCount(users?.count?.daily || 0);

        setWeeklyInvestorCount(users?.count?.weekly || 0);

        setMonthlyInvestorCount(users?.count?.monthly || 0);

      } catch (error) {

        console.log(error);

      }

    };

    getUserCount();

  }, []);



  useEffect(() => {

    const getData = async () => {

      try {

        const result = await fetchInvestors();

        console.log("Investor API response:", result);

        

        // Handle different response structures

        const investorData = result?.data?.data || result?.data || result || [];

        const investorCount = result?.data?.count || result?.count || investorData.length || 0;

        console.log("Investor data extracted:", investorData);
        console.log("Investor count extracted:", investorCount);

        

        const updatedData = Array.isArray(investorData) ? investorData.map(user => ({

          ...user,

          active: true

        })) : [];



        console.log("Updated investor data:", updatedData);



        setCount(investorCount);

        setInvestors(updatedData);

      }

      catch (error) {

        console.error('Fetching data error', error);

      }

    }

    getData();

  }, [refresh])





  const deActivateUser = async (id, currentStatus) => {

    const isBlocked = currentStatus === "true";

    const updatedStatus = !isBlocked;

    const data = { "isBlocked": updatedStatus.toString() };



    try {

      const response = await updateUser(id, data);

      setRefresh(!refresh)

    } catch (error) {

      console.error('Error updating user status:', error);

    }

  };



  const handleBackClick = () => {

    setSelectedUser(null)

  }



  // CRUD Handlers

  const handleCreateInvestor = () => {

    setCrudMode('create');

    setSelectedInvestor({});

    setCrudModalOpen(true);

  };



  const handleEditInvestor = (investor) => {

    setCrudMode('edit');

    setSelectedInvestor(investor);

    setCrudModalOpen(true);

  };



  const handleDeleteInvestor = (investor) => {

    setCrudMode('delete');

    setSelectedInvestor(investor);

    setCrudModalOpen(true);

  };



  const handleCRUDSubmit = async (data) => {

    setCrudLoading(true);

    try {

      if (crudMode === 'create') {

        // Create new investor - you'll need to implement this API call

        alert('Create functionality needs to be implemented in backend API');

      } else if (crudMode === 'edit') {

        // Update existing investor

        await updateUser(selectedInvestor.Users_PK, data);

        alert('Investor updated successfully');

      } else if (crudMode === 'delete') {

        // Delete investor

        await deleteUser(selectedInvestor.Users_PK);

        alert('Investor deleted successfully');

      }

      setRefresh(!refresh);

    } catch (error) {

      alert(`Failed to ${crudMode} investor`);

    } finally {

      setCrudLoading(false);

    }

  };



  const handleCrudModalClose = () => {

    setCrudModalOpen(false);

    setSelectedInvestor(null);

  };





  const columns = [

    {

      field: "id",

      headerName: "ID",

      valueGetter: (params) => params.row.Users_PK,

      minWidth: 150,

    },

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

      valueGetter: (params) => params.row.email,

      cellClassName: (params) => (params.row.active ? "" : "inactive"),

      minWidth: 200, 

      flex: 1,

    },

    {

      field: "role",

      headerName: "Role",

      valueGetter: (params) => params.row.role,

      cellClassName: (params) => (params.row.active ? "" : "inactive"),

      minWidth: 150, 

      flex: 1,

    },

    {

      field: "actions",

      headerName: "Actions",

      renderCell: (params) => (

        <Box display="flex" gap="8px" flexWrap="wrap">

          <Button

            variant="contained"

            color="primary"

            size="small"

            onClick={() => handleViewProfileClick(params.row)}

          >

            Profile

          </Button>

          <Button

            variant="contained"

            color="info"

            size="small"

            startIcon={<EditIcon />}

            onClick={() => handleEditInvestor(params.row)}

          >

            Edit

          </Button>

          <Button

            variant="contained"

            color="error"

            size="small"

            startIcon={<DeleteIcon />}

            onClick={() => handleDeleteInvestor(params.row)}

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

    }

  ]

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

          sx={{ width: "75%", minHeight: "220px" }}

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

            <Avatar alt={selectedUser.name} src={selectedUser.image} sx={{ width: '180px', height: '180px', border: `2px solid ${colors.grey[100]}` }} />

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

            <Header title="TOTAL INVESTOR" subtitle="Managing the All Investor" />

          </Box>

        </Box>

        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">

          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" onClick={DailyInvestorHandle}>

            <StatBox

              subtitle="Daily Investor"

              title={dailyInvestorCount}

              icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}

            />

          </Box>

          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" onClick={WeeklyInvestorHandle}>

            <StatBox

              title={weeklyInvestorCount}

              subtitle="Weekly Investor"

              icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}

            />

          </Box>

          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center" onClick={MonthlyInvestorHandle}>

            <StatBox

              title={monthlyInvestorCount}

              subtitle="Monthly Investor"

              icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}

            />

          </Box>

          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">

            <StatBox

              title={`${count}`}

              subtitle="Total Investor"

              icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}

            />

          </Box>

        </Box>

        {/* Add Investor Button - positioned after stat boxes and before data table */}

        <Box display="flex" justifyContent="flex-end" m="20px 0">

          <Button

            variant="contained"

            startIcon={<AddIcon />}

            onClick={handleCreateInvestor}

            sx={{

              backgroundColor: colors.greenAccent[600],

              color: colors.grey[100],

              '&:hover': {

                backgroundColor: colors.greenAccent[500],

              }

            }}

          >

            Add Investor

          </Button>

        </Box>

        <Box

          m="40px 0 0 0"

          height="75vh"

          sx={{

            "& .MuiDataGrid-root": { border: "none" },

            "& .MuiDataGrid-cell": { borderBottom: "none" },

            "& .name-column--cell": { color: colors.greenAccent[300] },

            "& .name-column--cell.inactive": { filter: 'blur(2px)', color: 'red', textDecoration: 'line-through' },

            "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },

            "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },

            "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },

            "& .MuiCheckbox-root": { color: `${colors.greenAccent[200]} !important` },

          }}

        >

          <DataGrid

            rows={investors}

            columns={columns}

            getRowId={(row) => row.Users_PK}

          />

        </Box>

      </Box>



      {/* CRUD Modal */}

      <CRUDModal

        open={crudModalOpen}

        handleClose={handleCrudModalClose}

        mode={crudMode}

        title={`${crudMode === 'create' ? 'Add' : crudMode === 'edit' ? 'Edit' : 'Delete'} Investor`}

        initialData={selectedInvestor}

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

  );

};



export default Investor;

