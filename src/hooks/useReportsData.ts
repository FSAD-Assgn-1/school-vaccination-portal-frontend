import { useState, useEffect } from "react";
import axios from "axios";
import { portal_url } from "../utils/api";
import { UploadedRecordReport } from "../utils/types";
import React from "react";

interface UseReportsData {
  reports: UploadedRecordReport[];
  loading: boolean;
  error: string | null;
  total: number;
}

const limit = 5;

const useReportsData = (): UseReportsData => {
  const [reports, setReports] = useState<UploadedRecordReport[]>([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = React.useCallback(async (page: number) => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const response = await axios.get(
        `${portal_url}/school-vaccine-portal/bulk-upload?limit=${limit}&offset=${offset}`
      );
      setReports(response.data.data);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError("unkown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports(1);
  }, [fetchReports]);

  return { reports, loading, error, total };
};

export default useReportsData;
