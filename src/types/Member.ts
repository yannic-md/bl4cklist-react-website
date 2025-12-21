export interface Member {
    user_name: string;
    user_display_name: string;
    rank: 'LEITUNG' | 'ADMIN' | 'SENIOR' | 'ENTWICKLER' | 'MODERATOR' | 'HELFER' | 'BIRTHDAY' | 'REKRUT' | 'BOOSTER' |
          'GHOST' | 'SPONSOR' | 'LVL50' | 'LVL75' | 'LVL100' | 'LVL125' | 'EHEM_MOD' | 'EHEM_ADMIN' |
          'EHEM_SENIOR' | 'EHEM_LEITUNG';
    user_id: string;
    user_avatar_url: string;

    /* Optional fields */
    staff_duration?: string; // total amount in seconds
    rank_color?: number;
    rank_color2?: number | null;
    social_media_url: string | null;
}

export const oldBots: Member[] = [
    {
        user_name: 'Bl4cklist👾Global#9054',
        user_display_name: 'Bl4cklist👾Global',
        rank: 'GHOST',
        user_id: '772156551019626556',
        social_media_url: null,
        user_avatar_url: '/images/brand/old/bots/bl4cklist-global-128w.webp'
    },
    {
        user_name: 'Bl4ck🚔Support#7717',
        user_display_name: 'Bl4ck🚔Support',
        rank: 'GHOST',
        user_id: '671421220566204446',
        social_media_url: null,
        user_avatar_url: '/images/brand/old/bots/bl4ck-support-128w.webp'
    },
    {
        user_name: 'Bl4cklist👾Global#9054',
        user_display_name: 'Bl4cklist👾Global',
        rank: 'GHOST',
        user_id: '772156551019626556',
        social_media_url: null,
        user_avatar_url: '/images/brand/old/bots/bl4cklist-global-128w.webp'
    },
    {
        user_name: 'Bl4ck🚨Security#0041',
        user_display_name: 'Bl4ck🚨Security',
        rank: 'GHOST',
        user_id: '772443703398629407',
        social_media_url: null,
        user_avatar_url: '/images/brand/old/bots/bl4ck-security-128w.webp'
    },
    {
        user_name: 'Bl4ck🎁Gift#5293',
        user_display_name: 'Bl4ck🎁Gift',
        rank: 'GHOST',
        user_id: '779707457294303272',
        social_media_url: null,
        user_avatar_url: '/images/brand/old/bots/bl4ck-gift-128w.webp'
    }
];