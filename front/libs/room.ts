export interface Room {
  name: string;
  created_by: string;
  users: {
    id: string;
    username: string;
    right: boolean;
    deviceId: string;
  }[];
  musics: {
    trackId: string;
    duration: string;
    nb_vote: number;
    vote: string[];
  }[];
  type: boolean;
  right: boolean;
  style: string;
}
