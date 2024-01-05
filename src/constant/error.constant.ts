class Error {
  errorCode: number;
  message: string;
  constructor(errorCode: number, message: string) {
    this.errorCode = errorCode;
    this.message = message;
  }
}

export const USER_NOT_FOUND = new Error(10000, 'User not found');
export const USERNAME_ALREADY_USED = new Error(10001, 'Username already used');
export const WRONG_USERNAME_OR_PASSWORD = new Error(
  10002,
  'Wrong username or password',
);
export const ZONE_NOT_FOUND = new Error(10003, 'Zone not found');
