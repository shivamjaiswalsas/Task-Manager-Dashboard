// app/dashboard/projects/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography, Button, Alert, Snackbar } from "@mui/material";
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { useRouter, useParams } from "next/navigation";
import {
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  Task,
} from "@/app/store/slices/taskSlice";
import { setCurrentProject } from "@/app/store/slices/projectSlice";
import TaskCard from "@/components/Tasks/TaskCard";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import TaskDialog from "@/components/Tasks/TaskDialog";

export default function ProjectDetailsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const { currentProject } = useAppSelector((state) => state.projects);
  const { tasks } = useAppSelector((state) => state.tasks);

  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const projectTasks = tasks.filter((task) => task.projectId === projectId);
  const todoTasks = projectTasks.filter((task) => task.status === "todo");
  const inProgressTasks = projectTasks.filter(
    (task) => task.status === "in-progress"
  );
  const completedTasks = projectTasks.filter(
    (task) => task.status === "completed"
  );

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchProjectAndTasks = async () => {
    setLoading(true);
    try {
      // Fetch project details
      const projectResponse = await fetch(`/api/projects/${projectId}`);
      if (projectResponse.ok) {
        const projectData = await projectResponse.json();
        dispatch(setCurrentProject(projectData.project));
      } else {
        showSnackbar("Project not found", "error");
        router.push("/dashboard/projects");
        return;
      }

      // Fetch tasks for this project
      const tasksResponse = await fetch(`/api/tasks?projectId=${projectId}`);
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        dispatch(setTasks(tasksData.tasks));
      }
    } catch (error) {
      showSnackbar("Failed to fetch data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    status: Task["status"];
    priority: Task["priority"];
    dueDate?: string;
  }) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...taskData,
          projectId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(addTask(data.task));
        showSnackbar("Task created successfully", "success");
      } else {
        const error = await response.json();
        showSnackbar(error.error || "Failed to create task", "error");
      }
    } catch (error) {
      showSnackbar("Network error occurred", "error");
    }
  };

  const handleUpdateTask = async (taskData: {
    title: string;
    description: string;
    status: Task["status"];
    priority: Task["priority"];
    dueDate?: string;
  }) => {
    if (!editingTask) return;

    try {
      const response = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(updateTask(data.task));
        showSnackbar("Task updated successfully", "success");
      } else {
        const error = await response.json();
        showSnackbar(error.error || "Failed to update task", "error");
      }
    } catch (error) {
      showSnackbar("Network error occurred", "error");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        dispatch(deleteTask(taskId));
        showSnackbar("Task deleted successfully", "success");
      } else {
        const error = await response.json();
        showSnackbar(error.error || "Failed to delete task", "error");
      }
    } catch (error) {
      showSnackbar("Network error occurred", "error");
    }
  };

  const handleStatusChange = async (
    taskId: string,
    newStatus: Task["status"]
  ) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...task,
          status: newStatus,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(updateTask(data.task));
        showSnackbar("Task status updated", "success");
      } else {
        const error = await response.json();
        showSnackbar(error.error || "Failed to update task", "error");
      }
    } catch (error) {
      showSnackbar("Network error occurred", "error");
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleOpenDialog = (task?: Task) => {
    setEditingTask(task || null);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTask(null);
  };

  const handleSaveProject = (taskData: {
    title: string;
    description: string;
    status: Task["status"];
    priority: Task["priority"];
    dueDate?: string;
  }) => {
    if (editingTask) {
      handleUpdateTask(taskData);
    } else {
      handleCreateTask(taskData);
    }
  };

  return (
    <Box>
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold">
          Tasks
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          New Task
        </Button>
      </Box>

      {tasks?.length === 0 && !loading ? (
        <Box className="text-center py-12">
          <Typography variant="h6" color="text.secondary" className="!mb-4">
            No task found
          </Typography>
          <Typography variant="body2" color="text.secondary" className="!mb-4">
            Create your first task to get started with task management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Create Task
          </Button>
        </Box>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onEdit={handleOpenDialog}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      <TaskDialog
        open={dialogOpen}
        title={editingTask ? "Edit Project" : "Create New Task"}
        onClose={handleCloseDialog}
        onSave={handleSaveProject}
        task={editingTask}
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
