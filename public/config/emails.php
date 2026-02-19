<?php
/**
 * ============================================================
 * EMAIL CONFIGURATION — Mahalaxmi Group Contact Forms
 * ============================================================
 * 
 * Edit the email addresses below to route inquiries to the
 * correct department. Each key corresponds to a form type:
 *
 *   general    → Main contact page (General tab)
 *   product    → Main contact page (Product Sales tab)
 *   dist       → Main contact page (Distributor tab)
 *   oem        → Main contact page (OEM Partner tab)
 *   chemicals  → Chemicals division page form
 *   millennium → Millennium division page form
 *   shiv       → Shiv Minerals division page form
 *   transport  → Transport division page form
 *   infra      → Infrastructure division page form
 *   callback   → Request a Callback form
 *   inquiry    → Product Detail quick inquiry form
 *
 * To activate: simply change the email addresses below
 * and deploy. No other code changes needed.
 * ============================================================
 */

return [
    // ── Main Contact Page Tabs ──────────────────────────────
    'general' => 'info@themahalaxmigroup.com',
    'product' => 'sales@themahalaxmigroup.com',
    'dist' => 'distributors@themahalaxmigroup.com',
    'oem' => 'oem@themahalaxmigroup.com',

    // ── Division Page Forms ─────────────────────────────────
    'chemicals' => 'chemicals@themahalaxmigroup.com',
    'millennium' => 'info@themahalaxmigroup.com',
    'shiv' => 'info@themahalaxmigroup.com',
    'transport' => 'logistics@themahalaxmigroup.com',
    'infra' => 'info@themahalaxmigroup.com',

    // ── Other Forms ─────────────────────────────────────────
    'callback' => 'info@themahalaxmigroup.com',
    'inquiry' => 'sales@themahalaxmigroup.com',
];
