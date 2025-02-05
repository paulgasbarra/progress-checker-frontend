import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Modal,
  Box,
  TextField,
  IconButton,
  Alert,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

interface Project {
  id: number;
  name: string;
  description: string;
}

interface Milestone {
  id: number;
  title: string;
  description: string;
  criteria: string[];
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [openCreateProjectModal, setOpenCreateProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDescription, setNewMilestoneDescription] = useState("");
  const [newCriteria, setNewCriteria] = useState("");
  const [serverAvailable, setServerAvailable] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch projects from the server
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
        setServerAvailable(true);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setServerAvailable(false);
      }
    };

    fetchProjects();
  }, []);

  const handleViewProject = (project: Project) => {
    navigate(`/projects/${project.id}`);
  };

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      { id: milestones.length + 1, title: newMilestoneTitle, description: newMilestoneDescription, criteria: [] },
    ]);
    setNewMilestoneTitle("");
    setNewMilestoneDescription("");
  };

  const handleCreateProject = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDescription,
          milestones: milestones.map(milestone => ({
            title: milestone.title,
            description: milestone.description,
            criteria: milestone.criteria,
          })),
        }),
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects([...projects, newProject]);
        setOpenCreateProjectModal(false);
        setNewProjectName("");
        setNewProjectDescription("");
        setMilestones([]);
      } else {
        alert("Failed to create project.");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <Container fixed sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      {!serverAvailable && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Server is unavailable. Please try again later.
        </Alert>
      )}
      <Button variant="contained" color="primary" onClick={() => setOpenCreateProjectModal(true)}>
        Create Project
      </Button>
      <List>
        {projects.map((project) => (
          <ListItem
            key={project.id}
            sx={{ border: '1px solid #ccc', borderRadius: '4px', mb: 1 }}
            onClick={() => handleViewProject(project)}
            button
          >
            <ListItemText primary={project.name} secondary={project.description} />
          </ListItem>
        ))}
      </List>

      {/* Create Project Modal */}
      <Modal open={openCreateProjectModal} onClose={() => setOpenCreateProjectModal(false)}>
        <Box sx={{ ...modalStyle, maxHeight: '80vh', overflow: 'auto' }}>
          <Typography variant="h6">Create Project</Typography>
          <TextField
            label="Project Name"
            fullWidth
            margin="normal"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <TextField
            label="Project Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
          />
          <Box display="flex" alignItems="center" sx={{ mt: 2 }}>
            <Typography variant="h6">Milestones</Typography>
            <IconButton onClick={handleAddMilestone}>
              <AddIcon />
            </IconButton>
          </Box>
          {milestones && milestones.map((milestone) => (
            <Card key={milestone.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1">{milestone.title}</Typography>
                <Typography variant="body2">{milestone.description}</Typography>
              </CardContent>
            </Card>
          ))}
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
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddMilestone}
          >
            Add Milestone
          </Button>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleCreateProject}>
            Save Project
          </Button>
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

export default ProjectsPage; 