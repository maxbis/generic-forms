// Form data structure
const formData = {
  title: "Voorbereiding Project kerntaak",
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
          required: true,
          placeholder: "projectnaam"
        },
        {
          type: "text",
          id: "Projectbeschrijving",
          label: "Projectbeschrijving (wat/waarom)",
          required: true,
          multiline: true,
          placeholder: "Beschrijf het project in je eigen woorden..."
        },
        {
          type: "checklist",
          id: "stage",
          label: "Stage project",
          required: true,
          dependentField: {
            id: "stage omschrijving",
            label: "Jouw bijdrage",
            multiline: true,
            placeholder: "Mijn bijdrage was ..."
          }
        }
      ]
    },
    {
      id: "uitgngspunten",
      title: "Uitgangspunten",
      fields: [
        {
          type: "text",
          id: "taal",
          label: "Taal / Framework",
          required: true,
          placeholder: "Welke taal/frameworks ga je gebruiken"
        },
        {
          type: "checklist",
          id: "database",
          label: "Database",
          required: true,
          dependentField: {
            id: "database-type",
            label: "Database",
            placeholder: "Welke?"
          }
        },
        {
          type: "checklist",
          id: "GIT",
          label: "Git gebruikt",
          required: true,
          dependentField: {
            id: "aantal-commits",
            label: "Hoeveel commits heb je en over hoeveel dagen?",
            placeholder: "12 commits van 1 jan 2024 tot 1 mei 2024"
          }
        },
        {
          type: "text",
          id: "eisen",
          label: "Algemene eisen",
          required: true,
          multiline: true
        }
      ]
    }
  ]
};
