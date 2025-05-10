import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import Header from "../components/Header";
import useNotification from "../hooks/useToastMessage";
import useVaccinationDrive from "../hooks/useVaccinationDriveData";
import { isResponseSuccess } from "../utils/helper";
import {
  classes,
  ErrorRespObject,
  SuccessRespObject,
  VaccineDriveFormSchema,
  VaccineDriveInfo,
  vaccines,
} from "../utils/types";

import { useForm } from "@mantine/form";

const formatDateToISOWithUTC = (date: Date): string => {
  return `${date.toISOString().split(".")[0]}+00:00`;
};

const date15DaysFromNow = new Date();
date15DaysFromNow.setDate(date15DaysFromNow.getDate() + 16);

const VaccinationDrivePage: React.FC = () => {
  const {
    data: vaccinationDrives,
    addVaccinationDrive,
    EditVaccinationDrive,
    fetchVaccinationDriveData,
  } = useVaccinationDrive();
  const { toastError, toastSuccess } = useNotification();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDrive, setEditingDrive] = useState<
    (VaccineDriveFormSchema | VaccineDriveInfo) | null
  >(null);

  const form = useForm<VaccineDriveFormSchema>({
    initialValues: {
      vaccine_name: vaccines[0],
      drive_date: date15DaysFromNow.toISOString().split("T")[0],
      doses: 0,
      classes: [],
    },
    validate: {
      vaccine_name: (value) =>
        value === null || value.length < 1
          ? "Vaccine name cannot be empty"
          : null,
      drive_date: (value) =>
        value.length < 1 ? "Drive date cannot be empty" : null,
      doses: (value) => (value < 1 ? "doses No cannot be empty" : null),
      classes: (value) =>
        value.length < 1 ? "Classes No cannot be empty" : null,
    },
  });

  const handleSubmitAddEditDrive = React.useCallback(
    async (drive: VaccineDriveFormSchema) => {
      const commaSeparatedValues = drive.classes.join(", ");

      if (editingDrive) {
        const rec: Partial<VaccineDriveInfo> = { id: editingDrive.id };
        const dirtyFields = form.getDirty();
        Object.keys(dirtyFields).forEach((y) => {
          const x = y as keyof VaccineDriveInfo;
          if (dirtyFields[x]) {
            if (x === "classes") {
              rec[x] = commaSeparatedValues as any;
            } else if (x === "drive_date") {
              rec[x] = formatDateToISOWithUTC(
                new Date(drive.drive_date)
              ) as any;
            } else {
              rec[x] = drive[x] as any;
            }
          }
        });
        const resp = await EditVaccinationDrive(rec);
        if (!isResponseSuccess(resp)) {
          toastError(
            (resp as ErrorRespObject).error_string,
            (resp as ErrorRespObject).message_string
          );
        } else {
          toastSuccess(
            (resp as SuccessRespObject<VaccineDriveInfo>).message_string
          );
        }
      } else {
        const resp = await addVaccinationDrive({
          ...drive,
          drive_date: formatDateToISOWithUTC(new Date(drive.drive_date)),
          classes: commaSeparatedValues,
        });
        if (!isResponseSuccess(resp)) {
          toastError(
            (resp as ErrorRespObject).error_string,
            (resp as ErrorRespObject).message_string
          );
        } else {
          toastSuccess(
            (resp as SuccessRespObject<VaccineDriveInfo>).message_string
          );
        }
      }
      setModalOpen(false);
      setEditingDrive(null);
      form.reset();
      await fetchVaccinationDriveData();
    },
    [
      addVaccinationDrive,
      editingDrive,
      fetchVaccinationDriveData,
      form,
      toastError,
      toastSuccess,
      EditVaccinationDrive,
    ]
  );

  const handleClickEdit = React.useCallback(
    (drive: VaccineDriveInfo) => {
      const classesArray = drive.classes.split(", ");
      setEditingDrive(drive);
      form.setValues({ ...drive, classes: classesArray });
      setModalOpen(true);
    },
    [form]
  );

  return (
    <Box>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        <Stack direction="row" spacing={2} mb={2} justifyContent={"flex-end"}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
          >
            Add Drive
          </Button>
        </Stack>

        <TableContainer component={Paper} elevation={1}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Vaccine Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Doses</TableCell>
                <TableCell>Classes</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vaccinationDrives.map((drive) => (
                <TableRow key={drive.id}>
                  <TableCell>{drive?.id}</TableCell>
                  <TableCell>{drive.vaccine_name}</TableCell>
                  <TableCell>
                    {new Date(drive.drive_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{drive.doses}</TableCell>
                  <TableCell>{drive.classes}</TableCell>
                  <TableCell>
                    <Button
                      startIcon={<EditIcon />}
                      variant="outlined"
                      onClick={() => handleClickEdit(drive)}
                      disabled={new Date(drive.drive_date) < new Date()}
                      size="small"
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingDrive(null);
            form.reset();
          }}
          maxWidth="sm"
          fullWidth
        >
          <form onSubmit={form.onSubmit(handleSubmitAddEditDrive)}>
            <DialogTitle>
              {editingDrive ? "Edit Drive" : "Add Drive"}
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3} sx={{ mt: 2 }}>
                <Autocomplete
                  {...form.getInputProps("vaccine_name")}
                  onChange={(_event: any, newValue: string | null) => {
                    const { onChange } = form.getInputProps("vaccine_name");
                    onChange(newValue);
                  }}
                  options={vaccines}
                  sx={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField {...params} size="small" label="Vaccine Name" />
                  )}
                />

                <TextField
                  fullWidth
                  label="Drive Date"
                  type="date"
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: {
                      min: editingDrive
                        ? undefined
                        : date15DaysFromNow.toISOString().split("T")[0],
                    },
                  }}
                  {...form.getInputProps("drive_date")}
                  error={!!form.errors.drive_date}
                  helperText={form.errors.drive_date}
                />

                <TextField
                  fullWidth
                  label="Number of Doses"
                  type="number"
                  {...form.getInputProps("doses")}
                  onChange={(e) => {
                    const { onChange } = form.getInputProps("doses");
                    const x = parseInt(e.target.value);
                    if (isNaN(x)) {
                      onChange(e.target.value);
                      form.setErrors({
                        doses: "Please enter numerical value",
                      });
                    } else {
                      if (x <= 0) {
                        form.setErrors({
                          doses: "Please enter positive numerical value",
                        });
                      }
                      onChange(x);
                    }
                  }}
                  error={!!form.errors.doses}
                  helperText={form.errors.doses}
                />

                <Autocomplete
                  multiple
                  {...form.getInputProps("classes")}
                  getOptionLabel={(option) => option}
                  onChange={(_event: any, newValue: string[] | null) => {
                    const { onChange } = form.getInputProps("classes");
                    onChange(newValue);
                  }}
                  options={classes}
                  sx={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      label="Applicable Classes"
                      error={!!form.errors.classes}
                      helperText={form.errors.classes}
                    />
                  )}
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setModalOpen(false);
                  setEditingDrive(null);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button variant="contained" type="submit">
                {editingDrive ? "Save Changes" : "Add Drive"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
};

export default VaccinationDrivePage;
