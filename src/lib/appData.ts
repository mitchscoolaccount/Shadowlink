// Static content for this build - no database, no auth, no network calls
// anywhere in this project. Every value below is fixed at build time.

export const CURRENT_USER = {
  nickname: "Mitch",
  role: "owner" as const,
  avatarUrl: null as string | null,
};

export const CREDIT_BALANCE = 4250;

export interface RoomMessage {
  id: number;
  sender: string;
  text: string;
  time: string;
  color: string;
}

export const INITIAL_MESSAGES: RoomMessage[] = [
  { id: 1, sender: "Nova", text: "morning everyone", time: "9:02 AM", color: "#f472b6" },
  { id: 2, sender: "Rook", text: "anyone catch the stream last night?", time: "9:04 AM", color: "#facc15" },
  { id: 3, sender: "Echo", text: "yeah it was pretty good, missed the ending though", time: "9:05 AM", color: "#4ade80" },
  { id: 4, sender: "Mitch", text: "clip's up in #streams if you want to watch it back", time: "9:07 AM", color: "#00f0ff" },
  { id: 5, sender: "Vale", text: "nice, thanks", time: "9:07 AM", color: "#a78bfa" },
];

export interface DirectoryUser {
  nickname: string;
  role: "user" | "admin" | "owner";
  online: boolean;
  credits: number;
  subscribers: number;
}

export const DIRECTORY_USERS: DirectoryUser[] = [
  { nickname: "Mitch", role: "owner", online: true, credits: 4250, subscribers: 128 },
  { nickname: "Rook", role: "admin", online: true, credits: 1875, subscribers: 42 },
  { nickname: "Nova", role: "user", online: true, credits: 960, subscribers: 15 },
  { nickname: "Echo", role: "user", online: false, credits: 540, subscribers: 6 },
  { nickname: "Vale", role: "user", online: false, credits: 210, subscribers: 2 },
  { nickname: "Zed", role: "user", online: true, credits: 75, subscribers: 0 },
];

export interface LiveStream {
  nickname: string;
  title: string;
  viaScreen: boolean;
  duration: string;
}

export const LIVE_STREAMS: LiveStream[] = [
  { nickname: "Rook", title: "ranked grind, chill vibes", viaScreen: true, duration: "1:24:10" },
  { nickname: "Nova", title: "just chatting", viaScreen: false, duration: "0:38:52" },
  { nickname: "Zed", title: "late night coding stream", viaScreen: true, duration: "2:05:41" },
];
