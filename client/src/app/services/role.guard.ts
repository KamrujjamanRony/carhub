import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const roleGuard = (requiredRole: string) => () => {
    const router = inject(Router);
  
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.role === requiredRole) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  };
  