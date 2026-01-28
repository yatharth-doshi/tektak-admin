import React, { useEffect, useState } from 'react';
import { Box, Typography, Modal, CardMedia, IconButton, Grid, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@emotion/react';
import { tokens } from '../theme';
import Header from '../components/Header';
import { fetchAllMeetings, fetchMeetingById, createMeeting, updateMeeting, deleteMeeting } from '../Api/adminApi';
import CRUDModal from '../components/CRUDModal';

const Meeting = () => {
  const [count, setCount] = useState(0);
  const [meetings, setMeetings] = useState([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null); 
  const [singleMeeting, setSingleMeeting] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // CRUD Modal states
  const [crudModalOpen, setCrudModalOpen] = useState(false);
  const [crudMode, setCrudMode] = useState('create');
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [crudLoading, setCrudLoading] = useState(false);

  // Fetch all meetings
  useEffect(() => {
    const getData = async () => {
      try {
        const result = await fetchAllMeetings();
        const updatedData = result.data.map(user => ({
          ...user,
          active: true
        }));
        setCount(result.count);
        setMeetings(updatedData);
      } catch (error) {
        console.error('Fetching data error', error);
      }
    };
    getData();
  }, [refresh]);

  useEffect(() => {
    if (selectedMeetingId) {
      const getMeeting = async () => {
        try {
          const result = await fetchMeetingById(selectedMeetingId);
          // Ensure singleMeeting is always an array, handle undefined response
          setSingleMeeting(result.user ? (Array.isArray(result.user) ? result.user : [result.user]) : []); 
        } catch (error) {
          console.log("Error fetching single meeting", error);
          setSingleMeeting([]); // Ensure it's an array on error
        }
      };
      getMeeting();
    }
  }, [selectedMeetingId]); 

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const closeModal = () => setSelectedMeetingId(null);

  // CRUD Handlers
  const handleCreateMeeting = () => {
    setCrudMode('create');
    setSelectedMeeting({});
    setCrudModalOpen(true);
  };

  const handleEditMeeting = (meeting) => {
    setCrudMode('edit');
    setSelectedMeeting(meeting);
    setCrudModalOpen(true);
  };

  const handleDeleteMeeting = (meeting) => {
    setCrudMode('delete');
    setSelectedMeeting(meeting);
    setCrudModalOpen(true);
  };

  const handleCRUDSubmit = async (data) => {
    setCrudLoading(true);
    try {
      if (crudMode === 'create') {
        await createMeeting(data);
        alert('Meeting created successfully');
      } else if (crudMode === 'edit') {
        await updateMeeting(selectedMeeting._id, data);
        alert('Meeting updated successfully');
      } else if (crudMode === 'delete') {
        await deleteMeeting(selectedMeeting._id);
        alert('Meeting deleted successfully');
      }
      setRefresh(!refresh);
      setCrudModalOpen(false);
      setSelectedMeeting(null);
    } catch (error) {
      alert(`Failed to ${crudMode} meeting`);
    } finally {
      setCrudLoading(false);
    }
  };

  const handleCrudModalClose = () => {
    setCrudModalOpen(false);
    setSelectedMeeting(null);
  };

  return (
    <Box p={4} sx={{ height: "87vh", overflowY: "auto", padding: "20px" }}>
      {/* Header */}
      <Box display="flex" justifyContent="center" alignItems="center" mb={3}>
        <Header title="MEETINGS" subtitle="Managing All Meetings" />
      </Box>

      {/* Add Meeting Button - positioned after header and before meeting cards */}
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateMeeting}
          sx={{
            backgroundColor: colors.greenAccent[600],
            color: colors.grey[100],
            '&:hover': {
              backgroundColor: colors.greenAccent[500],
            }
          }}
        >
          Add Meeting
        </Button>
      </Box>

      {meetings.map((meeting) => (
        <Box
          backgroundColor={colors.primary[400]}
          key={meeting._id}
          sx={{ width: '70%', m: "14px auto", borderRadius: "7px", cursor: 'pointer', padding: "7px" }}
        >
          <Box sx={{ display: 'flex', m: "13px" }}>
            <Typography variant="h5" fontWeight="bolder" fontSize="23px" sx={{ color: colors.greenAccent[400] }}>
              Meeting ID: <Typography variant='span' fontWeight="bold" fontSize="19px" sx={{ color: colors.greenAccent[100] }}>{meeting._id}</Typography>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", px: "15px" }}>
            <Typography fontWeight="bolder" sx={{ mb: "10px" }}>
              Start Time: <Typography>{meeting.createdAt}</Typography>
            </Typography>
            <Typography fontWeight="bold" sx={{ mb: "10px" }}>
              Duration: <Typography>{meeting.updatedAt}</Typography>
            </Typography>
            <Typography fontWeight="bold" sx={{ mb: "10px" }}>
              End Time: <Typography>{meeting.createdAt}</Typography>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "8px", px: "15px", mt: "10px" }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setSelectedMeetingId(meeting._id)}
            >
              View Details
            </Button>
            <Button
              variant="contained"
              color="info"
              size="small"
              startIcon={<EditIcon />}
              onClick={(e) => {
                e.stopPropagation();
                handleEditMeeting(meeting);
              }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteMeeting(meeting);
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      ))}

      {/* Modal to display selected meeting details */}
      <Modal open={Boolean(selectedMeetingId)} onClose={closeModal}>
        <Box
          backgroundColor={colors.primary[400]}
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '45%',
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            outline: 'none',
          }}
        >
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              color: 'text.secondary',
            }}
            onClick={closeModal}
          >
            <CloseIcon />
          </IconButton>

          {/* Display meeting details in modal */}
          <Box>
            {singleMeeting && Array.isArray(singleMeeting) && singleMeeting.map((meeting, index) => (
              <Box key={meeting._id || index} sx={{ mb: 4 }} >
                <Typography variant="h5" component="h2" fontWeight="bold" mb={2}>
                  Meeting {index + 1}: {meeting.name}
                </Typography>

                <Grid container spacing={2} alignItems="center">\
                  <Grid item xs={4} textAlign="center">
                    <CardMedia
                      component="img"
                      image={meeting.picUrl}
                      alt={meeting.name}
                      sx={{ width: 160, height: 144, borderRadius: 2 }}
                    />
                  </Grid>

                  <Grid item xs={8}>
                    <Typography variant="body1">
                      <strong>Name:</strong> {meeting.name}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Email:</strong> {meeting.email}
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Role:</strong> {meeting.role || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>

      {/* CRUD Modal */}
      <CRUDModal
        open={crudModalOpen}
        handleClose={handleCrudModalClose}
        mode={crudMode}
        title={`${crudMode === 'create' ? 'Add' : crudMode === 'edit' ? 'Edit' : 'Delete'} Meeting`}
        initialData={selectedMeeting}
        fields={[
          { name: 'title', label: 'Meeting Title', required: true },
          { name: 'description', label: 'Description', required: true },
          { name: 'startTime', label: 'Start Time', type: 'datetime-local', required: true },
          { name: 'endTime', label: 'End Time', type: 'datetime-local', required: true },
          { name: 'location', label: 'Location' },
          { name: 'participants', label: 'Participants' },
        ]}
        onSubmit={handleCRUDSubmit}
        loading={crudLoading}
      />

    </Box>
  );
};

export default Meeting;
