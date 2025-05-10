import {
  Box,
  CircularProgress,
  Container,
  Link,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import Header from "../components/Header";
import useReportsData from "../hooks/useReportsData";

const limit = 5;

const Reports: React.FC = () => {
  const { loading, reports, total } = useReportsData();

  const [page, setPage] = useState(1);

  return (
    <Box>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Paper elevation={1} sx={{ p: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>File</TableCell>
                  <TableCell>Link</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Processed Records</TableCell>
                  <TableCell>Total Records</TableCell>
                  <TableCell>Request Type</TableCell>
                  <TableCell>Error</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((rec) => (
                    <TableRow key={rec?.request_id}>
                      <TableCell>{rec?.request_id}</TableCell>
                      <TableCell>{rec?.file_name}</TableCell>
                      <TableCell>
                        <Link
                          href={rec?.file_path.replace(
                            "minio-school",
                            "localhost"
                          )}
                          target="_blank"
                          rel="noreferrer"
                          underline="hover"
                        >
                          Download
                        </Link>
                      </TableCell>
                      <TableCell>{rec?.status}</TableCell>

                      <TableCell>{rec?.processed_records}</TableCell>
                      <TableCell>{rec?.total_records}</TableCell>
                      <TableCell>{rec?.request_Type}</TableCell>
                      <TableCell>{rec?.error_message}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack alignItems="center" sx={{ mt: 2 }}>
            <Pagination
              count={Math.ceil(total / limit)}
              page={page}
              onChange={(_, value) => setPage(value)}
            />
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default Reports;
