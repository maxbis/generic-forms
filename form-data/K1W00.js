// Form data structure
const formData = {
  title: "Voorbereiding Project Kerntaak 1",
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
      id: "Projectbeschrijving",
      title: "Projectbeschrijving",
      fields: [
        {
          type: "text",
          id: "Projectnaam",
          label: "Projectnaam",
          required: true
        },
        {
          type: "text",
          id: "wat-ga-je-maken",
          label: "Vertel kort wat je project inhoud",
          required: true,
          multiline: true
        },
        {
          type: "text",
          id: "uitgangspunten",
          label: "Wat zijn de project uitgangspunten?",
          required: true,
          multiline: true,
          placeholder: "Wat zijn de algemene eisen/randvoorwaarden?"
        },
        {
          type: "checklist",
          id: "stage-project",
          label: "Het gaat om een (echt) stage project?",
          required: true,
          dependentField: {
            id: "inbreng",
            label: "Jouw rol",
            multiline: true,
            placeholder: "Wat is jouw rol/inbreng in het project"
          }
        },
        {
          type: "checklist",
          id: "planning-aanwezig",
          label: "Er is een planning met taakbeschrijvingen en ureninschatting",
          required: true
        },
        {
          type: "checklist",
          id: "ontwerp-aanwezig",
          label: "Er is een ontwerp met functionele eisen",
          required: true
        }
      ]
    },
    {
      id: "Code-Techniek",
      title: "Code & Techniek",
      fields: [
        {
          type: "text",
          id: "uren-geprogrammeerd",
          label: "Jouw project bevat hoeveel projecturen?",
          required: true,
          multiline: true,
          placeholder: "Aantal uren"
        },
        {
          type: "text",
          id: "programmeer-principe",
          label: "Welk principe gebruik je? (OOP of Functioneel Programmeren)",
          required: true,
          placeholder: "OOP / Functioneel / Anders"
        },
        {
          type: "checklist",
          id: "database-gebruik",
          label: "Wordt er gebruik gemaakt van een database?",
          required: true,
          dependentField: {
            id: "database-type",
            label: "Welke database?",
            placeholder: "bijv. MySQL, MongoDB"
          }
        },
        {
          type: "text",
          id: "talen-frameworks",
          label: "Welke programmeertalen en frameworks gebruik je?",
          required: true,
          multiline: true,
          placeholder: "Talen: ... \nFrameworks: (Laravel, Tailwind, etc.)"
        }
      ]
    },
    {
      id: "Versiebeheer-Robuustheid",
      title: "Versiebeheer & Robuustheid",
      fields: [
        {
          type: "checklist",
          id: "git-gebruik",
          label: "Er is gebruik gemaakt van GIT versiebeheer",
          required: true,
          dependentField: {
            id: "git-details",
            label: "Hoeveel commits en over welke periode?",
            placeholder: "bijv. 25 commits over 3 weken"
          }
        }
      ]
    },
    {
      id: "Samenwerken-Bewijslast",
      title: "Samenwerken & Bewijslast",
      fields: [
        {
          type: "checklist",
          id: "vergader-bewijs",
          label: "Ik heb een video en notulen van een vergadering",
          required: true,
          dependentField: {
            id: "vergader-bewijs-toelichting",
            label: "Vertel wat je hebt",
            multiline: true
          }
        },
        {
          type: "checklist",
          id: "actielijst-aanwezig",
          label: "Ik heb een actielijst van mijzelf",
          required: true,
          dependentField: {
            id: "actielijst-aanwezig-toelichting",
            label: "In welke vorm en hoeveel?",
            multiline: true
          }
        },
        {
          type: "checklist",
          id: "stage-afstemming",
          label: "Ik kan bewijzen dat ik regelmatig afstem en afspraken vastleg/nakom",
          required: true,
          dependentField: {
            id: "stage-afstemming-toelichting",
            label: "Leg uit hoe, waarmee?",
            multiline: true
          }
        },
        {
          type: "checklist",
          id: "presentatie-video",
          label: "Ik heb een video van een presentatie die ik geef",
          required: true,
          dependentField: {
            id: "presentatie-video-toelichting",
            label: "Vertel over de presentatie",
            placeholder: "Wat was het onderwerp, voor wie en wanneer?"
          }
        }
      ]
    }
  ]
};
