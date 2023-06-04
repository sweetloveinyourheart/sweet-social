export class ChatboxPayload {
    chatboxId: string
}

export class MessagePayload extends ChatboxPayload {
    content: string
}