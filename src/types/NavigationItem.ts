export interface DropdownItem {
  title: string;
  description: string;
  href: string;
  icon: string;
  isExternal?: boolean;
}

export interface NavigationItem {
  title: string;
  href: string;
  dropdownTitle: string;
  items: DropdownItem[];
}

/**
 * Generates navigation items with translations.
 * 
 * @param t - Translation function for navigation titles
 * @param tDropdown - Translation function for dropdown content
 * @returns Array of NavigationItem objects with translated content
 */
export function getNavItems(t: (key: string) => string, tDropdown: (key: string) => string): NavigationItem[] {
  return [
    {
      title: t('start'),
      href: "/#discord-server-start",
      dropdownTitle: tDropdown('homepage'),
      items: [
        {
          title: tDropdown('aboutUs'),
          description: tDropdown('aboutUsDesc'),
          href: "/#discord-server-features",
          icon: "/images/icons/small/pin-24w.webp"
        },
        {
          title: tDropdown('serverTeam'),
          description: tDropdown('serverTeamDesc'),
          href: "/#discord-server-team",
          icon: "/images/icons/small/police-24w.webp"
        },
        {
          title: tDropdown('ourHistory'),
          description: tDropdown('ourHistoryDesc'),
          href: "/#discord-server-history",
          icon: "/images/icons/small/scroll-24w.webp"
        },
        {
          title: tDropdown('discordHelp'),
          description: tDropdown('discordHelpDesc'),
          href: "https://discord.bl4cklist.de",
          icon: "/images/icons/small/discord-24w.webp",
          isExternal: true
        },
        {
          title: tDropdown('requestUnban'),
          description: tDropdown('requestUnbanDesc'),
          href: "/contact",
          icon: "/images/icons/small/stop-24w.webp",
          isExternal: true
        }
      ]
    },
    {
      title: t('techCoding'),
      href: "/discord/tech-coding",
      dropdownTitle: tDropdown('techAndProgramming'),
      items: [
        {
          title: tDropdown('programmingWithUs'),
          description: tDropdown('programmingWithUsDesc'),
          href: "/discord/tech-coding/#bots",
          icon: "/images/icons/small/code-24w.webp"
        },
        {
          title: tDropdown('techFeatures'),
          description: tDropdown('techFeaturesDesc'),
          href: "/discord/tech-coding/#features",
          icon: "/images/icons/small/star-24w.webp"
        },
        {
          title: tDropdown('faq'),
          description: tDropdown('faqDesc'),
          href: "/discord/tech-coding/#faq",
          icon: "/images/icons/small/question-24w.webp"
        },
        {
          title: tDropdown('ownServers'),
          description: tDropdown('ownServersDesc'),
          href: "https://bl4cklist.de/go/dsh",
          icon: "/images/icons/small/server-24w.webp",
          isExternal: true
        }
      ]
    },
    {
      title: t('community'),
      href: "/discord/community",
      dropdownTitle: tDropdown('discordCommunity'),
      items: [
        {
          title: tDropdown('getToKnowUs'),
          description: tDropdown('getToKnowUsDesc'),
          href: "/discord/community/#intro",
          icon: "/images/icons/small/discord-heart-24w.webp"
        },
        {
          title: tDropdown('todaysBirthdays'),
          description: tDropdown('todaysBirthdaysDesc'),
          href: "/discord/community/#birthdays",
          icon: "/images/icons/small/cake-24w.webp"
        },
        {
          title: tDropdown('honorableMembers'),
          description: tDropdown('honorableMembersDesc'),
          href: "/discord/community/#leaders",
          icon: "/images/icons/small/fire-24w.webp"
        },
        {
          title: tDropdown('mostActiveMembers'),
          description: tDropdown('mostActiveMembersDesc'),
          href: "/discord/community/#levels",
          icon: "/images/icons/small/trophy-24w.webp"
        },
        {
          title: tDropdown('formerTeamMembers'),
          description: tDropdown('formerTeamMembersDesc'),
          href: "/discord/community/#staff",
          icon: "/images/icons/small/grandpa-24w.webp"
        }
      ]
    },
    {
      title: t('clankBot'),
      href: "/discord/clank-bot",
      dropdownTitle: tDropdown('clankDiscordBot'),
      items: [
        {
          title: tDropdown('supportTickets'),
          description: tDropdown('supportTicketsDesc'),
          href: "/discord/clank-bot/#ticket-tool",
          icon: "/images/icons/small/support-24w.webp"
        },
        {
          title: tDropdown('giveawaySystem'),
          description: tDropdown('giveawaySystemDesc'),
          href: "/discord/clank-bot/#giveaways",
          icon: "/images/icons/small/gift-24w.webp"
        },
        {
          title: tDropdown('serverProtection'),
          description: tDropdown('serverProtectionDesc'),
          href: "/discord/clank-bot/#security",
          icon: "/images/icons/small/alarm-24w.webp"
        },
        {
          title: tDropdown('globalChat'),
          description: tDropdown('globalChatDesc'),
          href: "/discord/clank-bot/#global-chat",
          icon: "/images/icons/small/earth-24w.webp"
        },
        {
          title: tDropdown('toDashboard'),
          description: tDropdown('toDashboardDesc'),
          href: "https://clank.dev",
          icon: "/images/icons/small/robot-24w.webp",
          isExternal: true
        }
      ]
    }
  ];
}