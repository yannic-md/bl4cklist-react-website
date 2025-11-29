export interface Member {
    username: string;
    display_name: string;
    rank: 'LEITUNG' | 'ADMIN' | 'SENIOR' | 'ENTWICKLER' | 'MODERATOR' | 'HELFER' | 'BIRTHDAY' | 'REKRUT' | 'BOOSTER' |
          'SPONSOR' | 'LVL5' | 'LVL10' | 'LVL15' | 'LVL20' | 'LVL30' | 'LVL40' | 'LVL50' | 'LVL75' | 'LVL100' | 'LVL125';
    user_id: string;
    avatar_url: string;

    /* Optional fields */
    social_media_1?: string; // URL
    social_media_2?: string; // URL
}