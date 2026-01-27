import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Avatar, useTheme } from '@mui/material';
import { tokens } from '../theme';
import { fetchBlockedUsers, unblockUser } from '../Api/adminApi';
import Header from './Header';
import { DataGrid } from '@mui/x-data-grid';


function BlockAccount() {
  const [blockedUsers, setblockedUsers] = useState([])
  const [render, setRender] = useState(false)
  const [count, setCount] = useState(0)
  let navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    getBlockedUsers()
  }, [render])

  const getBlockedUsers = async () => {
    try {
      const response = await fetchBlockedUsers();
      setblockedUsers(response.data || []);
      setCount(response.count || response.data?.length || 0);
      console.log("Blocked users:", response);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
    }
  }
  const activateUser = async (id) => {
    console.log('activating ', id)
    try {
      const response = await unblockUser(id);
      setRender((prev) => !prev)
      console.log({ response })
    } catch (error) {
      console.error("Error activating user:", error);
    }
  }

  const handleViewProfile = (userPK) => {
    navigate('/userProfile', { state: { userPK } });
  }

  const columns = [
    {
      field: "profile",
      headerName: "Profile",
      flex: 0.5,
      renderCell: (params) => (
        <Avatar alt={params.row.name} src={params.row.picUrl} />
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      valueGetter: (params) => params.row.name,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      valueGetter: (params) => params.row.email,
    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.8,
      valueGetter: (params) => params.row.role,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      renderCell: (params) => (
        <Box display="flex" gap="10px">
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleViewProfile(params.row.Users_PK)}
          >
            Profile
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => activateUser(params.row.Users_PK)}
          >
            Unblock
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: "87vh", overflowY: "auto", padding: "20px" }}>
      <Header title="BLOCKED USERS" subtitle={`Managing ${count} Blocked Users`} />
      
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .name-column--cell": { color: colors.greenAccent[300] },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
        }}
      >
        {blockedUsers.length === 0 ? (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height="100%" 
            backgroundColor={colors.primary[400]}
          >
            <Typography variant="h4" color={colors.greenAccent[500]}>
              No Blocked Users Found
            </Typography>
          </Box>
        ) : (
          <DataGrid
            rows={blockedUsers}
            columns={columns}
            getRowId={(row) => row.Users_PK || row._id}
          />
        )}
      </Box>
    </Box>
  );
}

export default BlockAccount;
