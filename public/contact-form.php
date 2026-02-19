<?php
/**
 * ============================================================
 * CONTACT FORM HANDLER — Mahalaxmi Group
 * ============================================================
 * Secure, multi-form handler with:
 * - Email routing from config/emails.php
 * - Input sanitization (no deprecated filters)
 * - Rate limiting (session-based)
 * - Honeypot bot detection
 * - Input length limits
 * - Secure email headers (no From: spoofing)
 * ============================================================
 */

// ── Security Headers ────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');

// ── CORS — Restrict to own domain ───────────────────────────
$allowed_origins = [
    'https://themahalaxmigroup.com',
    'https://www.themahalaxmigroup.com',
    'http://localhost:3000', // dev only — remove in production
    'http://localhost:5173', // dev only — remove in production
];
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}
else {
    header('Access-Control-Allow-Origin: https://themahalaxmigroup.com');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// ── Handle preflight OPTIONS request ────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ── Only allow POST ─────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// ── Rate Limiting (session-based) ───────────────────────────
session_start();
$rate_limit_seconds = 30;
if (isset($_SESSION['last_submit_time'])) {
    $elapsed = time() - $_SESSION['last_submit_time'];
    if ($elapsed < $rate_limit_seconds) {
        $wait = $rate_limit_seconds - $elapsed;
        http_response_code(429);
        echo json_encode(['error' => "Please wait {$wait} seconds before submitting again."]);
        exit;
    }
}

// ── Load Email Configuration ────────────────────────────────
$config_path = __DIR__ . '/config/emails.php';
if (!file_exists($config_path)) {
    http_response_code(500);
    echo json_encode(['error' => 'Server configuration error. Please contact us directly.']);
    error_log("Missing config file: $config_path");
    exit;
}
$email_config = require $config_path;

// ── Parse Input ─────────────────────────────────────────────
$raw_input = file_get_contents('php://input');
$data = json_decode($raw_input, true);

if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid request format']);
    exit;
}

// ── Honeypot Check (bot detection) ──────────────────────────
// If the hidden "website" field is filled, it's a bot
if (!empty($data['website'])) {
    // Silently accept but don't send email (fool the bot)
    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Message received']);
    exit;
}

// ── Timestamp Check (bot detection) ─────────────────────────
// Forms should take at least 3 seconds to fill out
if (isset($data['_ts'])) {
    $form_time = intval($data['_ts']);
    $current_time = time();
    if (($current_time - $form_time) < 3) {
        // Too fast — likely a bot
        http_response_code(200);
        echo json_encode(['success' => true, 'message' => 'Message received']);
        exit;
    }
}

// ── Sanitization Helper ─────────────────────────────────────
function sanitize_input($value, $max_length = 200)
{
    if (!is_string($value))
        return '';
    $value = trim($value);
    $value = mb_substr($value, 0, $max_length, 'UTF-8');
    $value = strip_tags($value);
    $value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    return $value;
}

// ── Extract and Sanitize Fields ─────────────────────────────
$name = sanitize_input($data['name'] ?? '', 200);
$email = filter_var(trim($data['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$phone = sanitize_input($data['phone'] ?? '', 20);
$company = sanitize_input($data['company'] ?? '', 200);
$message = sanitize_input($data['message'] ?? '', 2000);
$form_type = sanitize_input($data['form_type'] ?? 'general', 50);
$division = sanitize_input($data['division'] ?? '', 100);
$product = sanitize_input($data['product'] ?? '', 200);

// ── Validation ──────────────────────────────────────────────
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'A valid email address is required';
}

// Validate email domain has MX record (extra anti-spam)
if (!empty($email)) {
    $domain = substr(strrchr($email, '@'), 1);
    if (!empty($domain) && !checkdnsrr($domain, 'MX') && !checkdnsrr($domain, 'A')) {
        $errors[] = 'Please provide a valid email address';
    }
}

// Phone validation (basic — allows international formats)
if (!empty($phone) && !preg_match('/^[\d\s\+\-\(\)]{6,20}$/', $phone)) {
    $errors[] = 'Please enter a valid phone number';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['error' => implode('. ', $errors)]);
    exit;
}

// ── Determine Recipient Email ───────────────────────────────
$to_email = $email_config[$form_type] ?? $email_config['general'] ?? 'info@themahalaxmigroup.com';

// ── Build Subject Line ──────────────────────────────────────
$form_labels = [
    'general' => 'General Inquiry',
    'product' => 'Product Sales',
    'dist' => 'Distributor Inquiry',
    'oem' => 'OEM Partnership',
    'chemicals' => 'Chemicals Division',
    'millennium' => 'Millennium Division',
    'shiv' => 'Shiv Minerals',
    'transport' => 'Transport & Logistics',
    'infra' => 'Infrastructure',
    'callback' => 'Callback Request',
    'inquiry' => 'Product Inquiry',
];
$form_label = $form_labels[$form_type] ?? 'Website Inquiry';
$subject = "[Mahalaxmi Website] {$form_label} from {$name}";

// ── Build Email Body ────────────────────────────────────────
$email_body = "
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  NEW INQUIRY — {$form_label}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:         {$name}
Email:        {$email}
Phone:        " . ($phone ?: 'Not provided') . "
Company:      " . ($company ?: 'Not provided') . "
Form Type:    {$form_label}";

if (!empty($division)) {
    $email_body .= "\nDivision:     {$division}";
}
if (!empty($product)) {
    $email_body .= "\nProduct:      {$product}";
}

$email_body .= "

Message:
──────────────────────────────────────────
{$message}
──────────────────────────────────────────

Sent from:    Mahalaxmi Group Website
Date:         " . date('Y-m-d H:i:s T') . "
IP Address:   " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "
User Agent:   " . mb_substr(($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'), 0, 150) . "
";

// ── Send Email (Secure Headers) ─────────────────────────────
// SECURITY: Use a server-side From address, NOT the user's email
// The user's email goes in Reply-To so you can reply directly
$server_from = 'noreply@themahalaxmigroup.com';
$headers = "From: Mahalaxmi Website <{$server_from}>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: MahalaxmiGroupWebsite/2.0\r\n";
$headers .= "X-Priority: 3\r\n";

if (mail($to_email, $subject, $email_body, $headers)) {
    // ── Update Rate Limit Timer ─────────────────────────────
    $_SESSION['last_submit_time'] = time();

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Your message has been sent successfully. We will respond within 24 hours.'
    ]);
}
else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to send message. Please contact us directly at info@themahalaxmigroup.com']);
    error_log("Mail send failed for form_type={$form_type}, to={$to_email}, from={$email}");
}
?>
