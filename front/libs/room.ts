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
  track_playing: string;
  type: 'public' | 'private';
  onlyInvited: boolean;
  limits?: {
    radius: number;
    center: {
      latitude: number;
      longitude: number;
    };
    start: string;
    end: string;
  };
}
