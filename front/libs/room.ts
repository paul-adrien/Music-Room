export interface Room {
  _id: string;
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
  limits: {
    radius: number;
    center: {
      latitude: number;
      longitude: number;
    };
    start: string;
    end: string;
  };
}
