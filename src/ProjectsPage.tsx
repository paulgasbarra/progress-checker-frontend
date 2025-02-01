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
} from "@mui/material";

interface Project {
  id: number;
  name: string;
  description: string;
}

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

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

  const handleCreateProject = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newProjectName, description: newProjectDescription }),
      });

      if (response.ok) {
        const newProject = await response.json();
        setProjects([...projects, newProject]);
        setOpenCreateModal(false);
        setNewProjectName("");
        setNewProjectDescription("");
      } else {
        alert("Failed to create project.");
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleEditProject = async () => {
    if (!selectedProject) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${selectedProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newProjectName, description: newProjectDescription }),
      });

      if (response.ok) {
        const updatedProject = await response.json();
        setProjects(projects.map((proj) => (proj.id === updatedProject.id ? updatedProject : proj)));
        setOpenEditModal(false);
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
      <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)}>
        Create Project
      </Button>
      <List>
        {projects.map((project) => (
          <ListItem
            button
            key={project.id}
            onClick={() => {
              setSelectedProject(project);
              setNewProjectName(project.name);
              setNewProjectDescription(project.description);
              setOpenEditModal(true);
            }}
            sx={{ border: '1px solid #ccc', borderRadius: '4px', mb: 1 }}
          >
            <ListItemText primary={project.name} secondary={project.description} />
          </ListItem>
        ))}
      </List>

      {/* Create Project Modal */}
      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
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
          <Button variant="contained" color="primary" onClick={handleCreateProject}>
            Create
          </Button>
        </Box>
      </Modal>

      {/* Edit Project Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
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
          <Button variant="contained" color="primary" onClick={handleEditProject}>
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