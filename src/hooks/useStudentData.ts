import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import {
  ErrorRespObject,
  ImportRecordStatusResp,
  Student,
  SuccessRespObject,
  unknownErrorResp,
  VaccineStudentFormSchema,
} from "../utils/types";
import { portal_url } from "../utils/api";

function cleanObject(
  argObj: Record<string, string | number | boolean | null | undefined>
) {
  const obj = { ...argObj };
  for (const propName in obj) {
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === ""
    ) {
      delete obj[propName];
    }
  }
  return obj as Record<string, string | number | boolean>;
}

function getQueryString(
  queryObj: Record<string, string | number | boolean | null | undefined>
) {
  const cleanedQuery = cleanObject(queryObj);
  const queryString = Object.keys(cleanedQuery)
    .map((key) => `${key}=${cleanedQuery[key]}`)
    .join("&");
  return queryString;
}

interface UseStudentResult {
  addStudent: (
    value: Student
  ) => Promise<SuccessRespObject<Student> | ErrorRespObject>;
  updateStudent: (
    value: Partial<Student>
  ) => Promise<SuccessRespObject<Student> | ErrorRespObject>;
  vaccinateStudent: (
    info: VaccineStudentFormSchema
  ) => Promise<SuccessRespObject<Student> | ErrorRespObject>;
  saving: boolean;
  students: Student[];
  total: number;
  loading: boolean;
  fetchStudents: ({
    limit,
    page,
    searchQueryObj,
  }: {
    page: number;
    limit: number;
    searchQueryObj: Record<
      string,
      string | number | boolean | null | undefined
    >;
  }) => Promise<void>;
  bulkUploadStudents: (
    file: File
  ) => Promise<SuccessRespObject<Student> | ErrorRespObject>;
  bulkUploadVaccination: (
    file: File
  ) => Promise<ErrorRespObject | SuccessRespObject<Student>>;
  generateReport: (
    query: string
  ) => Promise<ErrorRespObject | ImportRecordStatusResp>;
}

const useStudentData = (): UseStudentResult => {
  const [students, setStudents] = useState<Student[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchStudents = React.useCallback(
    async ({
      limit,
      page,
      searchQueryObj,
    }: {
      page: number;
      limit: number;
      searchQueryObj: Record<
        string,
        string | number | boolean | null | undefined
      >;
    }) => {
      setLoading(true);
      const queryString = getQueryString(searchQueryObj);
      try {
        const offset = (page - 1) * limit;
        const response = await axios.get(
          `${portal_url}/school-vaccine-portal/student-management/vaccine-records/students?limit=${limit}&offset=${offset}&${queryString}`
        );
        setStudents(response.data.data ?? []);
        setTotal(response.data.total ?? 0);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const addStudent = React.useCallback(async (student: Student) => {
    setSaving(true);
    try {
      const response = await axios.post(
        `${portal_url}/school-vaccine-portal/student-management/students`,
        student,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data as SuccessRespObject<Student>;
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorRespObject>;
      if (!err.response?.data) {
        return unknownErrorResp;
      } else {
        return err.response.data as ErrorRespObject;
      }
    } finally {
      setSaving(false);
    }
  }, []);

  const updateStudent = React.useCallback(async (student: Partial<Student>) => {
    setSaving(true);
    try {
      const response = await axios.patch(
        `${portal_url}/school-vaccine-portal/student-management/students`,
        student,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data as SuccessRespObject<Student>;
    } catch (error) {
      const err = error as AxiosError<ErrorRespObject>;
      if (!err.response?.data) {
        return unknownErrorResp;
      } else {
        return err.response.data as ErrorRespObject;
      }
    } finally {
      setSaving(false);
    }
  }, []);

  const vaccinateStudent = React.useCallback(
    async (info: VaccineStudentFormSchema) => {
      setSaving(true);
      try {
        const response = await axios.post(
          `${portal_url}/school-vaccine-portal/student-management/vaccine-records`,
          info,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data as SuccessRespObject<Student>;
      } catch (error) {
        const err = error as AxiosError<ErrorRespObject>;
        if (!err.response?.data) {
          return unknownErrorResp;
        } else {
          return err.response.data as ErrorRespObject;
        }
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const bulkUploadStudents = React.useCallback(async (file: File) => {
    setSaving(true);
    const formData = new FormData();
    const headers = {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    };
    formData.append("file", file);

    formData.append("dataFile", file);
    try {
      const response = await axios.post(
        `${portal_url}/school-vaccine-portal/bulk-upload/students`,
        formData,
        {
          headers,
        }
      );
      return response.data as SuccessRespObject<Student>;
    } catch (error) {
      const err = error as AxiosError<ErrorRespObject>;
      if (!err.response?.data) {
        return unknownErrorResp;
      } else {
        return err.response.data as ErrorRespObject;
      }
    } finally {
      setSaving(false);
    }
  }, []);

  const bulkUploadVaccination = React.useCallback(async (file: File) => {
    setSaving(true);
    const formData = new FormData();
    const headers = {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    };
    formData.append("file", file);

    formData.append("dataFile", file);
    try {
      const response = await axios.post(
        `${portal_url}/school-vaccine-portal/bulk-upload/vaccine-records`,
        formData,
        {
          headers,
        }
      );
      return response.data as SuccessRespObject<Student>;
    } catch (error) {
      const err = error as AxiosError<ErrorRespObject>;
      if (!err.response?.data) {
        return unknownErrorResp;
      } else {
        return err.response.data as ErrorRespObject;
      }
    } finally {
      setSaving(false);
    }
  }, []);

  const generateReport = React.useCallback(async (query: string) => {
    setSaving(true);
    const headers = {
      Accept: "application/json",
    };
    try {
      const response = await axios.get(
        `${portal_url}/school-vaccine-portal/student-management/vaccine-records/genrate-report?${query}`,
        {
          headers,
        }
      );
      return response.data as ImportRecordStatusResp;
    } catch (error) {
      const err = error as AxiosError<ErrorRespObject>;
      if (!err.response?.data) {
        return unknownErrorResp;
      } else {
        return err.response.data as ErrorRespObject;
      }
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    addStudent,
    updateStudent,
    saving,
    students,
    total,
    loading,
    fetchStudents,
    bulkUploadStudents,
    vaccinateStudent,
    bulkUploadVaccination,
    generateReport,
  };
};

export default useStudentData;
