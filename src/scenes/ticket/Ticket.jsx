import { useEffect, useState } from "react";
import { Box, useTheme, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import TrafficIcon from "@mui/icons-material/Traffic";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import StatBox from "../../components/StatBox";
import Header from "../../components/Header";
import CRUDModal from "../../components/CRUDModal";
import { fetchAllTickets, fetchTicketAnalytics, createTicket, updateTicket, deleteTicket } from "../../Api/adminApi";

const Ticket = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tickets, setTickets] = useState([]); 
  const [count, setCount] = useState(0)
  const [dailyCount, setDailyCount] = useState(0)
  const [weeklyCount, setWeeklyCount] = useState(0)
  const [monthlyCount, setMonthlyCount] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const navigate = useNavigate();

  // CRUD Modal states
  const [crudModalOpen, setCrudModalOpen] = useState(false);
  const [crudMode, setCrudMode] = useState('create');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [crudLoading, setCrudLoading] = useState(false);


  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetchAllTickets();
        const updatedData = response.data.map(ticket => ({
          ...ticket,
        }));
        setCount(response.count);
        setTickets(updatedData);
      }
      catch (error) {
        console.error('Fetching tickets error', error);
      }
    }
    getData();
  }, [refresh])

  useEffect(() => {
    const getAnalytics = async () => {
      try {
        const analytics = await fetchTicketAnalytics();
        setDailyCount(analytics?.count?.daily || 0);
        setWeeklyCount(analytics?.count?.weekly || 0);
        setMonthlyCount(analytics?.count?.monthly || 0);
      } catch (error) {
        console.error('Error fetching ticket analytics:', error);
      }
    };
    getAnalytics();
  }, [])

  const columns = [
    {
      field: "eventlocation",
      headerName: "Event Location",
      flex: 1,
      valueGetter: (params) => params.row.event.eventLocation,
      cellClassName: (params) => (params.row.active ? "" : "inactive"),
    },
    {
      field: "ticketBuyerId",
      headerName: "Buyer Name",
      flex: 1,
      valueGetter: (params) => params.row.buyer.name,
      renderCell: (params) => {
        return (
          <span
            style={{ cursor: "pointer" }}
            onClick={() => navigate('/userProfile', { state: { userPK: params.row.buyer.Users_PK } })}
          >
            {params.row.buyer.name}
          </span>
        );
      },
      cellClassName: (params) => (params.row.active ? "" : "inactive"),
    },
    {
      field: "ticketSellerId",
      headerName: "Seller Name",
      flex: 1,
      valueGetter: (params) => params.row.seller.name,
      renderCell: (params) => {
        return (
          <span
            // style={{ color: "blue", cursor: "pointer" }}
            style={{ cursor: "pointer" }}
            onClick={() => navigate('/userProfile', { state: { userPK: params.row.seller.Users_PK } })}
          >
            {params.row.seller.name}
          </span>
        );
      },
      cellClassName: (params) => (params.row.active ? "" : "inactive"),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      valueGetter: (params) => params.row.createdAt,
      cellClassName: (params) => (params.row.active ? "" : "inactive"),
    },
    {
      field: "ticketEventId",
      headerName: "Ticket ID",
      flex: 1,
      valueGetter: (params) => params.row.ticketEventId,
      cellClassName: (params) => (params.row.active ? "" : "inactive"),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap="8px">
          <Button 
            variant="contained" 
            color="info" 
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEditTicket(params.row)}
          >
            Edit
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteTicket(params.row)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  // CRUD Handlers
  const handleCreateTicket = () => {
    setCrudMode('create');
    setSelectedTicket({});
    setCrudModalOpen(true);
  };

  const handleEditTicket = (ticket) => {
    setCrudMode('edit');
    setSelectedTicket(ticket);
    setCrudModalOpen(true);
  };

  const handleDeleteTicket = (ticket) => {
    setCrudMode('delete');
    setSelectedTicket(ticket);
    setCrudModalOpen(true);
  };

  const handleCRUDSubmit = async (data) => {
    setCrudLoading(true);
    try {
      if (crudMode === 'create') {
        await createTicket(data);
        alert('Ticket created successfully');
      } else if (crudMode === 'edit') {
        await updateTicket(selectedTicket._id, data);
        alert('Ticket updated successfully');
      } else if (crudMode === 'delete') {
        await deleteTicket(selectedTicket._id);
        alert('Ticket deleted successfully');
      }
      setRefresh(!refresh);
      setCrudModalOpen(false);
      setSelectedTicket(null);
    } catch (error) {
      alert(`Failed to ${crudMode} ticket`);
    } finally {
      setCrudLoading(false);
    }
  };

  const handleCrudModalClose = () => {
    setCrudModalOpen(false);
    setSelectedTicket(null);
  };


  return (
    <Box sx={{height:"87vh",overflowY:"auto", padding:"20px"}}>
      <Box>
        <Box display="grid" gridTemplateColumns="repeat(6, 3fr)" gridAutoRows="140px" gap="20px">
          <Box display="flex" justifyContent="center" alignItems="center" gridColumn="span 6">
            <Header title="TOTAL TICKETS" subtitle="Managing the All Tickets" />
          </Box>
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
            <StatBox
              subtitle="Daily Tickets"
              title={dailyCount}
              icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
            <StatBox
              title={weeklyCount}
              subtitle="Weekly Tickets"
              icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
            <StatBox
              title={monthlyCount}
              subtitle="Monthly Tickets"
              icon={<InsertInvitationIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
          <Box gridColumn="span 3" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
            <StatBox
              title={`${count}`}
              subtitle="Total Tickets"
              icon={<TrafficIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
        </Box>

        {/* Add Ticket Button - positioned after stat boxes and before data table */}
        <Box display="flex" justifyContent="flex-end" m="20px 0">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateTicket}
            sx={{
              backgroundColor: colors.greenAccent[600],
              color: colors.grey[100],
              '&:hover': {
                backgroundColor: colors.greenAccent[500],
              }
            }}
          >
            Add Ticket
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
          <DataGrid rows={tickets} columns={columns} getRowId={(row) => row._id} />
        </Box>

        {/* CRUD Modal */}
        <CRUDModal
          open={crudModalOpen}
          handleClose={handleCrudModalClose}
          mode={crudMode}
          title={`${crudMode === 'create' ? 'Add' : crudMode === 'edit' ? 'Edit' : 'Delete'} Ticket`}
          initialData={selectedTicket}
          fields={[
            { name: 'ticketEventId', label: 'Ticket Event ID', required: true },
            { name: 'eventId', label: 'Event ID', required: true },
            { name: 'buyerId', label: 'Buyer ID', required: true },
            { name: 'sellerId', label: 'Seller ID', required: true },
            { name: 'price', label: 'Price', type: 'number', required: true },
            { name: 'status', label: 'Status', type: 'select', required: true, options: [
              { value: 'active', label: 'Active' },
              { value: 'used', label: 'Used' },
              { value: 'cancelled', label: 'Cancelled' }
            ]},
          ]}
          onSubmit={handleCRUDSubmit}
          loading={crudLoading}
        />
      </Box>
    </Box>
  );
};

export default Ticket;
