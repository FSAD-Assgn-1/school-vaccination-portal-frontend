import {
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Stack,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockOutlineIcon from "@mui/icons-material/LockOutline";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { setCookie } from "../utils/helper";

interface UserSchema {
  user: string;
  password: string;
}

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserSchema>({
    user: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<UserSchema>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<UserSchema> = {};

    if (!formData.user) {
      newErrors.user = "Username is required";
    } else if (formData.user !== "admin") {
      newErrors.user = "Wrong user";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password !== "admin") {
      newErrors.password = "Wrong password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      setCookie("token", `${formData.user}:${formData.password}`, 1);
      navigate("/dashboard");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container maxWidth="sm" sx={{ my: 5 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 700,
          textAlign: "center",
          mb: 3,
        }}
      >
        Sign In <LockOutlineIcon color="secondary" />
      </Typography>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Grid container justifyContent="center">
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="User"
                name="user"
                value={formData.user}
                onChange={handleChange}
                error={!!errors.user}
                helperText={errors.user}
                variant="outlined"
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
              >
                Signin
              </Button>
            </Stack>
          </form>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Signin;
