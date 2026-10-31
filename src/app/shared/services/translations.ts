export type Lang = 'de' | 'en';

export const TRANSLATIONS = {
    en: {
        nav: {
            whyMe: 'Why Me?',
            skills: 'Skills',
            projects: 'Projects',
            contact: 'Contact',
        },
        hero: {
            job: 'SOFTWARE DEVELOPER',
            contactBtn: 'CONTACT ME',
        },
        whyMe: {
            headline: 'Why me',
            about: "Programming means turning ideas into something real. Early experiments grew into a passion for software development. I enjoy exploring technologies, solving problems and learning through my own projects – from interfaces to APIs and databases.",
            iAm: 'I am',
            located: 'located in Hachenburg',
            relocateLine1: 'open to',
            relocateLine2: 'relocate',
            remote: 'open to work remote',
            letsTalk: 'Let’s talk',
        },
        skills: {
            headline: 'My Skills',
            ctaText: 'I am always happy to learn new technologies, just tell me what you need.',
            letsTalk: 'Let’s talk',
        },
        projects: {
            headline: 'My Projects',
            joinDescription: 'Task manager inspired by the Kanban System. Create and organize tasks using drag and drop functions, assign users and categories.',
            sharkieDescription: 'Jump, run and swim game based on an object-oriented approach. Help Sharkie to find coins and poison bottles to fight against the killer whale.',
            polloLocoDescription: 'Jump, run and fight against the Crazy Main Chicken and his little Army of Chickens. For every Kill or Hit to the Main Chicken, you will earn Coins where you can buy Salsa Bottles as Ammunition to Use as Weapons.',
        },
        references: {
            headline: 'Need a teamplayer? Here’s what my colleagues say about me',
            project: 'Project',
            quote1: '‘’Asbjörn had to develop, format and deliver content in collaboration with the team members. He is a reliable and friendly person.’’',
            quote2: '‘’He is a trustworthy teamplayer and can cope with the stress of deadlines. Structured work and clear code.‘’',
            quote3: '‘’He is a reliable and friendly person. Works in a structured way and writes clear code. I recommend him as a colleague.’’',
        },
        contact: {
            headline: 'Contact me',
            intro: 'Encourage people to contact you and describe what role you are interested in. Express interest in contributing to a new project.',
            emailLabel: 'E-mail: ',
            telLabel: 'Tel: ',
            namePlaceholder: 'Your Name',
            emailPlaceholder: 'Your Email',
            messagePlaceholder: 'Your Message',
            nameError: 'Please enter a Name',
            emailError: 'Please enter a valid email address.',
            messageError: 'You cannot send an empty mail.',
            send: 'Send',
        },
        footer: {
            legalNotice: 'Legal notice',
            privacyPolicy: 'privacy policy',
        },
    },
    de: {
        nav: {
            whyMe: 'Warum ich?',
            skills: 'Skills',
            projects: 'Projekte',
            contact: 'Kontakt',
        },
        hero: {
            job: 'SOFTWARE DEVELOPER',
            contactBtn: 'KONTAKT',
        },
        whyMe: {
            headline: 'Warum ich',
            about: 'Programmieren heißt für mich, Ideen greifbar zu machen. Aus ersten Experimenten wurde eine echte Begeisterung für Softwareentwicklung. Ich probiere Technologien aus, tüftle an Lösungen und lerne durch eigene Projekte – vom Interface bis zu APIs und Datenbanken.',
            iAm: 'Ich bin',
            located: 'wohnhaft in Hachenburg',
            relocateLine1: 'bereit für',
            relocateLine2: 'einen Umzug',
            remote: 'offen für Remote-Arbeit',
            letsTalk: 'Schreib mir',
        },
        skills: {
            headline: 'Meine Skills',
            ctaText: 'Ich lerne immer gerne neue Technologien – sag mir einfach, was du brauchst.',
            letsTalk: 'Schreib mir',
        },
        projects: {
            headline: 'Meine Projekte',
            joinDescription: 'Task-Manager nach dem Kanban-System. Erstelle und organisiere Aufgaben per Drag-and-drop, weise Nutzer und Kategorien zu.',
            sharkieDescription: 'Jump-, Run- und Schwimm-Spiel auf Basis eines objektorientierten Ansatzes. Hilf Sharkie, Münzen und Giftflaschen zu finden, um gegen den Killerwal zu bestehen.',
            polloLocoDescription: 'Renne, springe und kämpfe gegen das verrückte Oberhuhn und seine kleine Hühner-Armee. Für jeden Treffer verdienst du Münzen, mit denen du Salsa-Flaschen als Munition kaufen kannst.',
        },
        references: {
            headline: 'Du suchst einen Teamplayer? Das sagen meine Kollegen über mich',
            project: 'Projekt',
            quote1: '‘’Asbjörn musste Inhalte in Zusammenarbeit mit dem Team entwickeln, aufbereiten und liefern. Er ist ein zuverlässiger und freundlicher Mensch.’’',
            quote2: '‘’Er ist ein vertrauenswürdiger Teamplayer und kann mit Deadline-Stress umgehen. Strukturierte Arbeit und sauberer Code.‘’',
            quote3: '‘’Er ist ein zuverlässiger und freundlicher Mensch. Er arbeitet strukturiert und schreibt sauberen Code. Ich empfehle ihn als Kollegen.’’',
        },
        contact: {
            headline: 'Kontaktiere mich',
            intro: 'Ermutige Leute, dich zu kontaktieren, und beschreibe, an welcher Rolle du interessiert bist. Zeige Interesse, an einem neuen Projekt mitzuwirken.',
            emailLabel: 'E-Mail: ',
            telLabel: 'Tel.: ',
            namePlaceholder: 'Dein Name',
            emailPlaceholder: 'Deine E-Mail',
            messagePlaceholder: 'Deine Nachricht',
            nameError: 'Bitte gib einen Namen ein',
            emailError: 'Bitte gib eine gültige E-Mail-Adresse ein.',
            messageError: 'Du kannst keine leere Nachricht senden.',
            send: 'Senden',
        },
        footer: {
            legalNotice: 'Impressum',
            privacyPolicy: 'Datenschutz',
        },
    },
} as const;

export type Translations = typeof TRANSLATIONS[Lang];
