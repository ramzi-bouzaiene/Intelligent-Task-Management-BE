import rolesData from '../../config/roles.json';

export type RoleType = {
  name: string;
  permissions?: string[];
};

class Role {
  private roles: RoleType[];

  constructor() {
    this.roles = rolesData.roles;
  }

  getRoleByName(name: string): RoleType | undefined {
    return this.roles.find((role) => role.name === name);
  }

  getRoles(): RoleType[] {
    return this.roles;
  }
}

export default Role;
