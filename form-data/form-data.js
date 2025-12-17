// Example data structure for form generation
const formData = {
  title: "Dynamic Form!",
  chapters: [
    {
      id: "personal-info",
      title: "Personal Information",
      fields: [
        {
          type: "text",
          id: "first-name",
          label: "First Name",
          required: true,
          multiline: false
        },
        {
          type: "text",
          id: "last-name",
          label: "Last Name",
          required: true,
          multiline: false
        },
        {
          type: "text",
          id: "email",
          label: "Email Address",
          required: true,
          multiline: false
        },
        {
          type: "text",
          id: "bio",
          label: "Biography",
          required: false,
          multiline: true,
          placeholder: "Tell us about yourself..."
        }
      ]
    },
    {
      id: "preferences",
      title: "Preferences",
      fields: [
        {
          type: "checklist",
          id: "newsletter",
          label: "Subscribe to Newsletter",
          required: false,
          multiline: false,
          dependentField: {
            id: "newsletter-email",
            label: "Newsletter Email",
            placeholder: "Enter your preferred email"
          }
        },
        {
          type: "checklist",
          id: "notifications",
          label: "Enable Notifications",
          required: false,
          multiline: false,
          dependentField: {
            id: "notification-preferences",
            label: "Notification Preferences",
            multiline: true,
            placeholder: "Describe your notification preferences..."
          }
        },
        {
          type: "text",
          id: "phone",
          label: "Phone Number",
          required: false,
          multiline: false
        }
      ]
    },
    {
      id: "additional",
      title: "Additional Information",
      fields: [
        {
          type: "text",
          id: "comments",
          label: "Comments",
          required: false,
          multiline: true,
          placeholder: "Any additional comments or feedback..."
        }
      ]
    }
  ]
};

