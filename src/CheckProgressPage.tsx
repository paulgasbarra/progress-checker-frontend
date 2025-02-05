import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";

interface Project {
  id: number;
  name: string;
}

interface Milestone {
  id: number;
  title: string;
}

const CheckProgressPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);
  const [repoUrl, setRepoUrl] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const fetchMilestones = async (projectId: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}/milestones`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMilestones(data);
    } catch (error) {
      console.error("Error fetching milestones:", error);
    }
  };

  const handleProjectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const projectId = event.target.value as number;
    setSelectedProject(projectId);
    fetchMilestones(projectId);
  };

  const handleMilestoneChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedMilestone(event.target.value as number);
  };

  const handleSubmit = () => {
    console.log("Selected Project:", selectedProject);
    console.log("Selected Milestone:", selectedMilestone);
    console.log("Repository URL:", repoUrl);
    // Implement logic to check progress based on the selected project, milestone, and repo URL
  };

  return (
    <Container fixed sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Check Progress
      </Typography>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Select Project</InputLabel>
        <Select value={selectedProject || ""} onChange={handleProjectChange}>
          {projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedProject && (
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Select Milestone</InputLabel>
          <Select value={selectedMilestone || ""} onChange={handleMilestoneChange}>
            {milestones.map((milestone) => (
              <MenuItem key={milestone.id} value={milestone.id}>
                {milestone.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
      {selectedMilestone && (
        <TextField
          label="Repository URL"
          fullWidth
          margin="normal"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
      )}
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>
        Check Progress
      </Button>
    </Container>
  );
};

export default CheckProgressPage;