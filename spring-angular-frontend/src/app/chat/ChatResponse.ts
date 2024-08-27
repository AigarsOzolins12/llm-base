export interface ChatResponse {
    author: string,
    responseMessages: string[],
    iconUrl?: string,
    allowedRegeneration: boolean,
    allowedEdit: boolean
}