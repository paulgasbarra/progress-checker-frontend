import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Modal,
  Box,
  TextField,
  Tab,
  Tabs,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Criteria {
  id: number;
  title: string;
}

interface Milestone {
  id: number;
  title: string;
  description: string;
  criteria: Criteria[];
}

interface Project {
  id: number;
  name: string;
  description: string;
  milestones: Milestone[];
}

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [openAddMilestoneModal, setOpenAddMilestoneModal] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDescription, setNewMilestoneDescription] = useState("");
  const [availableMilestones, setAvailableMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    console.log("Fetching project details for project ID:", id);
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProject(data);
        console.log("Project data:", data);
        setAvailableMilestones(data.milestones);
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const fetchAvailableMilestones = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/milestones`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAvailableMilestones(data);
    } catch (error) {
      console.error("Error fetching available milestones:", error);
    }
  };

  const handleOpenAddMilestoneModal = () => {
    fetchAvailableMilestones();
    setOpenAddMilestoneModal(true);
  };

  const handleSelectMilestone = async (milestoneId: number) => {
    try {
      console.log("Selecting milestone:", milestoneId);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}/milestones/${milestoneId}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedProject = await response.json();
      setProject(updatedProject);
      setOpenAddMilestoneModal(false);
    } catch (error) {
      console.error("Error adding milestone to project:", error);
    }
  };

  const handleDeleteMilestone = async (milestoneId: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}/milestones/${milestoneId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedProject = await response.json();
      setProject(updatedProject);
    } catch (error) {
      console.error("Error removing milestone from project:", error);
    }
  };

  const handleAddMilestone = async () => {
    console.log("Adding new milestone:", newMilestoneTitle, newMilestoneDescription);
    setOpenAddMilestoneModal(false);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (!project) {
    return <Typography>Project not found.</Typography>;
  }

  return (
    <Container fixed sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Project: {project.name}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Description: {project.description}
      </Typography>
      <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
        <Typography variant="h6">Milestones</Typography>
        <Button variant="outlined" sx={{ ml: 2 }} onClick={handleOpenAddMilestoneModal}>
          Add Milestone
        </Button>
      </Box>
      <List>
        {project.milestones && project.milestones.map((milestone) => (
          <Card key={milestone.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle1">{milestone.title}</Typography>
                  <Typography variant="body2">{milestone.description}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>Criteria:</Typography>
                  <List>
                    {milestone.criteria.map((criterion) => (
                      <ListItem key={criterion.id}>
                        <ListItemText primary={criterion.title} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
                <IconButton onClick={() => handleDeleteMilestone(milestone.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </List>

      {/* Add Milestone Modal */}
      <Modal open={openAddMilestoneModal} onClose={() => setOpenAddMilestoneModal(false)}>
        <Box sx={{ ...modalStyle, maxHeight: '80vh', overflow: 'auto' }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Select Milestone" />
            <Tab label="Create New Milestone" />
          </Tabs>
          {tabValue === 0 && (
            <Box sx={{ p: 2 }}>
              <Typography>Select a milestone from the list:</Typography>
              <List>
                {availableMilestones.map((milestone) => (
                  <ListItem key={milestone.id} button onClick={() => handleSelectMilestone(milestone.id)}>
                    <ListItemText primary={milestone.title} secondary={milestone.description} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
          {tabValue === 1 && (
            <Box sx={{ p: 2 }}>
              <Typography>Create a new milestone:</Typography>
              <TextField
                label="Milestone Title"
                fullWidth
                margin="normal"
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
              />
              <TextField
                label="Milestone Description"
                fullWidth
                margin="normal"
                multiline
                rows={2}
                value={newMilestoneDescription}
                onChange={(e) => setNewMilestoneDescription(e.target.value)}
              />
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAddMilestone}>
                Add Milestone
              </Button>
            </Box>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default ProjectDetailPage; 