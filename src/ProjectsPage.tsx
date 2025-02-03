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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

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
  const [openEditProjectModal, setOpenEditProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDescription, setNewMilestoneDescription] = useState("");
  const [newCriteria, setNewCriteria] = useState("");

  useEffect(() => {
    // Fetch projects from the server
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`);
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    // Log milestones whenever they change
    console.log("Updated milestones:", milestones);
  }, [milestones]);

  const fetchMilestonesForProject = async (projectId: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}/milestones`);
      if (response.ok) {
        const data = await response.json();
        console.log("Milestones data:", data);
        setMilestones(data || []); // Ensure milestones is always an array
      } else {
        console.error("Failed to fetch milestones");
        setMilestones([]); // Reset milestones on failure
      }
    } catch (error) {
      console.error("Error fetching milestones:", error);
      setMilestones([]); // Reset milestones on error
    }
  };

  const handleAddMilestone = () => {
    setMilestones([
      ...milestones,
      { id: milestones.length + 1, title: newMilestoneTitle, description: newMilestoneDescription, criteria: [] },
    ]);
    setNewMilestoneTitle("");
    setNewMilestoneDescription("");
  };

  const handleAddCriteria = (milestoneId: number) => {
    setMilestones(milestones.map(milestone => {
      if (milestone.id === milestoneId) {
        return { ...milestone, criteria: [...milestone.criteria, newCriteria] };
      }
      return milestone;
    }));
    setNewCriteria("");
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

  const handleEditProject = async (project: Project) => {
    console.log("Editing project:", project);
    setSelectedProject(project);
    setNewProjectName(project.name);
    setNewProjectDescription(project.description);
    await fetchMilestonesForProject(project.id);
    setOpenEditProjectModal(true);
  };

  const handleSaveProjectChanges = async () => {
    if (!selectedProject) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${selectedProject.id}`, {
        method: "PUT",
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
        const updatedProject = await response.json();
        setProjects(projects.map(p => (p.id === updatedProject.id ? updatedProject : p)));
        setOpenEditProjectModal(false);
        setSelectedProject(null);
      } else {
        alert("Failed to update project.");
      }
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  return (
    <Container fixed sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenCreateProjectModal(true)}>
        Create Project
      </Button>
      <List>
        {projects.map((project) => (
          <ListItem
            key={project.id}
            sx={{ border: '1px solid #ccc', borderRadius: '4px', mb: 1 }}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleEditProject(project)}>
                <EditIcon />
              </IconButton>
            }
          >
            <ListItemText primary={project.name} secondary={project.description} />
          </ListItem>
        ))}
      </List>

      {/* Create Project Modal */}
      <Modal open={openCreateProjectModal} onClose={() => setOpenCreateProjectModal(false)}>
        <Box sx={{ ...modalStyle }}>
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
          <Typography variant="h6" sx={{ mt: 2 }}>Milestones</Typography>
          {milestones && milestones.map((milestone) => (
            <Box key={milestone.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">{milestone.title}</Typography>
              <Typography variant="body2">{milestone.description}</Typography>
              <Typography variant="body2">Criteria:</Typography>
              {/* <List>
                {milestone.criteria.map((criterion, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={criterion} />
                  </ListItem>
                ))}
              </List> */}
              <TextField
                label="New Criteria"
                fullWidth
                margin="normal"
                value={newCriteria}
                onChange={(e) => setNewCriteria(e.target.value)}
              />
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleAddCriteria(milestone.id)}
              >
                Add Criteria
              </Button>
            </Box>
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

      {/* Edit Project Modal */}
      <Modal open={openEditProjectModal} onClose={() => setOpenEditProjectModal(false)}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6">Edit Project</Typography>
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
          <Typography variant="h6" sx={{ mt: 2 }}>Milestones</Typography>
          {milestones && milestones.map((milestone) => (
            <Box key={milestone.id} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">{milestone.title}</Typography>
              <Typography variant="body2">{milestone.description}</Typography>
              <Typography variant="body2">Criteria:</Typography>
              <List>
                {milestone.criteria && milestone.criteria.map((criterion, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={criterion} />
                  </ListItem>
                ))}
              </List>
              <TextField
                label="New Criteria"
                fullWidth
                margin="normal"
                value={newCriteria}
                onChange={(e) => setNewCriteria(e.target.value)}
              />
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleAddCriteria(milestone.id)}
              >
                Add Criteria
              </Button>
            </Box>
          ))}
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSaveProjectChanges}>
            Save Changes
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