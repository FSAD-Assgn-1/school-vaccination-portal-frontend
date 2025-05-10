import { useState, useEffect } from "react";
import axios from "axios";
import { portal_url } from "../utils/urls";

interface StduentDashboardData {
  total_students: number;
  vaccinated_students: number;
}

interface UseDashboardDataResult {
  dashboardData: StduentDashboardData | null;
  loading: boolean;
  error: string | null;
}

const useStudentDashboardData = (): UseDashboardDataResult => {
  const [dashboardData, setData] = useState<StduentDashboardData>({
    total_students: 0,
    vaccinated_students: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${portal_url}/school-vaccine-portal/student-management/vaccine-records/dashboard`
        );
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { dashboardData, loading, error };
};

export default useStudentDashboardData;
