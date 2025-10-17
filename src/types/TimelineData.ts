export interface TimelineData {
    date: string;
    title: string;
    description: string;
    logoSrc?: string;
    logoAlt?: string;
    bgSrc?: string;
    bgRotation?: 'left' | 'right';
    bgAlt?: string;
}

export const timeline: TimelineData[] = [


    // 🚨 /\ ADD NEW ITEMS ABOVE THIS LINE (AT THE TOP OF THE VARIABLE) /\ 🚨
    {
        date: 'ITEM_1_DATE',
        title: 'ITEM_1_TITLE',
        description: 'ITEM_1_DESC',
    },
    {
        date: 'ITEM_2_DATE',
        title: 'ITEM_2_TITLE',
        description: 'ITEM_2_DESC',
    },
    {
        date: 'ITEM_3_DATE',
        title: 'ITEM_3_TITLE',
        description: 'ITEM_3_DESC',
    },
    {
        date: 'ITEM_4_DATE',
        title: 'ITEM_4_TITLE',
        description: 'ITEM_4_DESC',
        logoSrc: '/images/brand/logo-96w.webp',
        logoAlt: 'Main Logo ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server',
        bgSrc: '/images/bg/jupiter-128w.webp',
        bgRotation: 'right',
        bgAlt: 'Jupiter Deco ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server'
    },
    {
        date: 'ITEM_5_DATE',
        title: 'ITEM_5_TITLE',
        description: 'ITEM_5_DESC',
    },
    {
        date: 'ITEM_6_DATE',
        title: 'ITEM_6_TITLE',
        description: 'ITEM_6_DESC',
    },
    {
        date: 'ITEM_7_DATE',
        title: 'ITEM_7_TITLE',
        description: 'ITEM_7_DESC',
    },
    {
        date: 'ITEM_8_DATE',
        title: 'ITEM_8_TITLE',
        description: 'ITEM_8_DESC',
        logoSrc: '/images/brand/old/third_logo-96w.webp',
        logoAlt: 'Third Logo ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server'
    },
    {
        date: 'ITEM_9_DATE',
        title: 'ITEM_9_TITLE',
        description: 'ITEM_9_DESC',
        bgSrc: '/images/bg/uranus-128w.webp',
        bgRotation: 'left',
        bgAlt: 'Uranus Deco ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server'
    },
    {
        date: 'ITEM_10_DATE',
        title: 'ITEM_10_TITLE',
        description: 'ITEM_10_DESC',
    },
    {
        date: 'ITEM_11_DATE',
        title: 'ITEM_11_TITLE',
        description: 'ITEM_11_DESC',
        logoSrc: '/images/brand/old/second_logo-96w.webp',
        logoAlt: 'Second Logo ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server'
    },
    {
        date: 'ITEM_12_DATE',
        title: 'ITEM_12_TITLE',
        description: 'ITEM_12_DESC',
    },
    {
        date: 'ITEM_13_DATE',
        title: 'ITEM_13_TITLE',
        description: 'ITEM_13_DESC',
        logoSrc: '/images/brand/old/first_logo-96w.webp',
        logoAlt: 'First Logo ~ Bl4cklist ~ Deutscher Gaming-& Tech Discord-Server'
    }
];
