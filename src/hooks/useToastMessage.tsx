import { toast } from "react-toastify";

interface UseToastMessage {
  toastSuccess: (message: string, title?: string) => void;
  toastError: (message: string, title?: string) => void;
}

const useToastMessage = (): UseToastMessage => {
  const toastSuccess = (message: string) => {
    toast(message, {
      type: "success",
    });
  };

  const toastError = (message: string) => {
    toast(message, {
      type: "error",
    });
  };

  return { toastSuccess, toastError };
};

export default useToastMessage;
