export type UserRole = 'ADMIN' | 'ANALYST' | 'SYSTEM';
export type UserStatus = 'ACTIVE' | 'DISABLED';
export type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export interface UserProps {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export class User {
  private constructor(private props: UserProps) {}
  static create(input: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
  }): User {

    return new User({
      ...input,
      role: input.role ?? 'ANALYST',
      status: 'ACTIVE',
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
    });
  }

  static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  get id() {
    return this.props.id;
  }

  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get passwordHash() {
    return this.props.passwordHash;
  }

  get role() {
    return this.props.role;
  }

  get status() {
    return this.props.status;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  updateName(name: string) {
    this.props.name = name;
    this.touch();
  }

  changePassword(newHash: string) {
    this.props.passwordHash = newHash;
    this.touch();
  }

  changeRole(role: UserRole) {
    this.props.role = role;
    this.touch();
  }

  disable() {
    this.props.status = 'DISABLED';
    this.touch();
  }

  enable() {
    this.props.status = 'ACTIVE';
    this.touch();
  }

  isActive(): boolean {
    return this.props.status === 'ACTIVE';
  }

  isAdmin(): boolean {
    return this.props.role === 'ADMIN';
  }

  private touch() {
    this.props.updatedAt = new Date().toLocaleDateString();
  }

  toSafeObject(): SafeUser {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  toPersistence(): UserProps {
    return { ...this.props };
  }
}