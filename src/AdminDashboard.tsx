import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const AdminDashboard: React.FC = () => {
  const [projectName, setProjectName] = useState<string>("");
  const [projectDescription, setProjectDescription] = useState<string>("");
  const [milestoneTitle, setMilestoneTitle] = useState<string>("");
  const [milestoneDueDate, setMilestoneDueDate] = useState<string>("");
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: projectName, description: projectDescription }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Project created: ${data.name}`);
        setSelectedProjectId(data.id); // Set the project ID for adding milestones
      } else {
        alert("Failed to create project.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleAddMilestone = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProjectId) {
      alert("Please create a project first.");
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${selectedProjectId}/milestones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: milestoneTitle, dueDate: milestoneDueDate }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Milestone added: ${data.title}`);
      } else {
        alert("Failed to add milestone.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>
      <Box component="form" onSubmit={handleCreateProject} sx={{ mb: 4 }}>
        <Typography variant="h6">Create Project</Typography>
        <TextField
          label="Project Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />
        <TextField
          label="Project Description"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Create Project
        </Button>
      </Box>

      <Box component="form" onSubmit={handleAddMilestone}>
        <Typography variant="h6">Add Milestone</Typography>
        <TextField
          label="Milestone Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={milestoneTitle}
          onChange={(e) => setMilestoneTitle(e.target.value)}
          required
        />
        <TextField
          label="Due Date"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={milestoneDueDate}
          onChange={(e) => setMilestoneDueDate(e.target.value)}
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Milestone
        </Button>
      </Box>
    </Container>
  );
};

export default AdminDashboard; 