export interface User {
  userName: string;
  email: string;
  lastName: string;
  firstName: string;
  password: string;
  google_account: { id: string; email: string };
  id: string;
  picture:
    | string
    | {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        buffer: ArrayBuffer;
        size: number;
      };
  rand: number;
  validEmail: boolean;
  devices: { name: string; userId: string }[];
  friends: { id: string }[];
  musicHistory: string[];
  notifs: {
    playlist: {
      name: string;
      id: string;
      right: boolean;
      date: string;
    }[];
    friends: {
      name: string;
      id: string;
      date: string;
    }[];
    rooms: {
      name: string;
      id: string;
      right: boolean;
      date: string;
    }[];
  };
  type: 'free' | 'premium';
}

export function mapUserBackToUserFront(user: any): Partial<User> {
  return {
    id: user['id'],
    userName: user['userName'],
    firstName: user['firstName'],
    lastName: user['lastName'],
    email: user['email'],
    picture: user['picture'],
    validEmail: user['validEmail'],
    type: user['type'],
  };
}
