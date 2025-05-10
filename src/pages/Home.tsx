import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import {
  Person as PersonIcon,
  Vaccines as VaccinesIcon,
} from "@mui/icons-material";
import React from "react";
import Header from "../components/Header";
import useStudentDashboardData from "../hooks/useStudentDashboardData";
import useVaccinationDriveData from "../hooks/useVaccinationDriveData";

const Home: React.FC = () => {
  const {
    dashboardData,
    error: studentError,
    loading: studentDataLoading,
  } = useStudentDashboardData();
  const {
    data: drivesWithin30Days,
    error: drivesError,
    loading: drivesLoading,
  } = useVaccinationDriveData();

  return (
    <Box>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Grid container spacing={3} justifyContent="space-around">
          <Grid size={3}>
            <Card elevation={1} sx={{ mb: 2 }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography>Total Students</Typography>
                  <PersonIcon />
                </Stack>
                <Typography variant="h4" color="primary" align="center">
                  {studentDataLoading ? (
                    <CircularProgress size={20} />
                  ) : studentError ? (
                    <Typography color="error">Error</Typography>
                  ) : (
                    dashboardData?.total_students
                  )}
                </Typography>
              </CardContent>
            </Card>
            <Card elevation={1}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="center"
                  alignItems="center"
                  spacing={1}
                >
                  <Typography>Vaccinated Students</Typography>
                  <VaccinesIcon />
                </Stack>
                <Typography variant="h4" color="primary" align="center">
                  {studentDataLoading ? (
                    <CircularProgress size={20} />
                  ) : studentError ? (
                    <Typography color="error">Error</Typography>
                  ) : (
                    <>
                      {dashboardData?.vaccinated_students} (
                      {(
                        ((dashboardData?.vaccinated_students ?? 0) /
                          (dashboardData?.total_students === 0
                            ? 1
                            : dashboardData?.total_students ?? 1)) *
                        100
                      ).toFixed(2)}
                      %)
                    </>
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={8}>
            <Typography variant="h5" sx={{ mt: 4, mb: 2 }} color="textPrimary">
              Upcoming Vaccination Drives
            </Typography>
            {drivesLoading ? (
              <CircularProgress size={20} />
            ) : drivesError ? (
              <Typography color="error">Error</Typography>
            ) : (
              <>
                {drivesWithin30Days.length > 0 ? (
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }} align="center">
                            Vaccine Name
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }} align="center">
                            Drive Date
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {drivesWithin30Days.map((drive) => (
                          <TableRow key={drive.id}>
                            <TableCell align="center">
                              {drive.vaccine_name}
                            </TableCell>
                            <TableCell align="center">
                              {new Date(drive.drive_date).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Typography>
                      No vaccination drives scheduled in the next 30 days.
                    </Typography>
                  </Paper>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
