"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Box,
} from "@mui/material";
import { MoreVert, Edit, Delete } from "@mui/icons-material";
import { Task } from "@/app/store/slices/taskSlice";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Task["status"]) => void;
}

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(task);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(task.id);
    handleMenuClose();
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "warning";
      case "todo":
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
      default:
        return "info";
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Typography variant="h6" component="h3" className="font-semibold">
            {task.title}
          </Typography>
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </div>

        <Typography variant="body2" color="text.secondary" className="mb-3">
          {task.description}
        </Typography>

        <Box className="flex flex-wrap gap-2 mb-3">
          <Chip
            label={task.status.replace("-", " ")}
            color={getStatusColor(task.status)}
            size="small"
          />
          <Chip
            label={`${task.priority} priority`}
            color={getPriorityColor(task.priority)}
            size="small"
            variant="outlined"
          />
        </Box>

        {task.dueDate && (
          <Typography variant="caption" color="text.secondary">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </Typography>
        )}
      </CardContent>

      <CardActions>
        <Button
          size="small"
          onClick={() => onStatusChange(task.id, "completed")}
          disabled={task.status === "completed"}
        >
          {task.status === "completed" ? "Completed" : "Mark Complete"}
        </Button>
      </CardActions>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit className="mr-2" />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <Delete className="mr-2" />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default TaskCard;
