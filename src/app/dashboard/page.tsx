"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Alert, Snackbar } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import {
  setProjects,
  addProject,
  updateProject,
  deleteProject,
  setLoading,
  Project,
} from "@/app/store/slices/projectSlice";
import ProjectCard from "@/components/Projects/ProjectCard";
import ProjectDialog from "@/components/Projects/ProjectDialog";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export default function ProjectsPage() {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((state) => state.projects);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    dispatch(setLoading(true));
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        dispatch(setProjects(data.projects));
      } else {
        showSnackbar("Failed to fetch projects", "error");
      }
    } catch (error) {
      showSnackbar("Network error occurred", "error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCreateProject = async (projectData: {
    name: string;
    description: string;
  }) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(addProject(data.project));
        showSnackbar("Project created successfully", "success");
      } else {
        const error = await response.json();
        showSnackbar(error.error || "Failed to create project", "error");
      }
    } catch (error) {
      showSnackbar("Network error occurred", "error");
    }
  };

  const handleUpdateProject = async (projectData: {
    name: string;
    description: string;
  }) => {
    if (!editingProject) return;

    try {
      const response = await fetch(`/api/projects/${editingProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(updateProject(data.project));
        showSnackbar("Project updated successfully", "success");
      } else {
        const error = await response.json();
        showSnackbar(error.error || "Failed to update project", "error");
      }
    } catch (error) {
      showSnackbar("Network error occurred", "error");
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this project? This will also delete all associated tasks."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        dispatch(deleteProject(projectId));
        showSnackbar("Project deleted successfully", "success");
      } else {
        const error = await response.json();
        showSnackbar(error.error || "Failed to delete project", "error");
      }
    } catch (error) {
      showSnackbar("Network error occurred", "error");
    }
  };

  const handleOpenDialog = (project?: Project) => {
    setEditingProject(project || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProject(null);
  };

  const handleSaveProject = (projectData: {
    name: string;
    description: string;
  }) => {
    if (editingProject) {
      handleUpdateProject(projectData);
    } else {
      handleCreateProject(projectData);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold">
          Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          New Project
        </Button>
      </Box>

      {projects.length === 0 && !loading ? (
        <Box className="text-center py-12">
          <Typography variant="h6" color="text.secondary" className="!mb-4">
            No projects found
          </Typography>
          <Typography variant="body2" color="text.secondary" className="!mb-4">
            Create your first project to get started with task management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Create Project
          </Button>
        </Box>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleOpenDialog}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      )}

      <ProjectDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveProject}
        project={editingProject}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
