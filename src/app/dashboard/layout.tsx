"use client";
import React, { useState, useEffect } from "react";
import { Box, CircularProgress, IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { setUser } from "@/app/store/slices/authSlice";
import { setProjects } from "@/app/store/slices/projectSlice";
import { setTasks } from "@/app/store/slices/taskSlice";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import Navbar from "@/components/Layout/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          dispatch(setUser(data.user));
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        router.push("/auth/login");
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, dispatch, router]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (response.ok) {
          const data = await response.json();
          dispatch(setProjects(data.projects));
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        if (response.ok) {
          const data = await response.json();
          dispatch(setTasks(data.tasks));
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (isAuthenticated) {
      fetchProjects();
      fetchTasks();
    }
  }, [isAuthenticated, dispatch]);

  if (!isAuthenticated) {
    return    <div className="flex justify-center items-center h-screen">
      <CircularProgress color="primary" />
    </div>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <Box component="main" sx={{ flex: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
