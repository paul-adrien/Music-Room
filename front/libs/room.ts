export interface Room {
  name: string;
  created_by: string;
  invited: string[];
  users: {
    id: string;
    username: string;
    deviceId: string;
  }[];
  musics: {
    trackId: string;
    duration: string;
    nb_vote: number;
    vote: string[];
  }[];
  progress_ms: number;
  type: 'public' | 'private';
}
