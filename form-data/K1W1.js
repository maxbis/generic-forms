const formData = {
    title: "Examenonderlegger - Kerntaak 1 Werkproces 1",
    chapters: [
      {
        id: "Studentgegevens",
        title: "Studentgegevens",
        fields: [
          {
            type: "text",
            id: "Studentennaam",
            label: "Studentennaam",
            required: true
          },
          {
            type: "text",
            id: "Klas",
            label: "Klas",
            required: true
          }
        ]
      },
      {
        id: "Uitgangspunten-Eisen",
        title: "Uitgangspunten, eisen en wensen",
        fields: [
          {
            type: "checklist",
            id: "criteria-uitgangspunten",
            label: "Er zijn minimaal 5 uitgangspunten (kaders/randvoorwaarden) benoemd. Ze zijn onderbouwd en de bron is duidelijk.",
            required: true,
            dependentField: {
              id: "bewijs-uitgangspunten",
              label: "Hoe en waar heb je dat aangetoond?",
              multiline: true,
              placeholder: "Bestandsnaam, pagina of hoofdstuk..."
            }
          },
          {
            type: "checklist",
            id: "criteria-functionele-eisen",
            label: "Er zijn minimaal 12 functionele eisen benoemd. Deze beschrijven observeerbaar gedrag en zijn testbaar.",
            required: true,
            dependentField: {
              id: "bewijs-functionele-eisen",
              label: "Hoe en waar heb je dat aangetoond?",
              multiline: true
            }
          },
          {
            type: "checklist",
            id: "criteria-technische-eisen",
            label: "Er zijn minimaal 5 technische eisen benoemd. Deze zijn concreet (controleerbaar) en onderbouwd.",
            required: true,
            dependentField: {
              id: "bewijs-technische-eisen",
              label: "Hoe en waar heb je dat aangetoond?",
              multiline: true
            }
          }
        ]
      },
      {
        id: "Planning-Uitvoering",
        title: "Planning & Taken",
        fields: [
          {
            type: "checklist",
            id: "criteria-planning-eisen",
            label: "Alle functionele eisen komen terug in de planning.",
            required: true,
            dependentField: {
              id: "bewijs-planning-eisen",
              label: "Hoe en waar heb je dat aangetoond?",
              multiline: true
            }
          },
          {
            type: "checklist",
            id: "criteria-taken-opsplitsing",
            label: "Taken zijn opgesplitst (max. 4 uur per taak) en gekoppeld aan een specifiek onderdeel van de eisen. Taken zijn eenduidig beschreven.",
            required: true,
            dependentField: {
              id: "bewijs-taken-opsplitsing",
              label: "Hoe en waar heb je dat aangetoond?",
              multiline: true
            }
          },
          {
            type: "checklist",
            id: "criteria-ontwikkeltijd",
            label: "De totale ontwikkeltijd is minimaal 40 uur.",
            required: true,
            dependentField: {
              id: "bewijs-ontwikkeltijd",
              label: "Hoe en waar heb je dat aangetoond?",
              multiline: true
            }
          },
          {
            type: "checklist",
            id: "criteria-planning-logica",
            label: "De planning is logisch en chronologisch van opbouw, concreet en testbaar.",
            required: true,
            dependentField: {
              id: "bewijs-planning-logica",
              label: "Hoe en waar heb je dat aangetoond?",
              multiline: true
            }
          },
          {
            type: "checklist",
            id: "criteria-overlegmomenten",
            label: "In de planning zijn minimaal 5 overleg/voortgangsmomenten opgenomen.",
            required: true,
            dependentField: {
              id: "bewijs-overlegmomenten",
              label: "Hoe en waar heb je dat aangetoond?",
              multiline: true
            }
          }
        ]
      },
      {
        id: "Bewaking-Evaluatie",
        title: "Bewaking & Voortgang",
        fields: [
          {
            type: "checklist",
            id: "criteria-voortgang-bijgehouden",
            label: "De voortgang is minimaal 5 keer bijgehouden (bevat datum en daadwerkelijk bestede uren).",
            required: true,
            dependentField: {
              id: "bewijs-voortgang-bijgehouden",
              label: "Hoe en waar heb je dat aangetoond?",
              multiline: true
            }
          },
          {
            type: "checklist",
            id: "criteria-voortgangsmeting-status",
            label: "Elke voortgangsmeting bevat status, afwijking en een beschreven actie op die afwijking.",
            required: true,
            dependentField: {
              id: "bewijs-voortgangsmeting-status",
              label: "Hoe en waar heb je dat aangetoond?",
              multiline: true
            }
          },
          {
            type: "checklist",
            id: "criteria-evaluatie",
            label: "Er is een afsluitende evaluatie/reflectie opgenomen van het verloop van het project.",
            required: true,
            dependentField: {
              id: "bewijs-evaluatie",
              label: "Hoe en waar heb je dat aangetoond?",
              multiline: true
            }
          }
        ]
      }
    ]
  };