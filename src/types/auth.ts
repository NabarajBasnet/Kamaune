export interface dataProps {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: {
    email: string;
    tokens: {
      access: string;
      refresh: string;
    };
  };
}
