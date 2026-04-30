import Role from './role';

class Permissions {
  private roleService: Role;

  constructor(roleService?: Role) {
    this.roleService = roleService || new Role();
  }

  getPermissionsByRoleName(roleName: string): string[] {
    const role = this.roleService.getRoleByName(roleName);
    return role?.permissions ?? [];
  }
}

export default Permissions;
