import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import GeographyChart from "../../components/GeographyChart";
import AnalyticsBarChart from "../../components/AnalyticsBarChart";
import AnalyticsPieChart from "../../components/AnalyticsPieChart";
import TrafficIcon from "@mui/icons-material/Traffic";
import StatBox from "../../components/StatBox";
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import { useNavigate } from "react-router-dom";
import PreviewIcon from '@mui/icons-material/Preview';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import { useEffect, useState } from "react";
import { fetchEnterpreneurCount, fetchInvestorCount, fetchTotalCOunt, fetchViewerCount } from "../../Api/AllUser/TotalUser";
import { fetchPaymentRequest } from "../../Api/Ticket/PaymentRequest";
import {
  fetchUserAnalytics,
  fetchJobAnalytics,
  fetchEventAnalytics,
  fetchPodcastAnalytics,
  fetchVideoAnalytics,
  fetchTicketAnalytics,
} from "../../Api/adminApi";

const Dashboard = () => {

  const [totalCount, setTotalCount] = useState(0)
  const [investorCount, setInvestorCount] = useState(0)
  const [enterpreneurCount, setEnterpreneurCount] = useState(0)
  const [viewerCount, setViewerCount] = useState(0)
  const [payment, setPayment] = useState([])
  const [pendingPayment, setPendingPayment] = useState([])
  
  // Analytics states
  const [userAnalytics, setUserAnalytics] = useState({ count: { daily: 0, weekly: 0, monthly: 0 }, todayData: [], weekData: [], monthData: [] })
  const [jobAnalytics, setJobAnalytics] = useState({ count: { daily: 0, weekly: 0, monthly: 0 } })
  const [eventAnalytics, setEventAnalytics] = useState({ count: { daily: 0, weekly: 0, monthly: 0 } })
  const [podcastAnalytics, setPodcastAnalytics] = useState({ count: { daily: 0, weekly: 0, monthly: 0 } })
  const [videoAnalytics, setVideoAnalytics] = useState({ count: { daily: 0, weekly: 0, monthly: 0 } })
  const [, setTicketAnalytics] = useState({ count: { daily: 0, weekly: 0, monthly: 0 } })

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate()

  const handleInvestor = () => {
    navigate("/investors")
  }
  const handleenterpreneur = () => {
    navigate("/enterpreneur")
  }
  const handleviewer = () => {
    navigate("/viewers")
  }
  const handeltraffic = () => {
    navigate("/team")
  }
  const handleNavigate = () => {
    navigate('/approve-payment')
  }

  useEffect(() => {
    const data = async () => {
      const response = await fetchTotalCOunt()
      setTotalCount(response.count)
    }
    data()
  }, [])
  useEffect(() => {
    const data = async () => {
      const response = await fetchInvestorCount()
      setInvestorCount(response.data.count)
    }
    data()
  }, [])
  useEffect(() => {
    const data = async () => {
      const response = await fetchEnterpreneurCount()
      setEnterpreneurCount(response.data.count)
    }
    data()
  }, [])
  useEffect(() => {
    const data = async () => {
      const response = await fetchViewerCount()
      setViewerCount(response.data.count)
    }
    data()
  }, [])

  useEffect(() => {
    const payment = async () => {
      const response = await fetchPaymentRequest()
      const result = response.data;
      const pendingRequests = result.filter(item => item.requestStatus === "approve");

      setPayment(pendingRequests);
    }
    payment()
  }, [])
  useEffect(() => {
    const payment = async () => {
      const response = await fetchPaymentRequest()
      const result = response.data;
      const pendingRequests = result.filter(item => item.requestStatus === "pending");

      setPendingPayment(pendingRequests);
    }
    payment()
  }, [])

  // Fetch all analytics data
  useEffect(() => {
    const fetchAllAnalytics = async () => {
      try {
        const [users, jobs, events, podcasts, videos, tickets] = await Promise.all([
          fetchUserAnalytics(),
          fetchJobAnalytics(),
          fetchEventAnalytics(),
          fetchPodcastAnalytics(),
          fetchVideoAnalytics(),
          fetchTicketAnalytics(),
        ]);
        setUserAnalytics(users);
        setJobAnalytics(jobs);
        setEventAnalytics(events);
        setPodcastAnalytics(podcasts);
        setVideoAnalytics(videos);
        setTicketAnalytics(tickets);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      }
    };
    fetchAllAnalytics();
  }, []);

  // Prepare chart data for analytics
  const analyticsBarData = [
    { category: "Users", daily: userAnalytics?.count?.daily || 0, weekly: userAnalytics?.count?.weekly || 0, monthly: userAnalytics?.count?.monthly || 0 },
    { category: "Jobs", daily: jobAnalytics?.count?.daily || 0, weekly: jobAnalytics?.count?.weekly || 0, monthly: jobAnalytics?.count?.monthly || 0 },
    { category: "Events", daily: eventAnalytics?.count?.daily || 0, weekly: eventAnalytics?.count?.weekly || 0, monthly: eventAnalytics?.count?.monthly || 0 },
    { category: "Podcasts", daily: podcastAnalytics?.count?.daily || 0, weekly: podcastAnalytics?.count?.weekly || 0, monthly: podcastAnalytics?.count?.monthly || 0 },
    { category: "Videos", daily: videoAnalytics?.count?.daily || 0, weekly: videoAnalytics?.count?.weekly || 0, monthly: videoAnalytics?.count?.monthly || 0 },
  ];

  const analyticsPieData = [
    { id: "Investors", label: "Investors", value: investorCount, color: "hsl(104, 70%, 50%)" },
    { id: "Entrepreneurs", label: "Entrepreneurs", value: enterpreneurCount, color: "hsl(162, 70%, 50%)" },
    { id: "Viewers", label: "Viewers", value: viewerCount, color: "hsl(291, 70%, 50%)" },
  ];


  return (
    <Box sx={{ height: "87vh", overflowY: "auto", padding: "20px" }}>
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />


      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={handleInvestor}
        >
          <StatBox
            subtitle="Total Invester"
            title={investorCount}
            icon={
              <InsertInvitationIcon
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
          onClick={handleenterpreneur}
        >
          <StatBox
            title={enterpreneurCount}
            subtitle="Total Interpenurer"
            icon={
              <BusinessCenterIcon
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
          onClick={handleviewer}
        >
          <StatBox
            title={viewerCount}
            subtitle="Total Viewer"

            icon={
              <PreviewIcon
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
          onClick={handeltraffic}
        >
          <StatBox
            title={totalCount}
            subtitle="Total Traffic"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            overflow="auto"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              colors={colors.grey[100]}
              p="15px"
            >
              <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
                Pending Transactions
              </Typography>
            </Box>
            {pendingPayment.map((transaction, i) => (
              <Box
                key={`${transaction.txId}-${i}`}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                borderBottom={`4px solid ${colors.primary[500]}`}
                p="15px"
              >
                <Box>
                  <Typography
                    color={colors.greenAccent[500]}
                    variant="h5"
                    fontWeight="600"
                  >
                    {transaction.user.name}
                  </Typography>
                </Box>
                <Box color={colors.grey[100]}>{transaction.user.email}</Box>
                <Box variant="h5" color={colors.greenAccent[500]}>{transaction.amount}</Box>
                <Button
                  variant="contained"
                  color="info"
                  onClick={handleNavigate}
                  sx={{ width: "13%", marginLeft: "10px" }}
                >
                  Action
                </Button>
              </Box>
            ))}
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {payment.map((transaction, i) => (
            <Box
              key={`${transaction.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.user.name}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.phoneNumber}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{transaction.createdAt}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                ${transaction.amount}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ROW 3 - Analytics Stats */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => navigate("/jobs")}
          sx={{ cursor: "pointer" }}
        >
          <StatBox
            title={jobAnalytics?.count?.monthly || 0}
            subtitle="Jobs (Monthly)"
            icon={<WorkIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => navigate("/events")}
          sx={{ cursor: "pointer" }}
        >
          <StatBox
            title={eventAnalytics?.count?.monthly || 0}
            subtitle="Events (Monthly)"
            icon={<EventIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => navigate("/podcast")}
          sx={{ cursor: "pointer" }}
        >
          <StatBox
            title={podcastAnalytics?.count?.monthly || 0}
            subtitle="Podcasts (Monthly)"
            icon={<PodcastsIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={() => navigate("/videos")}
          sx={{ cursor: "pointer" }}
        >
          <StatBox
            title={videoAnalytics?.count?.monthly || 0}
            subtitle="Videos (Monthly)"
            icon={<VideoLibraryIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
          />
        </Box>

        {/* ROW 4 - Charts */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            User Distribution
          </Typography>
          <Box height="250px" mt="-20px">
            <AnalyticsPieChart data={analyticsPieData} isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Analytics Overview
          </Typography>
          <Box height="250px" mt="-20px">
            <AnalyticsBarChart data={analyticsBarData} keys={["daily", "weekly", "monthly"]} isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
