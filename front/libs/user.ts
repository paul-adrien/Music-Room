export interface User {
  userName: string;
  email: string;
  lastName: string;
  firstName: string;
  password: string;
  id: string;
  picture: string | Blob;
  rand: number;
  validEmail: boolean;
  devices: { id: string; name: string; userId: string }[];
  friends: { id: string }[];
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
  };
}
