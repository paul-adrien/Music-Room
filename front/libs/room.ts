export interface Room {
  name: string;
  created_by: string;
  users: {
    id: string;
    username: string;
    right: boolean;
  }[];
  musics: {
    trackId: string;
    duration: string;
  }[];
  type: boolean;
  right: boolean;
  style: string;
}
