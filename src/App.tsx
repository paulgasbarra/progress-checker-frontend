import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CssBaseline, Drawer, List, ListItem, ListItemText, Toolbar, AppBar, Typography } from "@mui/material";
import HomePage from "./HomePage";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";
import ProjectsPage from "./ProjectsPage";
import MilestonesPage from "./MilestonesPage";
import ProjectDetailPage from "./ProjectDetailPage";
import CheckProgressPage from "./CheckProgressPage";

const drawerWidth = 240;

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <CssBaseline />
        <AppBar position="fixed" style={{ zIndex: 1201 }}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              Pursuit Progress Tracker
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          style={{ width: drawerWidth, flexShrink: 0 }}
          PaperProps={{ style: { width: drawerWidth } }}
        >
          <Toolbar />
          <List>
            <ListItem component="a" href="/projects">
              <ListItemText primary="Projects" />
            </ListItem>
            <ListItem component="a" href="/milestones">
              <ListItemText primary="Milestones" />
            </ListItem>
            <ListItem component="a" href="/check-progress">
              <ListItemText primary="Check Progress" />
            </ListItem>
            {["Submissions", "Students"].map((text) => (
              <ListItem key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Drawer>
        <main style={{ marginLeft: drawerWidth }}>
          <Toolbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/milestones" element={<MilestonesPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/check-progress" element={<CheckProgressPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;