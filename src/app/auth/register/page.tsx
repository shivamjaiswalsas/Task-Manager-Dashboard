import React from "react";
import { Container, Box } from "@mui/material";
import RegisterForm from "@/components/Auth/RegisterForm";

export default function RegisterPage() {
  return (
    <Container maxWidth="sm">
      <Box className="min-h-screen flex items-center justify-center py-12 px-4">
        <RegisterForm />
      </Box>
    </Container>
  );
}
