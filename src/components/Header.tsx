import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  BarChart as BarChartIcon,
  Logout as LogoutIcon,
  Assessment as AssessmentIcon,
  Person as PersonIcon,
  Vaccines as VaccinesIcon,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router";
import { deleteCookie } from "../utils/helper";

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <IconButton
          component={Link}
          to="/dashboard"
          sx={{
            background: isActive("/dashboard") ? "#1976d2" : "#f5f5f5",
            ":hover": {
              background: isActive("/dashboard") ? "#1976d2" : "#f5f5f5",
            },
            mr: 1,
          }}
        >
          <BarChartIcon
            style={{ color: isActive("/dashboard") ? "white" : "#1976d2" }}
          />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          color="primary"
          sx={{
            mr: 2,
            display: "flex",
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            textDecoration: "none",
          }}
        >
          School Vaccination Portal
        </Typography>
        <Box sx={{ flexGrow: 1, display: "flex" }}>
          <Button
            component={Link}
            to="/student-management"
            startIcon={<PersonIcon />}
            variant={isActive("/student-management") ? "contained" : "outlined"}
            sx={{ mx: 1 }}
          >
            Student Management
          </Button>
          <Button
            component={Link}
            to="/vaccination-inventory"
            startIcon={<VaccinesIcon />}
            variant={
              isActive("/vaccination-inventory") ? "contained" : "outlined"
            }
            sx={{ mx: 1 }}
          >
            Drive Management
          </Button>
          <Button
            component={Link}
            to="/reports"
            startIcon={<AssessmentIcon />}
            variant={isActive("/reports") ? "contained" : "outlined"}
            sx={{ mx: 1 }}
          >
            Reports
          </Button>
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <IconButton
            aria-label="logout"
            onClick={() => {
              deleteCookie("token");
              navigate("/login");
            }}
            color="primary"
          >
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
