export type MockUser = {
  id: number;
  user_name: string;
  email: string;
  password: string;
  gender: string;
  phone: string;
  ip_address: string;
  profile_image: string;
  use_yn: boolean;
  regist_datetime: string;
};

let cachedUsers: MockUser[] | null = null;
let inflight: Promise<MockUser[]> | null = null;

export async function fetchMockUsers(signal?: AbortSignal) {
  if (cachedUsers) return cachedUsers;
  if (inflight) return inflight;

  inflight = fetch("/data/MOCK_DATA.json", { signal })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load mock data");
      }
      return response.json() as Promise<MockUser[]>;
    })
    .then((data) => {
      cachedUsers = data;
      inflight = null;
      return data;
    })
    .catch((error) => {
      inflight = null;
      throw error;
    });

  return inflight;
}
