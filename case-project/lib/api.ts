export async function GetMessages(roomId: string) {
    const response = await fetch(`/api/rooms/${roomId}/messages`, {
        credentials: 'include',
    });

    return response;
}