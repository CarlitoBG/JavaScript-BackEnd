import { createAction, props } from '@ngrx/store';
import { actionType } from '../../../shared/action-type';
import { IUser } from '../../../../app/shared/interfaces/user';

export const loadUsers = createAction(
  actionType('[USER LIST] Load Users')
);
export const loadUsersSuccess = createAction(
  actionType('[USER LIST] Load Users Success'),
  (users: IUser[]) => ({ payload: { users } })
);
export const loadUsersFailure = createAction(
  actionType('[USER LIST] Load Users Failure'),
  (error: Error) => ({ payload: { error } })
);
