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

export const nav_items: NavigationItem[] = [
  {
    title: "Start",
    href: "/",
    dropdownTitle: "Startseite",
    items: [
      {
        title: "Über Uns",
        description: "Was ist eigentlich Bl4cklist?",
        href: "/#discord-server-features",
        icon: "/images/icons/small/pin-24w.webp"
      },
      {
        title: "Server-Team",
        description: "Lerne unser süßes Team kennen!",
        href: "/#discord-server-team",
        icon: "/images/icons/small/police-24w.webp"
      },
      {
        title: "Unsere Geschichte",
        description: "So hat alles bei uns angefangen..",
        href: "/#discord-server-history",
        icon: "/images/icons/small/scroll-24w.webp"
      },
      {
        title: "Unsere Discord-Hilfe",
        description: "Finde hier viele nützliche Anleitungen!",
        href: "https://discord.bl4cklist.de",
        icon: "/images/icons/small/discord-24w.webp",
        isExternal: true
      },
      {
        title: "Entsperrung beantragen",
        description: "Hier erhältst du wieder Zugriff.",
        href: "/discord-server-unban",
        icon: "/images/icons/small/stop-24w.webp",
        isExternal: true
      }
    ]
  },
  {
    title: "Tech-& Coding",
    href: "/discord/tech-coding",
    dropdownTitle: "Technik & Programmieren",
    items: [
      {
        title: "Programmiere mit Uns",
        description: "Lerne moderne Software-Entwicklung!",
        href: "/discord/tech-coding/#bots",
        icon: "/images/icons/small/code-24w.webp"
      },
      {
        title: "Unsere Technik-Features",
        description: "Erfahre was wir tun, um dir zu helfen!",
        href: "/discord/tech-coding/#features",
        icon: "/images/icons/small/star-24w.webp"
      },
      {
        title: "Häufig gestellte Fragen",
        description: "Wir haben für alles eine Antwort!",
        href: "/discord/tech-coding/#faq",
        icon: "/images/icons/small/question-24w.webp"
      },
      {
        title: "Eigene Server",
        description: "Für Bots, Gameserver & mehr..",
        href: "https://bl4cklist.de/go/dsh",
        icon: "/images/icons/small/server-24w.webp",
        isExternal: true
      }
    ]
  },
  {
    title: "Community",
    href: "/discord/community",
    dropdownTitle: "Unsere Discord-Community",
    items: [
      {
        title: "Lerne uns kennen",
        description: "Wir beißen nicht.. versprochen!",
        href: "/discord/community/#intro",
        icon: "/images/icons/small/discord-heart-24w.webp"
      },
      {
        title: "Heutige Geburtstage",
        description: "Wer ist heute das Geburtstagskind?!",
        href: "/discord/community/#birthdays",
        icon: "/images/icons/small/cake-24w.webp"
      },
      {
        title: "Ehrenhafte Mitglieder",
        description: "Sie haben einzigartige Ziele erreicht!",
        href: "/discord/community/#leaders",
        icon: "/images/icons/small/fire-24w.webp"
      },
      {
        title: "Aktivste Mitglieder",
        description: "Starke Aktivität.. wird belohnt!",
        href: "/discord/community/#levels",
        icon: "/images/icons/small/trophy-24w.webp"
      },
      {
        title: "Ehemalige Teammitglieder",
        description: "Ohne sie wäre lange Chaos gewesen..",
        href: "/discord/community/#staff",
        icon: "/images/icons/small/grandpa-24w.webp"
      }
    ]
  },
  {
    title: "Clank-Bot",
    href: "/discord/clank-bot",
    dropdownTitle: "Clank Discord-Bot",
    items: [
      {
        title: "Gewinnspiel-System",
        description: "Starte & verwalte eigene Gewinnspiele!",
        href: "/discord/clank-bot/#giveaways",
        icon: "/images/icons/small/gift-24w.webp"
      },
      {
        title: "Support-Tickets",
        description: "Bearbeite Anfragen deiner Community!",
        href: "/discord/clank-bot/#ticket-tool",
        icon: "/images/icons/small/support-24w.webp"
      },
      {
        title: "Server-Schutz",
        description: "Vollautomatisch & mit Leichtigkeit.",
        href: "/discord/clank-bot/#security",
        icon: "/images/icons/small/alarm-24w.webp"
      },
      {
        title: "Serverweiter Global-Chat",
        description: "Chatte mit Usern von anderen Servern!",
        href: "/discord/clank-bot/#globla-chat",
        icon: "/images/icons/small/earth-24w.webp"
      },
      {
        title: "Zum Dashboard",
        description: "Verwalte den Bot viel einfacher..",
        href: "https://clank.dev",
        icon: "/images/icons/small/robot-24w.webp",
        isExternal: true
      }
    ]
  }
];