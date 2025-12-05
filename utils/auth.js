export function canAccessAdmin(role) {
    return role === 'super_admin';
  }
  
  export function canAccessTodos(isAuthenticated) {
    return !!isAuthenticated;
  }
  