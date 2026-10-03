export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
};

export const sendSuccess = <T>(message: string, data?: T): ApiResponse<T> => ({
  success: true,
  message,
  data
});

export const sendError = (message: string, errors: string[] = []): ApiResponse<null> => ({
  success: false,
  message,
  errors
});
