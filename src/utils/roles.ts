export type UserRole = 'admin' | 'manager' | 'others' | string // others can be dynamic

export const hasPermission = (role: UserRole, action: string): boolean => {
  const permissions: Record<UserRole, string[]> = {
    admin: [
      'create_role', 'read_roles', 'update_role', 'delete_role',
      'read_users', 'delete_user',
      'create_task', 'read_tasks', 'read_one_task', 'update_task', 'delete_task'
    ],
    manager: [
      'read_roles',
      'read_users', 'delete_user',
      'create_task', 'read_tasks', 'read_one_task', 'update_task', 'delete_task'
    ],
    others: [
      'read_roles',
      'read_users',
      'create_task', 'read_tasks', 'read_one_task', 'update_task', 'delete_task'
    ]
  }

  // default for other roles
//   if (!permissions[role]) {
//     permissions[role] = [
//       'create_task', 'read_task', 'read_one_task', 'update_task', 'delete_task'
//     ]
//   }

  return permissions[role]?.includes(action) || false
}

export const listOfActions = (role: UserRole): string => {
  const actions: Record<UserRole, string[]> = {
    admin: [
      'create_role', 'read_role', 'update_role', 'delete_role',
      'view_users', 'delete_user',
      'create_task', 'read_task', 'read_one_task', 'update_task', 'delete_task'
    ],
    manager: [
      'read_role',
      'view_users', 'delete_user',
      'create_task', 'read_task', 'read_one_task', 'update_task', 'delete_task'
    ],
    others: [
      'read_role',
      'view_users',
      'create_task', 'read_task', 'read_one_task', 'update_task', 'delete_task'
    ]
  }

  return actions[role]?.join(', ') || 'No actions available for this role'
}
