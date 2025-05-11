import { useForm } from "@mantine/form";
import {
  Edit as EditIcon,
  Search as SearchIcon,
  Vaccines as VaccineIcon,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import useNotification from "../hooks/useToastMessage";
import useStudent from "../hooks/useStudentData";
import { isResponseSuccess } from "../utils/helper";
import {
  classes,
  ErrorRespObject,
  genders,
  ImportRecordStatusResp,
  Student,
  SuccessRespObject,
  vaccines,
  VaccineStudentFormSchema,
} from "../utils/types";

const limit = 5;

const StudentPage: React.FC = () => {
  const {
    addStudent,
    fetchStudents,
    vaccinateStudent,
    loading,
    students,
    updateStudent,
    total,
    bulkUploadStudents,
    bulkUploadVaccination,
    saving,
    generateReport,
  } = useStudent();
  const { toastError, toastSuccess } = useNotification();
  const [searchQueryObj, setSearchQueryObj] = useState<{
    name: string;
    class: string;
    gender: string;
    roll_no: string;
    phone_no: string;
    vaccine_name: string;
    vaccination: boolean | null;
  }>({
    name: "",
    class: "",
    gender: "",
    roll_no: "",
    phone_no: "",
    vaccine_name: "",
    vaccination: null,
  });

  const [modalOpen, setModalOpen] = useState(false);

  const [vaccinateModalOpen, setVaccinateModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [page, setPage] = useState(1);

  const [modalOpenGeRep, setModalOpenGeRep] = useState(false);
  const [link, setLink] = useState<
    ErrorRespObject | ImportRecordStatusResp | null
  >(null);

  const form = useForm<Student>({
    initialValues: {
      name: "",
      class: "",
      gender: "",
      roll_no: "",
      phone_no: "",
    },
    validate: {
      name: (value) => {
        return value.length === 0
          ? "Name is required"
          : value.length < 3
          ? "Name should be at least 3 characters long"
          : null;
      },
      class: (value) =>
        value === null || value.length < 1 ? "Class is required" : null,
      gender: (value) =>
        value === null || value.length < 1 ? "Gender is required" : null,
      roll_no: (value) => (value.length < 1 ? "Roll No is required" : null),
      phone_no: (value) => (value.length < 1 ? "Phone No is required" : null),
    },
  });

  const vaccinateForm = useForm<VaccineStudentFormSchema>({
    initialValues: {
      student_id: null,
      drive_id: undefined,
    },
    validate: {
      student_id: (value) => (value === null ? "Student id is required" : null),
      drive_id: (value) =>
        value === null || value === undefined ? "Drive id is required" : null,
    },
  });

  useEffect(() => {
    fetchStudents({
      limit,
      page,
      searchQueryObj,
    });
  }, [fetchStudents, page, searchQueryObj]);

  const handleSubmitAddEditStudent = React.useCallback(
    async (values: Student) => {
      if (editingStudent) {
        const rec: Partial<Student> = { id: editingStudent.id };
        const dirtyFields = form.getDirty();
        Object.keys(dirtyFields).forEach((x) => {
          if (dirtyFields[x]) {
            rec[x as keyof Student] = values[x as keyof Student] as any;
          }
        });

        const resp = await updateStudent(rec);
        if (!isResponseSuccess(resp)) {
          toastError(
            (resp as ErrorRespObject).error_string,
            (resp as ErrorRespObject).message_string
          );
          return;
        } else {
          toastSuccess((resp as SuccessRespObject<Student>).message_string);
        }
      } else {
        const resp = await addStudent(values);
        if (!isResponseSuccess(resp)) {
          toastError(
            (resp as ErrorRespObject).error_string,
            (resp as ErrorRespObject).message_string
          );
          return;
        } else {
          toastSuccess((resp as SuccessRespObject<Student>).message_string);
        }
      }
      setModalOpen(false);
      setEditingStudent(null);
      form.reset();
      fetchStudents({
        limit,
        page,
        searchQueryObj,
      });
    },
    [
      addStudent,
      editingStudent,
      fetchStudents,
      form,
      toastError,
      toastSuccess,
      page,
      searchQueryObj,
      updateStudent,
    ]
  );

  const handleBulkUploadStudent = React.useCallback(
    async (file: File) => {
      const resp = await bulkUploadStudents(file);
      if (!isResponseSuccess(resp)) {
        toastError(
          (resp as ErrorRespObject).error_string,
          (resp as ErrorRespObject).message_string
        );
      } else {
        toastSuccess((resp as SuccessRespObject<Student>).message_string);
      }
    },
    [bulkUploadStudents, toastError, toastSuccess]
  );

  const handleBulkVaccineRecords = React.useCallback(
    async (file: File) => {
      const resp = await bulkUploadVaccination(file);
      if (!isResponseSuccess(resp)) {
        toastError(
          (resp as ErrorRespObject).error_string,
          (resp as ErrorRespObject).message_string
        );
      } else {
        toastSuccess((resp as SuccessRespObject<Student>).message_string);
      }
    },
    [bulkUploadVaccination, toastError, toastSuccess]
  );

  const handleVaccinate = React.useCallback(
    (student: Student) => {
      setEditingStudent(student);
      vaccinateForm.setValues({
        student_id: student.id || null,
        drive_id: null,
      });
      setVaccinateModalOpen(true);
    },
    [vaccinateForm]
  );

  const handleSubmitStudentVaccination = React.useCallback(
    async (values: VaccineStudentFormSchema) => {
      const resp = await vaccinateStudent(values);
      if (!isResponseSuccess(resp)) {
        toastError(
          (resp as ErrorRespObject).error_string,
          (resp as ErrorRespObject).message_string
        );
        return;
      } else {
        toastSuccess((resp as SuccessRespObject<Student>).message_string);
      }
      setVaccinateModalOpen(false);
      setEditingStudent(null);
      vaccinateForm.reset();
      fetchStudents({
        limit,
        page,
        searchQueryObj,
      });
    },
    [
      fetchStudents,
      toastError,
      toastSuccess,
      page,
      searchQueryObj,
      vaccinateForm,
      vaccinateStudent,
    ]
  );

  const handleEdit = React.useCallback(
    (student: Student) => {
      setEditingStudent(student);
      form.setValues(student);
      setModalOpen(true);
    },
    [form]
  );

  const handleChangeQuery = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setPage(1);
      setSearchQueryObj((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    },
    []
  );

  const handleClickGenerateRep = React.useCallback(async () => {
    let query = "";
    Object.keys(searchQueryObj).forEach((key) => {
      if (
        (key === "class" || key === "vaccine_name") &&
        searchQueryObj[key as keyof typeof searchQueryObj]
      ) {
        query += `${key}=${
          searchQueryObj[key as keyof typeof searchQueryObj]
        }&`;
      }
    });
    const resp = await generateReport(query);

    setLink(resp);
  }, [generateReport, searchQueryObj]);

  return (
    <Box>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Stack direction="row" spacing={2} mb={2} justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={() => setModalOpen(true)}
            startIcon={<AddIcon />}
          >
            Add Student
          </Button>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Upload Bulk Student
            <input
              type="file"
              hidden
              accept=".xlsx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleBulkUploadStudent(file);
              }}
            />
          </Button>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUploadIcon />}
          >
            Upload Vaccine Records
            <input
              type="file"
              hidden
              accept=".xlsx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleBulkVaccineRecords(file);
              }}
            />
          </Button>
          <Button
            startIcon={<CloudDownloadIcon />}
            variant="contained"
            onClick={() => setModalOpenGeRep(true)}
          >
            Generate Report
          </Button>
        </Stack>

        <TableContainer component={Paper} elevation={1}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Roll No</Typography>
                    <TextField
                      size="small"
                      placeholder="Search"
                      name="roll_no"
                      value={searchQueryObj.roll_no}
                      onChange={handleChangeQuery}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Stack>
                </TableCell>
                <TableCell sx={{ width: "150px" }}>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Name</Typography>
                    <TextField
                      size="small"
                      placeholder="Search"
                      name="name"
                      value={searchQueryObj.name}
                      onChange={handleChangeQuery}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Class</Typography>
                    <Autocomplete
                      value={searchQueryObj.class}
                      onChange={(_event: any, newValue: string | null) => {
                        setPage(1);
                        setSearchQueryObj((prev) => ({
                          ...prev,
                          class: newValue ?? "",
                        }));
                      }}
                      options={classes}
                      sx={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  </Stack>
                </TableCell>
                <TableCell>Gender</TableCell>

                <TableCell>Phone No</TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Vaccinated</Typography>
                    <Autocomplete
                      value={
                        searchQueryObj.vaccination === null
                          ? null
                          : searchQueryObj.vaccination === true
                          ? "Yes"
                          : "No"
                      }
                      onChange={(_event: any, newValue: string | null) => {
                        setPage(1);
                        setSearchQueryObj((prev) => {
                          let val = null;
                          switch (newValue) {
                            case "Yes":
                              val = true;
                              break;
                            case "No":
                              val = false;
                              break;
                            default:
                              val = null;
                          }
                          return {
                            ...prev,
                            vaccination: val,
                          };
                        });
                      }}
                      options={["Yes", "No"]}
                      sx={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  </Stack>
                </TableCell>
                <TableCell>Vaccine date</TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Vaccine</Typography>
                    <Autocomplete
                      value={searchQueryObj.vaccine_name}
                      onChange={(_event: any, newValue: string | null) => {
                        setPage(1);
                        setSearchQueryObj((prev) => ({
                          ...prev,
                          vaccine_name: newValue ?? "",
                        }));
                      }}
                      options={vaccines}
                      sx={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField {...params} size="small" />
                      )}
                    />
                  </Stack>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            {!loading && (
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.roll_no}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.class}</TableCell>
                    <TableCell>{student.gender}</TableCell>

                    <TableCell>{student.phone_no}</TableCell>

                    <TableCell>{student.vaccination ? "Yes" : "No"}</TableCell>
                    <TableCell>{student.vaccine_date}</TableCell>
                    <TableCell>{student.vaccine_name}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(student)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleVaccinate(student)}
                          disabled={student.vaccination}
                          color="secondary"
                        >
                          <VaccineIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
          {loading && (
            <Box sx={{ p: 2 }}>
              {[...Array(5)].map((_, index) => (
                <Skeleton key={index} height={53} />
              ))}
            </Box>
          )}
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={Math.ceil(total / limit)}
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </Box>

        {/* Add/Edit Student Dialog */}
        <Dialog
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingStudent(null);
            form.reset();
          }}
          maxWidth="sm"
          fullWidth
        >
          <form onSubmit={form.onSubmit(handleSubmitAddEditStudent)}>
            <DialogTitle>
              {editingStudent ? "Edit Student" : "Add Student"}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Name"
                  size="small"
                  {...form.getInputProps("name")}
                  error={!!form.errors.name}
                  helperText={form.errors.name}
                />

                <Autocomplete
                  {...form.getInputProps("class")}
                  onChange={(_event: any, newValue: string | null) => {
                    const { onChange } = form.getInputProps("class");
                    onChange(newValue);
                  }}
                  options={classes}
                  sx={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Class"
                      error={!!form.errors.class}
                      helperText={form.errors.class}
                    />
                  )}
                />

                <Autocomplete
                  {...form.getInputProps("gender")}
                  onChange={(_event: any, newValue: string | null) => {
                    const { onChange } = form.getInputProps("gender");
                    onChange(newValue);
                  }}
                  options={genders}
                  sx={{ width: "100%" }}
                  disabled={editingStudent ? true : false}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Gender"
                      error={!!form.errors.gender}
                      helperText={form.errors.gender}
                    />
                  )}
                />
                <TextField
                  fullWidth
                  label="Roll No"
                  size="small"
                  {...form.getInputProps("roll_no")}
                  error={!!form.errors.roll_no}
                  helperText={form.errors.roll_no}
                  disabled={editingStudent ? true : false}
                />
                <TextField
                  fullWidth
                  label="Phone No"
                  size="small"
                  {...form.getInputProps("phone_no")}
                  error={!!form.errors.phone_no}
                  helperText={form.errors.phone_no}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="contained" type="submit" disabled={saving}>
                {editingStudent ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog
          open={vaccinateModalOpen}
          onClose={() => {
            setVaccinateModalOpen(false);
            setEditingStudent(null);
            vaccinateForm.reset();
          }}
          maxWidth="sm"
          fullWidth
        >
          <form
            onSubmit={vaccinateForm.onSubmit(handleSubmitStudentVaccination)}
          >
            <DialogTitle>Vaccinate Student</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                type="number"
                label="Drive ID"
                {...vaccinateForm.getInputProps("drive_id")}
                onChange={(e) => {
                  const { onChange } = vaccinateForm.getInputProps("drive_id");
                  const x = parseInt(e.target.value);
                  if (isNaN(x)) {
                    onChange(e.target.value);
                    vaccinateForm.setErrors({
                      drive_id: "Please enter numerical value",
                    });
                  } else {
                    onChange(x);
                  }
                }}
                sx={{ mt: 2 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setVaccinateModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                Vaccinate
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog
          open={modalOpenGeRep}
          onClose={() => {
            setModalOpenGeRep(false);
            setLink(null);
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Generate Report</DialogTitle>
          <DialogContent>
            {link && isResponseSuccess(link) && (
              <Typography
                color="primary"
                component="a"
                href={(link as ImportRecordStatusResp)?.file.replace(
                  "minio-school",
                  "localhost"
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Report
              </Typography>
            )}
            {link && !isResponseSuccess(link) && (
              <Typography color="error">Failed to generate report</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setModalOpenGeRep(false)}>Close</Button>
            <Button
              variant="contained"
              onClick={handleClickGenerateRep}
              disabled={saving}
            >
              Generate Report
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default StudentPage;
