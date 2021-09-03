export interface User {
  userName: string;
  email: string;
  lastName: string;
  firstName: string;
  password: string;
  id: string;
  picture: string;
  rand: number;
  validEmail: boolean;
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
