import { useEffect, useState } from "react";
import { Box, Typography, useTheme, Button, TextField, Tab, Tabs, CircularProgress, Alert, Chip, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { qnaAPI } from "../../Api";
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`qa-tabpanel-${index}`}
    aria-labelledby={`qa-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const QAManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tabValue, setTabValue] = useState(0);
  const [selectedUserType, setSelectedUserType] = useState("entrepreneur");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  
  // Data states
  const [questions, setQuestions] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  
  // Form states
  const [newQuestion, setNewQuestion] = useState({
    label: "",
    options: [{ value: "", label: "" }],
    multiSelect: false,
    order: 0
  });
  const [editQuestion, setEditQuestion] = useState({
    label: "",
    options: [{ value: "", label: "" }],
    multiSelect: false,
    order: 0
  });

  const userTypes = ["entrepreneur", "investor", "viewer", "admin"];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError("");
    setSuccess("");
  };

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await qnaAPI.getQuestionsByUserType(selectedUserType);
      setQuestions(response || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch questions");
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    if (!userId) {
      setError("Please enter a User ID");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await qnaAPI.getUserFullProfile(userId);
      setUserProfile(response);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user profile");
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.label.trim()) {
      setError("Question label is required");
      return;
    }
    
    const validOptions = newQuestion.options.filter(opt => opt.value.trim() && opt.label.trim());
    if (validOptions.length === 0) {
      setError("At least one valid option is required");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const questionData = {
        ...newQuestion,
        options: validOptions
      };
      const response = await qnaAPI.addQuestion(selectedUserType, questionData);
      setSuccess(response.message || "Question added successfully");
      setAddDialogOpen(false);
      setNewQuestion({
        label: "",
        options: [{ value: "", label: "" }],
        multiSelect: false,
        order: 0
      });
      fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add question");
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = async () => {
    if (!editQuestion.label.trim()) {
      setError("Question label is required");
      return;
    }
    
    const validOptions = editQuestion.options.filter(opt => opt.value.trim() && opt.label.trim());
    if (validOptions.length === 0) {
      setError("At least one valid option is required");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const questionData = {
        ...editQuestion,
        options: validOptions
      };
      const response = await qnaAPI.updateQuestion(selectedUserType, selectedQuestion.id, questionData);
      setSuccess(response.message || "Question updated successfully");
      setEditDialogOpen(false);
      setSelectedQuestion(null);
      fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update question");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question? This will also remove all answers from user profiles.")) {
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const response = await qnaAPI.deleteQuestion(selectedUserType, questionId);
      setSuccess(response.message || "Question deleted successfully");
      fetchQuestions();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete question");
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (question) => {
    setSelectedQuestion(question);
    setEditQuestion({
      label: question.label,
      options: [...question.options],
      multiSelect: question.multiSelect,
      order: question.order
    });
    setEditDialogOpen(true);
  };

  const addOption = (type) => {
    if (type === 'new') {
      setNewQuestion({
        ...newQuestion,
        options: [...newQuestion.options, { value: "", label: "" }]
      });
    } else {
      setEditQuestion({
        ...editQuestion,
        options: [...editQuestion.options, { value: "", label: "" }]
      });
    }
  };

  const removeOption = (type, index) => {
    if (type === 'new') {
      setNewQuestion({
        ...newQuestion,
        options: newQuestion.options.filter((_, i) => i !== index)
      });
    } else {
      setEditQuestion({
        ...editQuestion,
        options: editQuestion.options.filter((_, i) => i !== index)
      });
    }
  };

  const updateOption = (type, index, field, value) => {
    if (type === 'new') {
      const updatedOptions = [...newQuestion.options];
      updatedOptions[index][field] = value;
      setNewQuestion({
        ...newQuestion,
        options: updatedOptions
      });
    } else {
      const updatedOptions = [...editQuestion.options];
      updatedOptions[index][field] = value;
      setEditQuestion({
        ...editQuestion,
        options: updatedOptions
      });
    }
  };

  const questionColumns = [
    {
      field: "label",
      headerName: "Question",
      flex: 2,
      renderCell: (params) => (
        <Box>
          <Typography color={colors.greenAccent[300]} variant="body2" fontWeight="bold">
            {params.value}
          </Typography>
          <Typography color={colors.grey[400]} variant="caption">
            Order: {params.row.order}
          </Typography>
        </Box>
      ),
    },
    {
      field: "options",
      headerName: "Options",
      flex: 2,
      renderCell: (params) => (
        <Box display="flex" flexWrap="wrap" gap={0.5}>
          {params.value?.slice(0, 3).map((option, index) => (
            <Chip
              key={index}
              label={option.label}
              size="small"
              sx={{ backgroundColor: colors.greenAccent[600], color: "white" }}
            />
          ))}
          {params.value?.length > 3 && (
            <Chip
              label={`+${params.value.length - 3}`}
              size="small"
              variant="outlined"
              sx={{ borderColor: colors.greenAccent[400], color: colors.greenAccent[400] }}
            />
          )}
        </Box>
      ),
    },
    {
      field: "multiSelect",
      headerName: "Multi-Select",
      flex: 0.5,
      renderCell: (params) => (
        <Chip
          label={params.value ? "Yes" : "No"}
          size="small"
          sx={{ 
            backgroundColor: params.value ? colors.greenAccent[600] : colors.grey[600], 
            color: "white" 
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            onClick={() => openEditDialog(params.row)}
            sx={{ color: colors.greenAccent[400] }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDeleteQuestion(params.row.id)}
            sx={{ color: colors.redAccent[400] }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    if (tabValue === 0) {
      fetchQuestions();
    }
  }, [selectedUserType, tabValue]);

  const renderQuestionsManagement = () => (
    <Box>
      <Box display="flex" gap={2} mb={3} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>User Type</InputLabel>
          <Select
            value={selectedUserType}
            onChange={(e) => setSelectedUserType(e.target.value)}
            label="User Type"
          >
            {userTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={() => setAddDialogOpen(true)}
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: colors.greenAccent[600],
            "&:hover": { backgroundColor: colors.greenAccent[500] },
          }}
        >
          Add Question
        </Button>
        <Button
          variant="outlined"
          onClick={fetchQuestions}
          disabled={loading}
          sx={{
            borderColor: colors.greenAccent[400],
            color: colors.greenAccent[400],
            "&:hover": { borderColor: colors.greenAccent[300] }
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Refresh"}
        </Button>
      </Box>

      {questions.length > 0 && (
        <Box display="flex" alignItems="center" gap={2} mb={3} p={2} backgroundColor={colors.primary[400]} borderRadius={2}>
          <QuestionAnswerIcon sx={{ fontSize: 40, color: colors.greenAccent[400] }} />
          <Box>
            <Typography color={colors.greenAccent[300]} variant="h6">
              {selectedUserType.charAt(0).toUpperCase() + selectedUserType.slice(1)} Questions
            </Typography>
            <Typography color={colors.grey[300]} variant="body2">
              Manage questionnaire questions for {selectedUserType}s
            </Typography>
          </Box>
          <Box ml="auto">
            <StatBox
              title={`${questions.length}`}
              subtitle="Total Questions"
              icon={<QuestionAnswerIcon sx={{ color: colors.greenAccent[600], fontSize: "26px" }} />}
            />
          </Box>
        </Box>
      )}

      <Box height="60vh" sx={{
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": { borderBottom: "none" },
        "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
        "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
        "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
      }}>
        <DataGrid 
          rows={questions} 
          columns={questionColumns} 
          getRowId={(row) => row.id}
          loading={loading}
        />
      </Box>
    </Box>
  );

  const renderUserProfileView = () => (
    <Box>
      <Box display="flex" gap={2} mb={3} alignItems="center">
        <TextField
          label="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ minWidth: 200 }}
        />
        <Button
          variant="contained"
          onClick={fetchUserProfile}
          disabled={loading}
          sx={{
            backgroundColor: colors.greenAccent[600],
            "&:hover": { backgroundColor: colors.greenAccent[500] },
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Fetch Profile"}
        </Button>
      </Box>

      {userProfile && (
        <Box>
          <Box display="flex" alignItems="center" gap={2} mb={3} p={2} backgroundColor={colors.primary[400]} borderRadius={2}>
            <PersonIcon sx={{ fontSize: 40, color: colors.greenAccent[400] }} />
            <Box>
              <Typography color={colors.greenAccent[300]} variant="h6">
                {userProfile.name}
              </Typography>
              <Typography color={colors.grey[300]} variant="body2">
                {userProfile.userType} • {userProfile.email}
              </Typography>
              <Typography color={colors.grey[400]} variant="caption">
                Education: {userProfile.education} • Experience: {userProfile.experience} • Location: {userProfile.location}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" color={colors.greenAccent[300]} mb={2}>
              Questionnaire Answers
            </Typography>
            {userProfile.answers?.map((answer, index) => (
              <Box key={index} mb={2} p={2} backgroundColor={colors.primary[400]} borderRadius={1}>
                <Typography variant="subtitle2" color={colors.greenAccent[300]} gutterBottom>
                  {answer.question}
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {Array.isArray(answer.answer) ? (
                    answer.answer.map((ans, i) => (
                      <Chip
                        key={i}
                        label={ans}
                        size="small"
                        sx={{ backgroundColor: colors.greenAccent[600], color: "white" }}
                      />
                    ))
                  ) : (
                    <Chip
                      label={answer.answer}
                      size="small"
                      sx={{ backgroundColor: colors.greenAccent[600], color: "white" }}
                    />
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ height: "87vh", overflowY: "auto", padding: "20px" }}>
      <Header title="Q&A MANAGEMENT" subtitle="Manage questionnaire questions and user answers" />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            label="Questions Management" 
            icon={<QuestionAnswerIcon />} 
            iconPosition="start"
            sx={{ color: colors.greenAccent[300] }}
          />
          <Tab 
            label="User Profiles" 
            icon={<PersonIcon />} 
            iconPosition="start"
            sx={{ color: colors.greenAccent[300] }}
          />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <TabPanel value={tabValue} index={0}>
        {renderQuestionsManagement()}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderUserProfileView()}
      </TabPanel>

      {/* Add Question Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Question</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Question Label"
              value={newQuestion.label}
              onChange={(e) => setNewQuestion({ ...newQuestion, label: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Order"
              type="number"
              value={newQuestion.order}
              onChange={(e) => setNewQuestion({ ...newQuestion, order: parseInt(e.target.value) || 0 })}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newQuestion.multiSelect}
                  onChange={(e) => setNewQuestion({ ...newQuestion, multiSelect: e.target.checked })}
                />
              }
              label="Allow Multiple Selections"
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Options:
              </Typography>
              {newQuestion.options.map((option, index) => (
                <Box key={index} display="flex" gap={1} mb={1}>
                  <TextField
                    label="Value"
                    value={option.value}
                    onChange={(e) => updateOption('new', index, 'value', e.target.value)}
                    size="small"
                  />
                  <TextField
                    label="Label"
                    value={option.label}
                    onChange={(e) => updateOption('new', index, 'label', e.target.value)}
                    size="small"
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeOption('new', index)}
                    sx={{ color: colors.redAccent[400] }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                onClick={() => addOption('new')}
                startIcon={<AddIcon />}
                variant="outlined"
                size="small"
              >
                Add Option
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddQuestion}
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: colors.greenAccent[600],
              "&:hover": { backgroundColor: colors.greenAccent[500] },
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Add Question"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Question Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Question Label"
              value={editQuestion.label}
              onChange={(e) => setEditQuestion({ ...editQuestion, label: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Order"
              type="number"
              value={editQuestion.order}
              onChange={(e) => setEditQuestion({ ...editQuestion, order: parseInt(e.target.value) || 0 })}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={editQuestion.multiSelect}
                  onChange={(e) => setEditQuestion({ ...editQuestion, multiSelect: e.target.checked })}
                />
              }
              label="Allow Multiple Selections"
            />
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Options:
              </Typography>
              {editQuestion.options.map((option, index) => (
                <Box key={index} display="flex" gap={1} mb={1}>
                  <TextField
                    label="Value"
                    value={option.value}
                    onChange={(e) => updateOption('edit', index, 'value', e.target.value)}
                    size="small"
                  />
                  <TextField
                    label="Label"
                    value={option.label}
                    onChange={(e) => updateOption('edit', index, 'label', e.target.value)}
                    size="small"
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeOption('edit', index)}
                    sx={{ color: colors.redAccent[400] }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button
                onClick={() => addOption('edit')}
                startIcon={<AddIcon />}
                variant="outlined"
                size="small"
              >
                Add Option
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEditQuestion}
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: colors.greenAccent[600],
              "&:hover": { backgroundColor: colors.greenAccent[500] },
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Update Question"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QAManagement;
