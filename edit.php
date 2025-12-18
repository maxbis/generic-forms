<?php
// Handle file save
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save') {
    header('Content-Type: application/json');
    
    $filename = isset($_POST['filename']) ? trim($_POST['filename']) : '';
    $content = isset($_POST['content']) ? $_POST['content'] : '';
    
    // Validate filename
    if (empty($filename)) {
        echo json_encode(['success' => false, 'error' => 'Filename is required']);
        exit;
    }
    
    // Sanitize filename - only allow alphanumeric, dash, and underscore
    $filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $filename);
    if (empty($filename)) {
        echo json_encode(['success' => false, 'error' => 'Invalid filename']);
        exit;
    }
    
    // Ensure filename ends with .json
    if (!preg_match('/\.json$/', $filename)) {
        $filename .= '.json';
    }
    
    // Define the form-data directory
    $formDataDir = __DIR__ . '/form-data';
    
    // Create directory if it doesn't exist
    if (!is_dir($formDataDir)) {
        mkdir($formDataDir, 0755, true);
    }
    
    // Full path to the file
    $filepath = $formDataDir . '/' . $filename;
    
    // Prevent directory traversal
    $realPath = realpath($filepath);
    $realDir = realpath($formDataDir);
    if (!$realPath || strpos($realPath, $realDir) !== 0) {
        echo json_encode(['success' => false, 'error' => 'Invalid file path']);
        exit;
    }
    
    // Write the file
    if (file_put_contents($filepath, $content) !== false) {
        echo json_encode(['success' => true, 'message' => "File saved successfully: {$filename}"]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to save file']);
    }
    exit;
}

// Handle file load (JSON)
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['load'])) {
    $filename = isset($_GET['load']) ? trim($_GET['load']) : '';
    
    // Sanitize filename - allow alphanumeric, dash, underscore and dot
    $filename = preg_replace('/[^a-zA-Z0-9_.-]/', '', $filename);

    // Ensure filename ends with .json
    if (!empty($filename) && !preg_match('/\.json$/', $filename)) {
        $filename .= '.json';
    }

    $formDataDir = __DIR__ . '/form-data';
    $filepath = $formDataDir . '/' . $filename;
    
    // Prevent directory traversal
    $realPath = realpath($filepath);
    $realDir = realpath($formDataDir);
    if ($realPath && $realDir && strpos($realPath, $realDir) === 0 && file_exists($filepath)) {
        header('Content-Type: application/json; charset=utf-8');
        readfile($filepath);
        exit;
    } else {
        http_response_code(404);
        echo 'File not found';
        exit;
    }
}

// Get list of available form-data files
$formDataDir = __DIR__ . '/form-data';
$availableFiles = [];
if (is_dir($formDataDir)) {
    $files = scandir($formDataDir);
    foreach ($files as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'json') {
            $basename = pathinfo($file, PATHINFO_FILENAME);
            $availableFiles[] = $basename;
        }
    }
    sort($availableFiles);
}
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form Data Editor (PHP)</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        .editor-container {
            max-width: 1200px;
        }
        
        .editor-toolbar {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            margin: 2rem 0;
            padding: 1.5rem;
            background: var(--background);
            border-radius: var(--radius);
            border: 1px solid var(--border-color);
        }
        
        .toolbar-row {
            display: flex;
            gap: 1rem;
            align-items: flex-end;
        }
        
        .toolbar-field-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            flex: 1;
            max-width: 300px;
        }
        
        .toolbar-field-group label {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-secondary);
        }
        
        .toolbar-field-group input[type="text"],
        .toolbar-field-group select {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid var(--border-color);
            border-radius: var(--radius);
            background: var(--surface);
            font-family: inherit;
            font-size: 0.875rem;
        }
        
        .toolbar-field-group select {
            cursor: pointer;
        }
        
        .chapter-editor {
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: var(--background);
            border-radius: var(--radius);
            border: 1px solid var(--border-color);
        }
        
        .chapter-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .chapter-header input {
            flex: 1;
            margin-right: 1rem;
        }
        
        .field-editor {
            margin-bottom: 1rem;
            padding: 1rem;
            background: var(--surface);
            border-radius: var(--radius);
            border: 1px solid var(--border-color);
        }
        
        .field-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .field-properties {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .property-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .property-group label {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-secondary);
        }
        
        .property-group input,
        .property-group select {
            padding: 0.5rem;
            border: 1px solid var(--border-color);
            border-radius: var(--radius);
        }
        
        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .dependent-field-editor {
            margin-top: 1rem;
            padding: 1rem;
            background: #fafafa;
            border-radius: var(--radius);
            border-left: 3px solid var(--primary-color);
        }
        
        .btn-danger {
            background: var(--error-color);
            color: white;
        }
        
        .btn-danger:hover {
            background: #dc2626;
        }
        
        .btn-small {
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
        }
        
        .preview-section {
            margin-top: 2rem;
            padding: 1.5rem;
            background: var(--background);
            border-radius: var(--radius);
            border: 1px solid var(--border-color);
        }
        
        .code-preview {
            background: var(--surface);
            padding: 1rem;
            border-radius: var(--radius);
            border: 1px solid var(--border-color);
            font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
            font-size: 0.875rem;
            white-space: pre-wrap;
            word-wrap: break-word;
            max-height: 400px;
            overflow-y: auto;
        }
        
        .save-status {
            margin-top: 1rem;
            padding: 0.75rem;
            border-radius: var(--radius);
            display: none;
        }
        
        .save-status.success {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #10b981;
        }
        
        .save-status.error {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #ef4444;
        }
    </style>
</head>
<body>
    <div class="container editor-container">
        <header>
            <h1>Form Data Editor (PHP)</h1>
            <p class="subtitle">Create or edit form data files - files are saved directly to the server</p>
        </header>
        
        <div class="editor-toolbar">
            <div class="toolbar-row">
                <div class="toolbar-field-group">
                    <label for="filename-select">File Name</label>
                    <select id="filename-select">
                        <option value="">-- Create New File --</option>
                        <?php foreach ($availableFiles as $file): ?>
                            <option value="<?php echo htmlspecialchars($file); ?>" <?php echo (isset($_GET['form']) && $_GET['form'] === $file) ? 'selected' : ''; ?>>
                                <?php echo htmlspecialchars($file); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>
                <div class="toolbar-field-group" id="filename-input-group" style="display: none;">
                    <label for="filename-input">New File Name</label>
                    <input type="text" id="filename-input" placeholder="Enter filename (without .js)" value="">
                </div>
                <div style="display: flex; gap: 0.5rem; align-items: flex-end;">
                    <button onclick="loadFormData()" class="btn btn-secondary btn-small">Load</button>
                    <button onclick="saveFormData()" class="btn btn-primary btn-small">Save</button>
                    <button onclick="previewForm()" class="btn btn-primary btn-small">Preview Form</button>
                    <button onclick="addChapter()" class="btn btn-primary btn-small">+ Chapter</button>
                </div>
            </div>
            <div class="toolbar-row">
                <div class="toolbar-field-group">
                    <label for="form-title">Form Title</label>
                    <input type="text" id="form-title" placeholder="Form Title" value="Dynamic Form">
                </div>
            </div>
        </div>
        
        <div id="save-status" class="save-status"></div>
        
        <div id="chapters-container"></div>
        
        <div class="preview-section">
            <h2 style="color: var(--primary-color); margin-bottom: 1rem;">Preview</h2>
            <div class="code-preview" id="code-preview"></div>
        </div>
    </div>
    
    <script src="edit.js"></script>
</body>
</html>

