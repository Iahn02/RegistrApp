import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';

import { authGuard } from './auth.guard';
// Importante Corregir e implementar el guardia de forma correcta
describe('authGuard', () => {
  let guard: authGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(authGuard);
  });

  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => guard.canActivate(...guardParameters));

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
