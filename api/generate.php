<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// ── YOUR API KEY ──
// Option 1: Set it here directly
$apiKey = 'YOUR_ANTHROPIC_API_KEY_HERE';

// Option 2: If 20i supports environment variables, use:
// $apiKey = getenv('ANTHROPIC_API_KEY');

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['businessName']) || empty($input['industry']) || empty($input['location'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Business name, industry, and location are required.']);
    exit;
}

$contentType = $input['contentType'] ?? 'full';
$pages = $contentType === 'landing' ? 'Landing Page' : 'Home, About, Services, Contact';

$prompt = "You are an expert website copywriter and local SEO specialist. Generate professional, conversion-focused website copy for the following business.

BUSINESS DETAILS:
- Business Name: {$input['businessName']}
- Industry: {$input['industry']}
- Location: {$input['location']}
- Services/Products: {$input['services']}
- Target Audience: {$input['targetAudience']}
- Tone: {$input['tone']}
- Unique Selling Points: {$input['uniqueSellingPoints']}

GENERATE CONTENT FOR THESE PAGES: {$pages}

For each page, provide:
1. A suggested page title (SEO-optimised with local keywords)
2. Meta description (under 160 characters, includes location + primary keyword)
3. The full page copy with clear sections, headings (H1, H2, H3), and calls-to-action

COPY GUIDELINES:
- Write for humans first, search engines second
- Include natural local keyword placement (city/region + service)
- Use power words and emotional triggers
- Every section should guide the visitor toward taking action
- Include placeholder text like [PHONE NUMBER] or [EMAIL] where contact details would go
- For Services page: create a compelling description for each service mentioned
- For Contact page: include a compelling reason to get in touch

After ALL page content, provide a dedicated LOCAL SEO TIPS section with:
1. **Google Business Profile** — specific optimisation tips for their industry
2. **Local Keywords** — 15-20 keyword phrases they should target (location + service combinations)
3. **NAP Consistency** — explain what it is and why it matters
4. **Local Schema Markup** — provide a JSON-LD LocalBusiness schema template pre-filled with their details
5. **Review Strategy** — how to generate and respond to Google reviews
6. **Local Link Building** — 5 specific strategies for their industry/location
7. **On-Page SEO Checklist** — title tags, headers, image alt text, internal linking tips
8. **Content Marketing Ideas** — 5 blog post ideas targeting local search intent

Format the entire response in clean Markdown. Use --- to separate each page section. Mark the SEO section clearly with === LOCAL SEO STRATEGY ===.";

$payload = json_encode([
    'model' => 'claude-sonnet-4-20250514',
    'max_tokens' => 8000,
    'messages' => [
        ['role' => 'user', 'content' => $prompt]
    ]
]);

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 120,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'x-api-key: ' . $apiKey,
        'anthropic-version: 2023-06-01',
    ],
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to connect to AI service.']);
    exit;
}

if ($httpCode !== 200) {
    http_response_code(500);
    echo json_encode(['error' => 'AI service returned an error. Please try again.']);
    exit;
}

$data = json_decode($response, true);

if (!isset($data['content'][0]['text'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Unexpected response format.']);
    exit;
}

echo json_encode(['content' => $data['content'][0]['text']]);
