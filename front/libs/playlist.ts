export interface Playlist {
  _id: string;
  name: string;
  created_by: string;
  invited: string[];
  users: {
    id: string;
    username: string;
  }[];
  musics: {
    trackId: string;
    duration?: string;
  }[];
  type: 'public' | 'private';
  onlyInvited: boolean;
}
