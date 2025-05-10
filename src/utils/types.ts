export interface VaccineDriveInfo {
  id?: number;
  vaccine_name: string;
  drive_date: string;
  doses: number;
  classes: string;
  created_at?: string;
  updated_at?: string;
}

export type VaccineDriveFormSchema = Omit<VaccineDriveInfo, "classes"> & {
  classes: string[];
};

export interface Student {
  id?: number;
  name: string;
  class: string;
  gender: string;
  roll_no: string;
  phone_no: string;
  vaccination?: boolean;
  vaccine_name?: string;
  vaccine_date?: string;
}

export type StudentFormSchema = Omit<Student, "id"> & {
  id: number | null;
};

export type VaccineStudentFormSchema = {
  student_id: number | null;
  drive_id: number | null | undefined;
};

export interface ErrorRespObject {
  error_string: string;
  message_string: string;
}

export interface SuccessRespObject<T> {
  data: T;
  message_string: string;
}

export interface UploadedRecordReport {
  Id: number;
  file_name: string;
  file_path: string;
  status: string;
  error_message: string;
  created_at: string;
  updated_at: string;
  processed_records: number;
  total_records: number;
  request_id: string;
  request_Type: string;
}

export interface ImportRecordStatusResp {
  file: string;
}
