export class UserRoomsViewModel {
    roomId: string;
    avatarUrl?: string;
    name: string;
    lastMessage?: {
        userId?: string,
        text?: string
    };
    membersCount: number;
    isPinned?: boolean;
    isMuted?: boolean;
}