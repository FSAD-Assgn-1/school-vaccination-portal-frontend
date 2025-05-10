import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import {
  ErrorRespObject,
  SuccessRespObject,
  unknownErrorResp,
  VaccineDriveInfo,
} from "../utils/types";
import React from "react";
import { portal_url } from "../utils/api";

interface UseDashboardDataResult {
  data: VaccineDriveInfo[];
  loading: boolean;
  error: string | null;
  addVaccinationDrive: (
    drive: VaccineDriveInfo
  ) => Promise<SuccessRespObject<VaccineDriveInfo> | ErrorRespObject>;
  EditVaccinationDrive: (
    drive: Partial<VaccineDriveInfo>
  ) => Promise<SuccessRespObject<VaccineDriveInfo> | ErrorRespObject>;
  saving: boolean;
  fetchVaccinationDriveData: () => Promise<void>;
}

const useVaccinationDriveData = (): UseDashboardDataResult => {
  const [data, setData] = useState<VaccineDriveInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  const addVaccinationDrive = React.useCallback(
    async (drive: VaccineDriveInfo) => {
      setSaving(true);
      try {
        const response = await axios.post(
          `${portal_url}/school-vaccine-portal/vaccine-inventory/drives`,
          drive,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data as SuccessRespObject<VaccineDriveInfo>;
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

  const EditVaccinationDrive = React.useCallback(
    async (drive: Partial<VaccineDriveInfo>) => {
      setSaving(true);
      try {
        const response = await axios.patch(
          `${portal_url}/school-vaccine-portal/vaccine-inventory/drives`,
          drive,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        return response.data as SuccessRespObject<VaccineDriveInfo>;
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

  const fetchVaccinationDriveData = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${portal_url}/school-vaccine-portal/vaccine-inventory/drives`
      );
      console.log("data:", response.data);

      setData(
        Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data]
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVaccinationDriveData();
  }, [fetchVaccinationDriveData]);

  return {
    data,
    loading,
    error,
    addVaccinationDrive,
    EditVaccinationDrive,
    saving,
    fetchVaccinationDriveData,
  };
};

export default useVaccinationDriveData;
