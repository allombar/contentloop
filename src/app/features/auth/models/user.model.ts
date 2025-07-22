export interface LoginRequest {}

export interface RegisterRequest {}

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface UserData {
  token?: string;
  user: UserDto;
}
