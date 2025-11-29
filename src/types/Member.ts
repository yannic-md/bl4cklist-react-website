export interface Member {
    username: string;
    display_name: string;
    rank: 'LEITUNG' | 'ADMIN' | 'SENIOR' | 'ENTWICKLER' | 'MODERATOR' | 'HELFER' | 'BIRTHDAY' | 'REKRUT' | 'BOOSTER' |
          'SPONSOR' | 'LVL50' | 'LVL75' | 'LVL100' | 'LVL125' | 'EHEM_MOD' | 'EHEM_ADMIN' | 'EHEM_SENIOR' | 'EHEM_LEITUNG';
    user_id: string;
    avatar_url: string;

    /* Optional fields */
    staff_duration?: string; // 2025 - 6mo (Start-Date & Duration)
    social_media_1?: string; // URL
    social_media_2?: string; // URL
}