export interface Member {
    user_name: string;
    user_display_name: string;
    rank: 'LEITUNG' | 'ADMIN' | 'SENIOR' | 'ENTWICKLER' | 'MODERATOR' | 'HELFER' | 'BIRTHDAY' | 'REKRUT' | 'BOOSTER' |
          'SPONSOR' | 'LVL50' | 'LVL75' | 'LVL100' | 'LVL125' | 'EHEM_MOD' | 'EHEM_ADMIN' | 'EHEM_SENIOR' | 'EHEM_LEITUNG';
    user_id: string;
    user_avatar_url: string;

    /* Optional fields */
    staff_duration?: string; // 2025 - 6mo (Start-Date & Duration)
    rank_color?: number;
    rank_color2?: number | null;
    social_media_url: string | null;
}