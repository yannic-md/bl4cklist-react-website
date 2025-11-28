export interface Member {
    username: string;
    display_name: string;
    rank: 'LEITUNG' | 'ADMIN' | 'SENIOR' | 'ENTWICKLER' | 'MODERATOR' | 'HELFER' | 'BIRTHDAY';
    user_id: string;
    avatar_url: string;

    /* Optional fields */
    social_media_1?: string; // URL
    social_media_2?: string; // URL
}