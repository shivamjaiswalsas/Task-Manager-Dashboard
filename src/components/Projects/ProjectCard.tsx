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
} from "@mui/material";
import { MoreVert, Edit, Delete, Visibility } from "@mui/icons-material";
import { Project } from "@/app/store/slices/projectSlice";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectCard = ({ project, onEdit, onDelete }: ProjectCardProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(project);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(project.id);
    handleMenuClose();
  };

  return (
    <Card className="h-full w-full flex flex-col">
      <CardContent className="flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Typography variant="h6" component="h2" className="font-semibold">
            {project.name}
          </Typography>
          <IconButton size="small" onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </div>

        <Typography variant="body2" color="text.secondary" className="mb-4">
          {project.description}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Created: {new Date(project.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          component={Link}
          href={`/dashboard/${project.id}`}
          startIcon={<Visibility />}
        >
          View
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

export default ProjectCard;
