<?php
/**
 * ============================================================
 * ADMIN API — Site Mode Toggle
 * ============================================================
 * GET  ?action=get_mode  → Returns current site mode
 * POST ?action=set_mode  → Toggles between group_only / full_access
 * ============================================================
 */

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// CORS
$allowed_origins = [
    'https://themahalaxmigroup.com',
    'https://www.themahalaxmigroup.com',
    'http://localhost:3000',
    'http://localhost:5173',
];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$data_file = __DIR__ . '/data/site-mode.json';
$action = isset($_GET['action']) ? $_GET['action'] : '';

// ── Helper: Read current mode ───────────────────────────────
function get_current_mode($file)
{
    if (!file_exists($file)) {
        return 'group_only'; // default
    }
    $data = json_decode(file_get_contents($file), true);
    return isset($data['mode']) ? $data['mode'] : 'group_only';
}

// ── GET MODE (public — no auth required) ────────────────────
if ($action === 'get_mode') {
    echo json_encode(['mode' => get_current_mode($data_file)]);
    exit;
}

// ── SET MODE (auth required) ────────────────────────────────
if ($action === 'set_mode' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();

    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        http_response_code(401);
        echo json_encode(['error' => 'Not authenticated']);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $new_mode = isset($input['mode']) ? $input['mode'] : '';

    if (!in_array($new_mode, ['group_only', 'full_access'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid mode. Use group_only or full_access.']);
        exit;
    }

    // Ensure data directory exists
    $data_dir = __DIR__ . '/data';
    if (!is_dir($data_dir)) {
        mkdir($data_dir, 0755, true);
    }

    $result = file_put_contents($data_file, json_encode([
        'mode' => $new_mode,
        'updated_at' => date('Y-m-d H:i:s T'),
        'updated_by' => 'admin'
    ], JSON_PRETTY_PRINT));

    if ($result === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update mode. Check file permissions.']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'mode' => $new_mode,
        'message' => "Site mode updated to: $new_mode"
    ]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Unknown action']);
