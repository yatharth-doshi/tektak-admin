import { useEffect, useState } from "react";

import React from "react";

import { useNavigate } from "react-router-dom";

import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import AddIcon from '@mui/icons-material/Add';

import EditIcon from '@mui/icons-material/Edit';

import { Card, CardMedia, Typography, Grid, Box, useTheme, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';

import Header from "../../components/Header";

import { tokens } from "../../theme";

import StatBox from "../../components/StatBox";

import EventAvailableIcon from '@mui/icons-material/EventAvailable';

import EventNoteIcon from '@mui/icons-material/EventNote';

import DateRangeIcon from '@mui/icons-material/DateRange';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import DeleteIcon from '@mui/icons-material/Delete';

import { fetchAllEvents, toggleEventActivation, deleteEvent, fetchEventAnalytics, createEvent, updateEvent } from "../../Api/adminApi";

import CRUDModal from "../../components/CRUDModal";



const Events = () => {

  const [count, setCount] = useState(0);

  const [events, setEvents] = useState([]);

  const [refresh, setRefresh] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedEventId, setSelectedEventId] = useState(null);

  const [dailyEventsCount, setDailyEventsCount] = useState(0);

  const [monthlyEventsCount, setMonthlyEventsCount] = useState(0);

  const [weeklyEventsCount, setWeeklyEventsCount] = useState(0);

  

  // CRUD Modal states

  const [crudModalOpen, setCrudModalOpen] = useState(false);

  const [crudMode, setCrudMode] = useState('create');

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [crudLoading, setCrudLoading] = useState(false);

  const theme = useTheme();

  const colors = tokens(theme.palette.mode);



  // Fetch all events

  useEffect(() => {

    const getData = async () => {

      try {

        const result = await fetchAllEvents();

        const updatedData = result.data.map(event => ({

          ...event,

          active: true

        }));

        setCount(updatedData.length);

        setEvents(updatedData);

      } catch (error) {

        console.error('Error fetching events:', error);

      }

    };

    getData();

  }, [refresh]);



  // Fetch event analytics

  useEffect(() => {

    const getEventAnalytics = async () => {

      try {

        const analytics = await fetchEventAnalytics(); 

        setDailyEventsCount(analytics?.count?.daily || 0);

        setWeeklyEventsCount(analytics?.count?.weekly || 0);

        setMonthlyEventsCount(analytics?.count?.monthly || 0);

      } catch (error) {

        console.log('Error fetching event analytics:', error);

      }

    };

    getEventAnalytics();

  }, []);



  // Toggle event activation

  const handleToggleActivation = async (eventId, currentStatus) => {

    try {

      const updatedStatus = currentStatus === "true" ? "false" : "true";

      await toggleEventActivation(eventId, updatedStatus);

      setEvents((prevEvents) =>

        prevEvents.map((event) =>

          event._id === eventId ? { ...event, isActivated: updatedStatus } : event

        )

      );

    } catch (error) {

      console.error("Error toggling activation status:", error);

    }

  };



  // Delete event

  const handleDeleteClick = (eventId) => {

    setSelectedEventId(eventId);

    setDeleteDialogOpen(true);

  };



  const handleDeleteConfirm = async () => {

    try {

      await deleteEvent(selectedEventId);

      setRefresh(!refresh);

      setDeleteDialogOpen(false);

      setSelectedEventId(null);

    } catch (error) {

      console.error('Error deleting event:', error);

    }

  };



  const handleDeleteCancel = () => {

    setDeleteDialogOpen(false);

    setSelectedEventId(null);

  };



  const navigate = useNavigate();



  const handleDailyEvents = () => {

    navigate('/dailyEvents')

  }

  const handleWeeklyEvents = () => {

    navigate('/weeklyEvents')

  }

  const handleMonthlyEvents = () => {

    navigate('/monthlyEvents')

  }

  // const handleUser = (id) => {

  //   navigate('/userProfile', { state: { userPK: id } });

  // };



  // CRUD Handlers

  const handleCreateEvent = () => {

    setCrudMode('create');

    setSelectedEvent({});

    setCrudModalOpen(true);

  };



  const handleEditEvent = (event) => {

    setCrudMode('edit');

    setSelectedEvent(event);

    setCrudModalOpen(true);

  };



  const handleDeleteEvent = (event) => {

    setCrudMode('delete');

    setSelectedEvent(event);

    setCrudModalOpen(true);

  };



  const handleCRUDSubmit = async (data) => {

    setCrudLoading(true);

    try {

      if (crudMode === 'create') {

        await createEvent(data);

        alert('Event created successfully');

      } else if (crudMode === 'edit') {

        await updateEvent(selectedEvent._id, data);

        alert('Event updated successfully');

      } else if (crudMode === 'delete') {

        await deleteEvent(selectedEvent._id);

        alert('Event deleted successfully');

      }

      setRefresh(!refresh);

    } catch (error) {

      alert(`Failed to ${crudMode} event`);

    } finally {

      setCrudLoading(false);

    }

  };



  const handleCrudModalClose = () => {

    setCrudModalOpen(false);

    setSelectedEvent(null);

  };



  return (

    <Box sx={{ height: "87vh", overflowY: "auto", padding: "20px" }}>

      <Box display="flex" justifyContent="center" alignItems="center" mb={2}>

        <Header title="Event" />

      </Box>



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

          onClick={handleDailyEvents}

        >

          <StatBox

            subtitle="Daily Events"

            title={dailyEventsCount}

            icon={

              <EventAvailableIcon

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

          onClick={handleWeeklyEvents}

        >

          <StatBox

            title={weeklyEventsCount}

            subtitle="Weekly Events"

            icon={

              <DateRangeIcon

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

          onClick={handleMonthlyEvents}

        >

          <StatBox

            title={monthlyEventsCount}

            subtitle="Monthly Events"

            icon={

              <EventNoteIcon

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

            subtitle="Total Events"

            icon={

              <CalendarMonthIcon

                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}

              />

            }

          />

        </Box>

      </Box>



      {/* Add Event Button - positioned after stat boxes and before event cards */}

      <Box display="flex" justifyContent="flex-end" m="20px 0">

        <Button

          variant="contained"

          startIcon={<AddIcon />}

          onClick={handleCreateEvent}

          sx={{

            backgroundColor: colors.greenAccent[600],

            color: colors.grey[100],

            '&:hover': {

              backgroundColor: colors.greenAccent[500],

            }

          }}

        >

          Add Event

        </Button>

      </Box>



      <div style={{ padding: "10px 0px", marginTop: "10px", backgroundColor: colors.primary[400] }}>

        <Grid container spacing={1} style={{ padding: "10px", marginTop: '1%', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1%' }}>

          {events && events.length > 0 ? (

            events.map((event) => (

              <Grid item key={event._id} style={{ margin: 0, width: '32.4%', height: '45vh', position: 'relative' }}>

                <CardMedia

                  component="img"

                  image={event.eventCoverUrl}

                  alt="Card Img"

                  style={{ height: '100%', width: '100%', borderRadius: '8px', cursor: 'pointer' }}

                />

                <div style={{ position: 'absolute', bottom: '1%', width: '100%' }}>

                  <div style={{ width: '95%', marginLeft: "3px", padding: '1% 3%', backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: '8px' }}>

                    <Typography variant="h5" component="small" style={{ fontSize: '1.25rem', color: "#4CCEAC" }}>Title: {event.eventTitle}</Typography>

                    <Typography variant="body2" style={{ fontSize: '0.875rem', color: 'white', padding: '2% 0' }}>Location: {event.eventLocation}</Typography>

                    <Typography variant="body1" style={{ fontSize: '1rem', color: 'white', paddingBottom: '2%' }}>Date: {event.eventDate}</Typography>

                    <Button

                      variant="contained"

                      color={event.isActivated === "true" ? "error" : "primary"}

                      onClick={() => handleToggleActivation(event._id, event.isActivated)}

                    >

                      {event.isActivated === "true" ? "Deactivate" : "Activate"}

                    </Button>

                    <Button

                      variant="contained"

                      color="secondary"

                      sx={{mx:"5px"}}

                    >

                      View Profile

                    </Button>

                    <IconButton

                      color="info"

                      onClick={() => handleEditEvent(event)}

                      sx={{mx:"5px"}}

                    >

                      <EditIcon />

                    </IconButton>

                    <IconButton

                      color="error"

                      onClick={() => handleDeleteEvent(event)}

                    >

                      <DeleteIcon />

                    </IconButton>

                  </div>

                </div>

              </Grid>

            ))

          ) : (

            <Typography>No events available.</Typography>

          )}

        </Grid>

      </div>



      {/* CRUD Modal */}

      <CRUDModal

        open={crudModalOpen}

        handleClose={handleCrudModalClose}

        mode={crudMode}

        title={`${crudMode === 'create' ? 'Add' : crudMode === 'edit' ? 'Edit' : 'Delete'} Event`}

        initialData={selectedEvent}

        fields={[

          { name: 'eventTitle', label: 'Event Title', required: true },

          { name: 'eventLocation', label: 'Event Location', required: true },

          { name: 'eventDate', label: 'Event Date', required: true },

          { name: 'eventTime', label: 'Event Time', required: true },

          { name: 'description', label: 'Description', required: true },

          { name: 'eventCoverUrl', label: 'Cover Image URL' },

        ]}

        onSubmit={handleCRUDSubmit}

        loading={crudLoading}

      />



      {/* Delete Confirmation Dialog */}

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>

        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>

          Are you sure you want to delete this event? This action cannot be undone.

        </DialogContent>

        <DialogActions>

          <Button onClick={handleDeleteCancel} color="primary">Cancel</Button>

          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>

        </DialogActions>

      </Dialog>

    </Box>

  );

};



export default Events;

