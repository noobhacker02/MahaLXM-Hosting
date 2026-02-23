<?php
/**
 * ============================================================
 * ADMIN AUTHENTICATION — Mahalaxmi Group Website
 * ============================================================
 * Handles login, logout, and session verification.
 * All responses are JSON for the React frontend.
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

session_start();

$config = require __DIR__ . '/admin-config.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

// ── LOGIN ───────────────────────────────────────────────────
if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid request']);
        exit;
    }

    $username = trim($data['username'] ?? '');
    $password = $data['password'] ?? '';

    if ($username === $config['username'] && $password === $config['password']) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_login_time'] = time();
        echo json_encode(['success' => true, 'message' => 'Login successful']);
    }
    else {
        // Rate limit failed attempts
        sleep(1);
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
    exit;
}

// ── LOGOUT ──────────────────────────────────────────────────
if ($action === 'logout') {
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Logged out']);
    exit;
}

// ── CHECK SESSION ───────────────────────────────────────────
if ($action === 'check') {
    $logged_in = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;

    // Auto-expire after 4 hours
    if ($logged_in && isset($_SESSION['admin_login_time'])) {
        if (time() - $_SESSION['admin_login_time'] > 14400) {
            session_destroy();
            $logged_in = false;
        }
    }

    echo json_encode(['authenticated' => $logged_in]);
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Unknown action']);
