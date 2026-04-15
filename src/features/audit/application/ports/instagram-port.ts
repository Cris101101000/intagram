import { InstagramProfile, PostData } from '../../domain/interfaces/audit';

export interface FetchProfileResult {
  profile: InstagramProfile;
  posts: PostData[];
}

export interface InstagramPort {
  fetchProfile(username: string): Promise<FetchProfileResult>;
}
