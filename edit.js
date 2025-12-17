// Form Data Editor (PHP Version)

let formData = {
    title: "Dynamic Form",
    chapters: []
};

// Initialize editor
document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const select = document.getElementById('filename-select');
    const input = document.getElementById('filename-input');
    const formTitle = document.getElementById('form-title');
    
    // Check if elements exist (for edit.php)
    if (!select || !input) {
        console.warn('Editor elements not found - this might be the wrong page');
        return;
    }
    
    // Load from URL parameter if provided
    const urlParams = new URLSearchParams(window.location.search);
    const formParam = urlParams.get('form') || urlParams.get('data');
    if (formParam) {
        const option = Array.from(select.options).find(opt => opt.value === formParam);
        if (option) {
            select.value = formParam;
            loadFormDataFile(formParam);
        } else {
            // File not in dropdown, show input and set value
            input.value = formParam;
            document.getElementById('filename-input-group').style.display = 'flex';
            select.value = '';
            loadFormDataFile(formParam);
        }
    }
    
    // Handle dropdown change
    select.addEventListener('change', function() {
        const inputGroup = document.getElementById('filename-input-group');
        if (this.value === '') {
            // Create new file - show input
            inputGroup.style.display = 'flex';
            input.value = '';
            input.focus();
        } else {
            // File selected - hide input and load file
            inputGroup.style.display = 'none';
            loadFormDataFile(this.value);
        }
    });
    
    updatePreview();
    
    // Auto-update preview on changes
    if (formTitle) {
        formTitle.addEventListener('input', updatePreview);
    }
    if (input) {
        input.addEventListener('input', updatePreview);
    }
});

function addChapter() {
    const chapter = {
        id: `chapter-${Date.now()}`,
        title: "New Chapter",
        fields: []
    };
    formData.chapters.push(chapter);
    renderChapters();
    updatePreview();
}

function removeChapter(index) {
    formData.chapters.splice(index, 1);
    renderChapters();
    updatePreview();
}

function addField(chapterIndex) {
    const field = {
        type: "text",
        id: `field-${Date.now()}`,
        label: "New Field",
        required: false,
        multiline: false
    };
    formData.chapters[chapterIndex].fields.push(field);
    renderChapters();
    updatePreview();
}

function removeField(chapterIndex, fieldIndex) {
    formData.chapters[chapterIndex].fields.splice(fieldIndex, 1);
    renderChapters();
    updatePreview();
}

function renderChapters() {
    const container = document.getElementById('chapters-container');
    container.innerHTML = '';
    
    formData.chapters.forEach((chapter, chapterIndex) => {
        const chapterDiv = document.createElement('div');
        chapterDiv.className = 'chapter-editor';
        
        chapterDiv.innerHTML = `
            <div class="chapter-header">
                <input type="text" 
                       value="${escapeHtml(chapter.title)}" 
                       placeholder="Chapter Title"
                       onchange="updateChapterTitle(${chapterIndex}, this.value)">
                <input type="text" 
                       value="${escapeHtml(chapter.id)}" 
                       placeholder="Chapter ID"
                       onchange="updateChapterId(${chapterIndex}, this.value)"
                       style="max-width: 200px; margin-right: 1rem;">
                <button onclick="removeChapter(${chapterIndex})" class="btn btn-danger btn-small">Remove</button>
            </div>
            <div id="fields-${chapterIndex}"></div>
            <button onclick="addField(${chapterIndex})" class="btn btn-secondary btn-small">+ Field</button>
        `;
        
        container.appendChild(chapterDiv);
        
        // Render fields
        const fieldsContainer = document.getElementById(`fields-${chapterIndex}`);
        chapter.fields.forEach((field, fieldIndex) => {
            fieldsContainer.appendChild(createFieldEditor(chapterIndex, fieldIndex, field));
        });
    });
}

function createFieldEditor(chapterIndex, fieldIndex, field) {
    const fieldDiv = document.createElement('div');
    fieldDiv.className = 'field-editor';
    
    const isChecklist = field.type === 'checklist';
    const hasDependent = isChecklist && field.dependentField;
    
    fieldDiv.innerHTML = `
        <div class="field-header">
            <select onchange="updateFieldType(${chapterIndex}, ${fieldIndex}, this.value)">
                <option value="text" ${field.type === 'text' ? 'selected' : ''}>Text Field</option>
                <option value="checklist" ${field.type === 'checklist' ? 'selected' : ''}>Checklist</option>
            </select>
            <button onclick="removeField(${chapterIndex}, ${fieldIndex})" class="btn btn-danger btn-small">Remove</button>
        </div>
        <div class="field-properties">
            <div class="property-group">
                <label>ID</label>
                <input type="text" 
                       value="${escapeHtml(field.id)}" 
                       onchange="updateFieldProperty(${chapterIndex}, ${fieldIndex}, 'id', this.value)">
            </div>
            <div class="property-group">
                <label>Label</label>
                <input type="text" 
                       value="${escapeHtml(field.label)}" 
                       onchange="updateFieldProperty(${chapterIndex}, ${fieldIndex}, 'label', this.value)">
            </div>
            <div class="property-group">
                <label>
                    <input type="checkbox" 
                           ${field.required ? 'checked' : ''} 
                           onchange="updateFieldProperty(${chapterIndex}, ${fieldIndex}, 'required', this.checked)">
                    Required
                </label>
            </div>
            ${field.type === 'text' ? `
                <div class="property-group">
                    <label>
                        <input type="checkbox" 
                               ${field.multiline ? 'checked' : ''} 
                               onchange="updateFieldProperty(${chapterIndex}, ${fieldIndex}, 'multiline', this.checked)">
                        Multiline
                    </label>
                </div>
                <div class="property-group">
                    <label>Placeholder</label>
                    <input type="text" 
                           value="${escapeHtml(field.placeholder || '')}" 
                           onchange="updateFieldProperty(${chapterIndex}, ${fieldIndex}, 'placeholder', this.value)">
                </div>
            ` : ''}
        </div>
        ${isChecklist ? `
            <div class="dependent-field-editor">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <strong>Dependent Field</strong>
                    <button onclick="toggleDependentField(${chapterIndex}, ${fieldIndex})" class="btn btn-small ${hasDependent ? 'btn-danger' : 'btn-secondary'}">
                        ${hasDependent ? 'Remove Dependent' : 'Add Dependent'}
                    </button>
                </div>
                ${hasDependent ? `
                    <div class="field-properties">
                        <div class="property-group">
                            <label>ID</label>
                            <input type="text" 
                                   value="${escapeHtml(field.dependentField.id)}" 
                                   onchange="updateDependentFieldProperty(${chapterIndex}, ${fieldIndex}, 'id', this.value)">
                        </div>
                        <div class="property-group">
                            <label>Label</label>
                            <input type="text" 
                                   value="${escapeHtml(field.dependentField.label)}" 
                                   onchange="updateDependentFieldProperty(${chapterIndex}, ${fieldIndex}, 'label', this.value)">
                        </div>
                        <div class="property-group">
                            <label>
                                <input type="checkbox" 
                                       ${field.dependentField.multiline ? 'checked' : ''} 
                                       onchange="updateDependentFieldProperty(${chapterIndex}, ${fieldIndex}, 'multiline', this.checked)">
                                Multiline
                            </label>
                        </div>
                        <div class="property-group">
                            <label>Placeholder</label>
                            <input type="text" 
                                   value="${escapeHtml(field.dependentField.placeholder || '')}" 
                                   onchange="updateDependentFieldProperty(${chapterIndex}, ${fieldIndex}, 'placeholder', this.value)">
                        </div>
                    </div>
                ` : ''}
            </div>
        ` : ''}
    `;
    
    return fieldDiv;
}

function updateChapterTitle(index, value) {
    formData.chapters[index].title = value;
    updatePreview();
}

function updateChapterId(index, value) {
    formData.chapters[index].id = value;
    updatePreview();
}

function updateFieldType(chapterIndex, fieldIndex, type) {
    const field = formData.chapters[chapterIndex].fields[fieldIndex];
    field.type = type;
    
    if (type === 'checklist') {
        if (!field.dependentField) {
            field.dependentField = {
                id: `dependent-${Date.now()}`,
                label: "Dependent Field",
                multiline: false
            };
        }
    } else {
        delete field.dependentField;
        delete field.multiline;
        delete field.placeholder;
    }
    
    renderChapters();
    updatePreview();
}

function updateFieldProperty(chapterIndex, fieldIndex, property, value) {
    formData.chapters[chapterIndex].fields[fieldIndex][property] = value;
    updatePreview();
}

function toggleDependentField(chapterIndex, fieldIndex) {
    const field = formData.chapters[chapterIndex].fields[fieldIndex];
    if (field.dependentField) {
        delete field.dependentField;
    } else {
        field.dependentField = {
            id: `dependent-${Date.now()}`,
            label: "Dependent Field",
            multiline: false
        };
    }
    renderChapters();
    updatePreview();
}

function updateDependentFieldProperty(chapterIndex, fieldIndex, property, value) {
    if (!formData.chapters[chapterIndex].fields[fieldIndex].dependentField) {
        formData.chapters[chapterIndex].fields[fieldIndex].dependentField = {};
    }
    formData.chapters[chapterIndex].fields[fieldIndex].dependentField[property] = value;
    updatePreview();
}

function updatePreview() {
    formData.title = document.getElementById('form-title').value || "Dynamic Form";
    const code = generateFormDataCode();
    document.getElementById('code-preview').textContent = code;
}

function generateFormDataCode() {
    let code = `// Form data structure\nconst formData = {\n  title: ${JSON.stringify(formData.title)},\n  chapters: [\n`;
    
    formData.chapters.forEach((chapter, chapterIndex) => {
        code += `    {\n      id: ${JSON.stringify(chapter.id)},\n      title: ${JSON.stringify(chapter.title)},\n      fields: [\n`;
        
        chapter.fields.forEach((field, fieldIndex) => {
            code += `        {\n          type: ${JSON.stringify(field.type)},\n          id: ${JSON.stringify(field.id)},\n          label: ${JSON.stringify(field.label)},\n          required: ${field.required || false}`;
            
            if (field.type === 'text') {
                if (field.multiline) {
                    code += `,\n          multiline: true`;
                }
                if (field.placeholder) {
                    code += `,\n          placeholder: ${JSON.stringify(field.placeholder)}`;
                }
            } else if (field.type === 'checklist') {
                if (field.dependentField) {
                    code += `,\n          dependentField: {\n            id: ${JSON.stringify(field.dependentField.id)},\n            label: ${JSON.stringify(field.dependentField.label)}`;
                    if (field.dependentField.multiline) {
                        code += `,\n            multiline: true`;
                    }
                    if (field.dependentField.placeholder) {
                        code += `,\n            placeholder: ${JSON.stringify(field.dependentField.placeholder)}`;
                    }
                    code += `\n          }`;
                }
            }
            
            code += `\n        }`;
            if (fieldIndex < chapter.fields.length - 1) {
                code += `,`;
            }
            code += `\n`;
        });
        
        code += `      ]\n    }`;
        if (chapterIndex < formData.chapters.length - 1) {
            code += `,`;
        }
        code += `\n`;
    });
    
    code += `  ]\n};\n`;
    return code;
}

function loadFormData() {
    const select = document.getElementById('filename-select');
    const input = document.getElementById('filename-input');
    
    let filename = '';
    if (select.value !== '') {
        filename = select.value;
    } else {
        filename = input.value.trim();
    }
    
    if (!filename) {
        showStatus('Please select a file or enter a filename', 'error');
        return;
    }
    loadFormDataFile(filename);
}

function loadFormDataFile(filename) {
    // Use PHP endpoint to load file
    fetch(`edit.php?load=${encodeURIComponent(filename)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(text => {
            // Parse the JavaScript file to extract the formData object
            try {
                // Remove single-line comments but preserve the structure
                let cleanedText = text.replace(/\/\/.*$/gm, '').trim();
                
                // Find the formData assignment
                const formDataMatch = cleanedText.match(/const\s+formData\s*=\s*({[\s\S]*});?\s*$/);
                if (!formDataMatch) {
                    throw new Error('Could not find formData object in file');
                }
                
                // Extract the object literal
                const objectLiteral = formDataMatch[1];
                
                // Parse it safely by wrapping in a function that returns the object
                const func = new Function('return ' + objectLiteral);
                const loadedData = func();
                
                if (loadedData && Array.isArray(loadedData.chapters)) {
                    formData = {
                        title: loadedData.title || "Dynamic Form",
                        chapters: JSON.parse(JSON.stringify(loadedData.chapters))
                    };
                    document.getElementById('form-title').value = formData.title;
                    
                    // Update dropdown to show loaded file
                    const select = document.getElementById('filename-select');
                    const input = document.getElementById('filename-input');
                    const inputGroup = document.getElementById('filename-input-group');
                    if (select.options.namedItem(filename)) {
                        select.value = filename;
                        inputGroup.style.display = 'none';
                    } else {
                        select.value = '';
                        input.value = filename;
                        inputGroup.style.display = 'flex';
                    }
                    
                    renderChapters();
                    updatePreview();
                } else {
                    showStatus('Could not parse form data. Make sure the file contains a valid formData object with chapters array.', 'error');
                }
            } catch (error) {
                console.error('Error parsing form data:', error);
                showStatus(`Error parsing form data: ${error.message}`, 'error');
            }
        })
        .catch(error => {
            console.error('Error loading file:', error);
            showStatus(`Could not load file: ${error.message}`, 'error');
        });
}

function saveFormData() {
    const select = document.getElementById('filename-select');
    const input = document.getElementById('filename-input');
    
    let filename = '';
    if (select.value !== '') {
        filename = select.value;
    } else {
        filename = input.value.trim();
    }
    
    if (!filename) {
        showStatus('Please select a file or enter a filename', 'error');
        return;
    }
    
    const code = generateFormDataCode();
    
    // Show loading state
    showStatus('Saving...', 'success');
    
    // POST to PHP endpoint
    const formData = new FormData();
    formData.append('action', 'save');
    formData.append('filename', filename);
    formData.append('content', code);
    
    fetch('edit.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showStatus(data.message || 'File saved successfully!', 'success');
        } else {
            showStatus(data.error || 'Failed to save file', 'error');
        }
    })
    .catch(error => {
        console.error('Error saving file:', error);
        showStatus(`Error saving file: ${error.message}`, 'error');
    });
}

function showStatus(message, type) {
    const statusDiv = document.getElementById('save-status');
    statusDiv.textContent = message;
    statusDiv.className = `save-status ${type}`;
    statusDiv.style.display = 'block';
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}

function previewForm() {
    // Generate the formData code
    const code = generateFormDataCode();
    
    // Store in localStorage for preview
    try {
        // Parse the code to get the actual object
        const cleanedText = code.replace(/\/\/.*$/gm, '').trim();
        const formDataMatch = cleanedText.match(/const\s+formData\s*=\s*({[\s\S]*});?\s*$/);
        if (formDataMatch) {
            const objectLiteral = formDataMatch[1];
            const func = new Function('return ' + objectLiteral);
            const previewData = func();
            
            // Store in localStorage
            localStorage.setItem('formPreviewData', JSON.stringify(previewData));
            
            // Open preview in new window
            const previewWindow = window.open('index.html?preview=1', '_blank');
            if (!previewWindow) {
                alert('Please allow popups to preview the form');
            }
        } else {
            showStatus('Could not generate preview data', 'error');
        }
    } catch (error) {
        console.error('Error generating preview:', error);
        showStatus(`Error generating preview: ${error.message}`, 'error');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

