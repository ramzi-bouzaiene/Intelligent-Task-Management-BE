export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: string;
  avatar?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  avatar?: string;
}

export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}