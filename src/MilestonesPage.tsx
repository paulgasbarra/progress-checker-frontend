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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

interface Milestone {
  id: number;
  title: string;
  description: string;
}

interface Criteria {
  id: number;
  title: string;
  milestone_id: number;
}

const MilestonesPage: React.FC = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDescription, setNewMilestoneDescription] = useState("");
  const [newCriteriaTitle, setNewCriteriaTitle] = useState("");
  const [editingCriteria, setEditingCriteria] = useState<Criteria | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [serverAvailable, setServerAvailable] = useState(true);

  useEffect(() => {
    // Fetch milestones from the server
    const fetchMilestones = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/milestones`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMilestones(data);
        setServerAvailable(true);
      } catch (error) {
        console.error("Error fetching milestones:", error);
        setServerAvailable(false);
      }
    };

    fetchMilestones();
  }, []);

  const fetchCriteria = async (milestoneId: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/milestones/${milestoneId}/criteria`);
      const data = await response.json();
      setCriteria(data);
    } catch (error) {
      console.error("Error fetching criteria:", error);
    }
  };

  const handleCreateMilestone = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/milestones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newMilestoneTitle, description: newMilestoneDescription }),
      });

      if (response.ok) {
        const newMilestone = await response.json();
        setMilestones([...milestones, newMilestone]);
        setOpenCreateModal(false);
        setNewMilestoneTitle("");
        setNewMilestoneDescription("");
      } else {
        alert("Failed to create milestone.");
      }
    } catch (error) {
      console.error("Error creating milestone:", error);
    }
  };

  const handleCreateCriteria = async () => {
    if (!selectedMilestone) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/criteria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newCriteriaTitle, milestone_id: selectedMilestone.id }),
      });

      if (response.ok) {
        const newCriteria = await response.json();
        setCriteria([...criteria, newCriteria]);
        setNewCriteriaTitle("");
      } else {
        alert("Failed to create criteria.");
      }
    } catch (error) {
      console.error("Error creating criteria:", error);
    }
  };

  const handleEditCriteria = async () => {
    if (!editingCriteria) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/criteria/${editingCriteria.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editingTitle }),
      });

      if (response.ok) {
        const updatedCriteria = await response.json();
        setCriteria(criteria.map((c) => (c.id === updatedCriteria.id ? updatedCriteria : c)));
        setEditingCriteria(null);
        setEditingTitle("");
      } else {
        alert("Failed to update criteria.");
      }
    } catch (error) {
      console.error("Error updating criteria:", error);
    }
  };

  const handleDeleteCriteria = async (id: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/criteria/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCriteria(criteria.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete criteria.");
      }
    } catch (error) {
      console.error("Error deleting criteria:", error);
    }
  };

  const handleEditMilestone = async () => {
    if (!selectedMilestone) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/milestones/${selectedMilestone.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newMilestoneTitle, description: newMilestoneDescription }),
      });

      if (response.ok) {
        const updatedMilestone = await response.json();
        setMilestones(milestones.map((ms) => (ms.id === updatedMilestone.id ? updatedMilestone : ms)));
        setOpenEditModal(false);
        setSelectedMilestone(null);
      } else {
        alert("Failed to update milestone.");
      }
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  return (
    <Container fixed sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Milestones
      </Typography>
      {!serverAvailable && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Server is unavailable. Please try again later.
        </Alert>
      )}
      <Button variant="contained" color="primary" onClick={() => setOpenCreateModal(true)}>
        Create Milestone
      </Button>
      <List>
        {milestones.map((milestone) => (
          <ListItem
            button
            key={milestone.id}
            onClick={() => {
              setSelectedMilestone(milestone);
              setNewMilestoneTitle(milestone.title);
              setNewMilestoneDescription(milestone.description);
              fetchCriteria(milestone.id);
              setOpenEditModal(true);
            }}
            sx={{ border: '1px solid #ccc', borderRadius: '4px', mb: 1 }}
          >
            <ListItemText primary={milestone.title} secondary={milestone.description} />
          </ListItem>
        ))}
      </List>

      {/* Create Milestone Modal */}
      <Modal open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6">Create Milestone</Typography>
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
            value={newMilestoneDescription}
            onChange={(e) => setNewMilestoneDescription(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleCreateMilestone}>
            Create
          </Button>
        </Box>
      </Modal>

      {/* Edit Milestone Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={{ ...modalStyle }}>
          <Typography variant="h6">Edit Milestone</Typography>
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
            value={newMilestoneDescription}
            onChange={(e) => setNewMilestoneDescription(e.target.value)}
          />
          <Button variant="contained" color="primary" onClick={handleEditMilestone}>
            Save Changes
          </Button>

          <Typography variant="h6" sx={{ mt: 2 }}>Criteria</Typography>
          <List>
            {criteria.map((criterion) => (
              <ListItem
                key={criterion.id}
                sx={{ border: '1px solid #ccc', borderRadius: '4px', mb: 1 }}
                secondaryAction={
                  editingCriteria && editingCriteria.id === criterion.id ? (
                    <>
                      <IconButton onClick={handleEditCriteria}>
                        <SaveIcon />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton
                        onClick={() => {
                          setEditingCriteria(criterion);
                          setEditingTitle(criterion.title);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteCriteria(criterion.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )
                }
              >
                {editingCriteria && editingCriteria.id === criterion.id ? (
                  <TextField
                    fullWidth
                    margin="normal"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleEditCriteria();
                      }
                    }}
                  />
                ) : (
                  <ListItemText primary={criterion.title} />
                )}
              </ListItem>
            ))}
          </List>
          <TextField
            label="New Criteria Title"
            fullWidth
            margin="normal"
            value={newCriteriaTitle}
            onChange={(e) => setNewCriteriaTitle(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateCriteria}
          >
            Add Criteria
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

export default MilestonesPage; 