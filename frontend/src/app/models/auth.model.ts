export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  nombreCompleto: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  nombreCompleto: string;
  email: string;
  rol: string;
}

export interface UsuarioInfo {
  id?: number;
  username: string;
  nombreCompleto: string;
  email?: string;
  rol: string;
}
