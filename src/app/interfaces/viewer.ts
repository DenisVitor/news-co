export interface Viewer {
  id: string;
  email: string;
  username: string;
  avatar?: string | undefined | null;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enable: boolean;
  roles: string[];
  admin: boolean;
  authorities: { authority: string }[];
}

export interface ViewerRegister {
  email: string;
  username: string;
  password: string;
}

export interface ViewerLogin {
  username: string;
  password: string;
}

export interface Token {
  token: string;
}
