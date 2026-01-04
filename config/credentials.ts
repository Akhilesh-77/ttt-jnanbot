
/**
 * TTT JNAN Credentials Configuration
 * Admin can manage allowed IDs and passwords here.
 */

export interface UserCredential {
  usernames: string[]; // Supports multiple usernames for one password (e.g. ID and Phone)
  password: string;
}

export const AUTHORIZED_USERS: UserCredential[] = [
  {
    usernames: ["TTT-DCET-A-26-062 Akhilesh U", "6363027032"], // Example: Admin ID and Phone
    password: "153406"
  },
  {
    usernames: ["ttt001", "1234567890"], // Example: Student ID and Phone
    password: "tttpassword"
  }
];

/**
 * Validates provided credentials against the authorized list.
 */
export const validateCredentials = (username: string, password: string): boolean => {
  const normalizedUser = username.trim().toLowerCase();
  const normalizedPass = password.trim();

  return AUTHORIZED_USERS.some(user => 
    user.usernames.map(u => u.toLowerCase()).includes(normalizedUser) && 
    user.password === normalizedPass
  );
};
