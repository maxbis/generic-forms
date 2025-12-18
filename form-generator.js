// Form Generator - Dynamically creates form from data structure

class FormGenerator {
    constructor(formData, formElement) {
        this.formData = formData;
        this.formElement = formElement;
        this.init();
    }

    init() {
        this.setTitle();
        this.renderForm();
        this.attachEventListeners();
    }

    setTitle() {
        if (this.formData.title) {
            const titleElement = document.querySelector('header h1');
            if (titleElement) {
                titleElement.textContent = this.formData.title;
            }
        }
    }

    renderForm() {
        this.formElement.innerHTML = '';
        
        this.formData.chapters.forEach(chapter => {
            const chapterElement = this.createChapter(chapter);
            this.formElement.appendChild(chapterElement);
        });
    }

    createChapter(chapter) {
        const chapterDiv = document.createElement('div');
        chapterDiv.className = 'chapter';
        chapterDiv.setAttribute('data-chapter-id', chapter.id);

        const title = document.createElement('h2');
        title.className = 'chapter-title';
        title.textContent = chapter.title;
        chapterDiv.appendChild(title);

        chapter.fields.forEach(field => {
            const fieldGroup = this.createField(field);
            chapterDiv.appendChild(fieldGroup);
        });

        return chapterDiv;
    }

    createField(field) {
        const fieldGroup = document.createElement('div');
        fieldGroup.className = 'field-group';
        fieldGroup.setAttribute('data-field-id', field.id);

        if (field.type === 'text') {
            this.createTextField(field, fieldGroup);
        } else if (field.type === 'checklist') {
            this.createChecklistField(field, fieldGroup);
        }

        return fieldGroup;
    }

    createTextField(field, container) {
        // Label
        const label = document.createElement('label');
        label.className = 'field-label' + (field.required ? ' required' : '');
        label.setAttribute('for', field.id);
        label.textContent = field.label;
        container.appendChild(label);

        // Input or Textarea
        const input = field.multiline 
            ? document.createElement('textarea')
            : document.createElement('input');
        
        // Only set type for input elements, not textarea
        if (!field.multiline) {
            input.type = 'text';
        }
        
        input.id = field.id;
        input.name = field.id;
        input.required = field.required || false;
        
        if (field.placeholder) {
            input.placeholder = field.placeholder;
        }

        container.appendChild(input);

        // Error message
        const errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'This field is required';
        container.appendChild(errorMsg);
    }

    createChecklistField(field, container) {
        // Checklist group
        const checklistGroup = document.createElement('div');
        checklistGroup.className = 'checklist-group';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = field.id;
        checkbox.name = field.id;

        const checkboxLabel = document.createElement('label');
        checkboxLabel.setAttribute('for', field.id);
        checkboxLabel.textContent = field.label;

        checklistGroup.appendChild(checkbox);
        checklistGroup.appendChild(checkboxLabel);
        container.appendChild(checklistGroup);

        // Dependent field (if exists)
        if (field.dependentField) {
            const dependentContainer = document.createElement('div');
            dependentContainer.className = 'dependent-field hidden';
            dependentContainer.setAttribute('data-dependent-for', field.id);

            const dependentLabel = document.createElement('label');
            dependentLabel.className = 'field-label';
            dependentLabel.setAttribute('for', field.dependentField.id);
            dependentLabel.textContent = field.dependentField.label;
            dependentContainer.appendChild(dependentLabel);

            const dependentInput = field.dependentField.multiline
                ? document.createElement('textarea')
                : document.createElement('input');
            
            // Only set type for input elements, not textarea
            if (!field.dependentField.multiline) {
                dependentInput.type = 'text';
            }
            
            dependentInput.id = field.dependentField.id;
            dependentInput.name = field.dependentField.id;
            dependentInput.disabled = true;

            if (field.dependentField.placeholder) {
                dependentInput.placeholder = field.dependentField.placeholder;
            }

            dependentContainer.appendChild(dependentInput);
            container.appendChild(dependentContainer);

            // Toggle dependent field visibility based on checkbox
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    dependentContainer.classList.remove('hidden');
                    dependentContainer.classList.add('visible');
                    dependentInput.disabled = false;
                    if (field.dependentField.required) {
                        dependentInput.required = true;
                    }
                } else {
                    dependentContainer.classList.remove('visible');
                    dependentContainer.classList.add('hidden');
                    dependentInput.disabled = true;
                    dependentInput.required = false;
                    dependentInput.value = '';
                }
            });
        }
    }

    attachEventListeners() {
        const form = document.getElementById('dynamic-form');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(e);
        });

        form.addEventListener('reset', (e) => {
            this.handleReset(e);
        });

        // Real-time validation
        form.addEventListener('blur', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                this.validateField(e.target);
            }
        }, true);
    }

    validateField(field) {
        const fieldGroup = field.closest('.field-group');
        const isRequired = field.required;
        const isEmpty = !field.value.trim();

        if (isRequired && isEmpty) {
            fieldGroup.classList.add('error');
            return false;
        } else {
            fieldGroup.classList.remove('error');
            return true;
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        let isValid = true;

        // Validate all required fields
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            const formData = this.collectFormData();
            this.displayFormData(formData);
        } else {
            // Scroll to first error
            const firstError = form.querySelector('.field-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    collectFormData() {
        const form = document.getElementById('dynamic-form');
        const formDataObj = {};

        this.formData.chapters.forEach(chapter => {
            formDataObj[chapter.id] = {
                title: chapter.title,
                fields: {}
            };

            chapter.fields.forEach(field => {
                const input = form.querySelector(`[name="${field.id}"]`);
                if (input) {
                    if (input.type === 'checkbox') {
                        formDataObj[chapter.id].fields[field.id] = input.checked;
                        
                        // Include dependent field if checkbox is checked
                        if (field.dependentField && input.checked) {
                            const dependentInput = form.querySelector(`[name="${field.dependentField.id}"]`);
                            if (dependentInput) {
                                formDataObj[chapter.id].fields[field.dependentField.id] = dependentInput.value;
                            }
                        }
                    } else {
                        formDataObj[chapter.id].fields[field.id] = input.value;
                    }
                }
            });
        });

        return formDataObj;
    }

    displayFormData(data) {
        // Create professional document
        const documentHTML = this.createDocument(data);
        
        // Open in new window
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
            <!DOCTYPE html>
            <html lang="nl">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${this.formData.title || 'Form Overview'}</title>
                <style>
                    ${this.getDocumentStyles()}
                </style>
            </head>
            <body>
                ${documentHTML}
            </body>
            </html>
        `);
        newWindow.document.close();
    }

    createDocument(data) {
        const formTitle = this.formData.title || 'Form Overview';
        const currentDate = new Date().toLocaleDateString('nl-NL', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        let html = `
            <div class="document-container">
                <div class="document-header">
                    <h2 class="document-title">${formTitle}</h2>
                    <p class="document-date">Datum: ${currentDate}</p>
                </div>
                <div class="document-content">
        `;

        // Iterate through chapters
        this.formData.chapters.forEach(chapter => {
            const chapterData = data[chapter.id];
            if (!chapterData) return;

            html += `
                <div class="document-section">
                    <h3 class="section-title">${chapter.title}</h3>
                    <table class="document-table">
            `;

            // Iterate through fields
            chapter.fields.forEach(field => {
                const fieldValue = chapterData.fields[field.id];
                
                if (field.type === 'text') {
                    // Text field
                    if (fieldValue && fieldValue.trim() !== '') {
                        html += `
                            <tr class="document-row">
                                <td class="column-label">${field.label}</td>
                                <td class="column-value">${this.escapeHtml(fieldValue)}</td>
                            </tr>
                        `;
                    }
                } else if (field.type === 'checklist') {
                    // Checklist field - first row: label and ja/nee
                    const isChecked = fieldValue === true;
                    html += `
                        <tr class="document-row">
                            <td class="column-label">${field.label}</td>
                            <td class="column-value">${isChecked ? 'Ja' : 'Nee'}</td>
                        </tr>
                    `;
                    
                    // Show dependent field text on next line if checkbox is checked
                    if (isChecked && field.dependentField) {
                        const dependentValue = chapterData.fields[field.dependentField.id];
                        if (dependentValue && dependentValue.trim() !== '') {
                            html += `
                                <tr class="document-row dependent-row">
                                    <td class="column-label">${field.dependentField.label}</td>
                                    <td class="column-value">${this.escapeHtml(dependentValue)}</td>
                                </tr>
                            `;
                        }
                    }
                }
            });

            html += `
                    </table>
                </div>
            `;
        });

        html += `
                </div>
                <div class="document-actions">
                    <button onclick="window.print()" class="btn btn-primary print-btn">Afdrukken</button>
                </div>
            </div>
        `;

        return html;
    }

    getDocumentStyles() {
        return `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            :root {
                --primary-color: #0096FF;
                --primary-hover: #0070C9;
                --background: #f9fafb;
                --surface: #ffffff;
                --border-color: #e5e7eb;
                --text-primary: #111827;
                --text-secondary: #6b7280;
                --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                --radius: 8px;
            }

            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background: var(--background);
                color: var(--text-primary);
                line-height: 1.4;
                padding: 1.5rem 1rem;
            }

            .document-container {
                background: var(--surface);
                border-radius: var(--radius);
                box-shadow: var(--shadow-lg);
                padding: 1.75rem 2rem;
                max-width: 1100px;
                margin: 0 auto;
            }

            .document-header {
                border-bottom: 2px solid var(--primary-color);
                padding-bottom: 1rem;
                margin-bottom: 1.25rem;
            }

            .document-title {
                font-size: 1.75rem;
                font-weight: 700;
                color: var(--primary-color);
                margin: 0 0 0.25rem 0;
            }

            .document-date {
                color: var(--text-secondary);
                font-size: 0.9rem;
                margin: 0;
            }

            .document-content {
                margin-bottom: 1.5rem;
            }

            .document-section {
                margin-bottom: 1.75rem;
                page-break-inside: avoid;
            }

            .document-section:last-child {
                margin-bottom: 0;
            }

            .section-title {
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--primary-color);
                margin: 0 0 0.75rem 0;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid var(--border-color);
            }

            .document-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 0.5rem;
            }

            .document-row {
                border-bottom: 1px solid var(--border-color);
                page-break-inside: avoid;
            }

            .document-row:last-child {
                border-bottom: none;
            }

            .dependent-row {
                background: #f5f5f5;
            }

            .column-label {
                width: 38%;
                padding: 0.5rem 0.75rem;
                font-weight: 600;
                color: var(--text-primary);
                vertical-align: top;
                border-right: 1px solid var(--border-color);
            }

            .dependent-row .column-label {
                position: relative;
                padding-left: 2rem;
                font-weight: 500;
                color: var(--text-secondary);
                font-size: 0.9rem;
            }

            .dependent-row .column-label::before {
                content: '↳';
                position: absolute;
                left: 0.75rem;
                top: 50%;
                transform: translateY(-50%);
                color: var(--text-secondary);
                font-size: 0.9rem;
            }

            .column-value {
                width: 62%;
                padding: 0.5rem 0.75rem;
                color: var(--text-primary);
                vertical-align: top;
                white-space: pre-wrap;
                word-wrap: break-word;
            }

            .document-actions {
                margin-top: 1.25rem;
                padding-top: 1rem;
                border-top: 1px solid var(--border-color);
                text-align: center;
            }

            .btn {
                padding: 0.5rem 1.25rem;
                font-size: 0.95rem;
                font-weight: 500;
                border: none;
                border-radius: var(--radius);
                cursor: pointer;
                transition: all 0.2s ease;
                font-family: inherit;
            }

            .btn-primary {
                background: var(--primary-color);
                color: white;
            }

            .btn-primary:hover {
                background: var(--primary-hover);
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }

            .print-btn {
                min-width: 150px;
            }

            @media print {
                body {
                    background: white;
                    padding: 0;
                }

                .document-container {
                    box-shadow: none;
                    padding: 0;
                    max-width: 100%;
                    margin: 0;
                }

                .document-actions {
                    display: none !important;
                }

                .document-header {
                    page-break-after: avoid;
                }

                .document-section {
                    page-break-inside: avoid;
                }

                .document-row {
                    page-break-inside: avoid;
                }

                @page {
                    margin: 2cm;
                    size: A4;
                }
            }
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    handleReset(e) {
        const outputContainer = document.getElementById('form-output');
        outputContainer.style.display = 'none';
        
        // Reset dependent fields visibility
        setTimeout(() => {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.dispatchEvent(new Event('change'));
            });
        }, 0);
    }
}

// Test function to fill all form fields with their label names
function test() {
    if (typeof formData === 'undefined') {
        console.error('formData is not defined');
        return;
    }

    formData.chapters.forEach(chapter => {
        chapter.fields.forEach(field => {
            if (field.type === 'text') {
                // Fill text input or textarea with label
                const input = document.getElementById(field.id);
                if (input) {
                    input.value = field.label;
                }
            } else if (field.type === 'checklist') {
                // Check the checkbox
                const checkbox = document.getElementById(field.id);
                if (checkbox) {
                    checkbox.checked = true;
                    // Trigger change event to show dependent field
                    checkbox.dispatchEvent(new Event('change'));
                    
                    // Fill dependent field if it exists
                    if (field.dependentField) {
                        setTimeout(() => {
                            const dependentInput = document.getElementById(field.dependentField.id);
                            if (dependentInput) {
                                dependentInput.value = field.dependentField.label;
                            }
                        }, 100);
                    }
                }
            }
        });
    });
    
    console.log('Form filled with label names');
}

// Form initialization is now handled in index.html to support dynamic loading
// This allows loading different form-data.js files via GET parameters

