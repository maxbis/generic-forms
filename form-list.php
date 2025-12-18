<?php
// form-list.php - List available JSON form definitions

// Helper: safely get list of JSON form files
function getFormFiles(string $dir): array {
    $pattern = rtrim($dir, '/\\') . DIRECTORY_SEPARATOR . '*.json';
    $files = glob($pattern) ?: [];

    // Filter out non-form files if needed (adjust this if you add helper JSON files)
    return array_values(array_filter($files, function ($file) {
        $base = basename($file);
        // Example: skip files starting with underscore
        if (strpos($base, '_') === 0) {
            return false;
        }
        return true;
    }));
}

// Helper: read title from JSON file
function getFormMeta(string $file): array {
    $code = pathinfo($file, PATHINFO_FILENAME);
    $title = 'Form ' . $code;

    try {
        $json = @file_get_contents($file);
        if ($json !== false) {
            $data = json_decode($json, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
                if (isset($data['title']) && is_string($data['title']) && $data['title'] !== '') {
                    $title = $data['title'];
                }
            }
        }
    } catch (Throwable $e) {
        // Ignore and keep fallback title
    }

    return [
        'code' => $code,
        'title' => $title,
    ];
}

$formDir = __DIR__ . DIRECTORY_SEPARATOR . 'form-data';
$files = is_dir($formDir) ? getFormFiles($formDir) : [];
$forms = array_map('getFormMeta', $files);

// Optional: sort by code
usort($forms, function ($a, $b) {
    return strcmp($a['code'], $b['code']);
});
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kies een formulier</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Kies een formulier</h1>
        </header>

        <?php if (empty($forms)): ?>
            <p>Er zijn momenteel geen formulieren gevonden in de map <code>form-data</code>.</p>
        <?php else: ?>
            <div class="form-list">
                <ul>
                    <?php foreach ($forms as $form): ?>
                        <li>
                            <a href="index.html?form=<?= htmlspecialchars($form['code'], ENT_QUOTES, 'UTF-8') ?>" class="form-list-link">
                                <span class="form-list-title">
                                    <?= htmlspecialchars($form['title'], ENT_QUOTES, 'UTF-8') ?>
                                </span>
                                <span class="form-list-code">
                                    Formuliercode: <?= htmlspecialchars($form['code'], ENT_QUOTES, 'UTF-8') ?>
                                </span>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>


