import React from "react";
import { Container, Box } from "@mui/material";
import LoginForm from "@/components/Auth/LoginForm";

export default function LoginPage() {
  return (
    <Container maxWidth="sm">
      <Box className="min-h-screen flex items-center justify-center py-12 px-4">
        <LoginForm />
      </Box>
    </Container>
  );
}
