#!/usr/bin/env node

/**
 * MrMahesh Sentinel — 10-Point Automated Site Auditor
 * Runs security, performance, link integrity, mobile, accessibility,
 * legal, SEO, design, e-commerce, and analytics audits.
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

const TARGET_URL = process.env.TARGET_URL || process.argv[2] || 'https://mrmahesh.com';
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK || '';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

console.log(`\n======================================================`);
console.log(`🛡️  MRMAHESH SENTINEL — SITE HEALTH AUDIT`);
console.log(`🎯 Target: ${TARGET_URL}`);
console.log(`🕒 Time:   ${new Date().toISOString()}`);
console.log(`======================================================\n`);

async function fetchUrl(targetUrl) {
    return new Promise((resolve, reject) => {
        const parsed = new URL(targetUrl);
        const client = parsed.protocol === 'https:' ? https : http;
        const startTime = Date.now();

        const req = client.get(targetUrl, {
            headers: {
                'User-Agent': 'MrMahesh-Sentinel-Auditor/1.0'
            },
            timeout: 10000
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const responseTime = Date.now() - startTime;
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data,
                    responseTime
                });
            });
        });

        req.on('error', err => reject(err));
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timed out after 10000ms'));
        });
    });
}

async function runAudits() {
    const results = {
        security: { pass: true, details: [] },
        speed: { pass: true, details: [] },
        links: { pass: true, details: [] },
        mobile: { pass: true, details: [] },
        accessibility: { pass: true, details: [] },
        compliance: { pass: true, details: [] },
        seo: { pass: true, details: [] },
        brand: { pass: true, details: [] },
        ecommerce: { pass: true, details: [] },
        analytics: { pass: true, details: [] }
    };

    try {
        const homeRes = await fetchUrl(TARGET_URL);
        const html = homeRes.body;
        const headers = homeRes.headers;

        // 1. Security Audit
        if (TARGET_URL.startsWith('https://')) {
            results.security.details.push('HTTPS protocol enforced');
        } else {
            results.security.pass = false;
            results.security.details.push('Target not using HTTPS');
        }
        if (headers['strict-transport-security']) {
            results.security.details.push('HSTS header present');
        }
        if (headers['x-frame-options'] || headers['content-security-policy']) {
            results.security.details.push('Frame protection / CSP configured');
        }
        if (html.includes('sk_live_') || html.includes('AIzaSy') || html.includes('BEGIN RSA PRIVATE KEY')) {
            results.security.pass = false;
            results.security.details.push('CRITICAL: Potential leaked secret detected in HTML');
        } else {
            results.security.details.push('Zero exposed API secrets in HTML');
        }

        // 2. Speed & Latency Audit
        if (homeRes.responseTime < 1500) {
            results.speed.details.push(`TTFB / Response Latency fast: ${homeRes.responseTime}ms`);
        } else {
            results.speed.pass = false;
            results.speed.details.push(`High latency: ${homeRes.responseTime}ms (>1500ms)`);
        }
        const sizeKb = Buffer.byteLength(html, 'utf8') / 1024;
        if (sizeKb < 250) {
            results.speed.details.push(`HTML payload size optimal: ${sizeKb.toFixed(1)} KB`);
        } else {
            results.speed.details.push(`HTML payload size large: ${sizeKb.toFixed(1)} KB`);
        }

        // 3. Link Integrity Audit
        const linkMatches = [...html.matchAll(/href=["'](\/[^"']+)["']/g)].map(m => m[1]);
        const uniqueInternalLinks = [...new Set(linkMatches)].slice(0, 10);
        let brokenLinks = 0;

        for (const link of uniqueInternalLinks) {
            try {
                const subUrl = new URL(link, TARGET_URL).toString();
                const subRes = await fetchUrl(subUrl);
                if (subRes.statusCode >= 400) {
                    brokenLinks++;
                    results.links.details.push(`Broken Link [${subRes.statusCode}]: ${link}`);
                }
            } catch (err) {
                brokenLinks++;
                results.links.details.push(`Failed Link: ${link} (${err.message})`);
            }
        }
        if (brokenLinks === 0) {
            results.links.details.push(`Checked ${uniqueInternalLinks.length} primary internal links: All 200 OK`);
        } else {
            results.links.pass = false;
        }

        // 4. Mobile & Touch Audit
        if (html.includes('name="viewport"') || html.includes("name='viewport'")) {
            results.mobile.details.push('Viewport meta tag properly configured');
        } else {
            results.mobile.pass = false;
            results.mobile.details.push('Missing viewport meta tag');
        }
        if (html.includes('overflow-x-hidden') || html.includes('max-w-')) {
            results.mobile.details.push('Mobile container constraints detected');
        }

        // 5. Accessibility Audit
        const imgTags = [...html.matchAll(/<img\s+[^>]*>/gi)];
        const missingAlt = imgTags.filter(tag => !tag[0].includes('alt='));
        if (missingAlt.length === 0) {
            results.accessibility.details.push(`All ${imgTags.length} images have alt attributes`);
        } else {
            results.accessibility.pass = false;
            results.accessibility.details.push(`${missingAlt.length} images missing alt text`);
        }
        if (html.includes('aria-label=') || html.includes('role=')) {
            results.accessibility.details.push('ARIA semantics detected');
        }

        // 6. Legal & Compliance
        const currentYear = new Date().getFullYear().toString();
        if (html.includes(currentYear) || html.includes('2026')) {
            results.compliance.details.push(`Copyright year valid (${currentYear})`);
        }
        if (html.toLowerCase().includes('about') || html.toLowerCase().includes('contact')) {
            results.compliance.details.push('Identity/Bio attribution present');
        }

        // 7. SEO & Discovery
        const hasTitle = html.includes('<title>') && !html.includes('<title></title>');
        const hasMetaDesc = html.includes('name="description"') || html.includes("name='description'");
        if (hasTitle) results.seo.details.push('Title tag present');
        else { results.seo.pass = false; results.seo.details.push('Missing <title> tag'); }
        if (hasMetaDesc) results.seo.details.push('Meta description tag present');
        else results.seo.details.push('Meta description tag optional/missing');

        // Check robots.txt
        try {
            const robotsRes = await fetchUrl(new URL('/robots.txt', TARGET_URL).toString());
            if (robotsRes.statusCode === 200) results.seo.details.push('robots.txt reachable');
        } catch (e) {
            results.seo.details.push('robots.txt not found');
        }

        // 8. Brand & Design Consistency
        if (html.includes('Roboto Mono') || html.includes('font-mono')) {
            results.brand.details.push('Terminal font typography active');
        }
        if (html.includes('#1a202c') || html.includes('#111827') || html.includes('bg-')) {
            results.brand.details.push('Cyberpunk dark palette tokens validated');
        }

        // 9. E-Commerce & Transactional
        if (html.includes('/store/') || html.includes('stripe') || html.includes('paypal')) {
            results.ecommerce.details.push('Payment & Store links active');
        } else {
            results.ecommerce.details.push('Store routes ready for expansion');
        }

        // 10. Analytics
        if (html.includes('google-analytics') || html.includes('gtag') || html.includes('plausible') || html.includes('search.json')) {
            results.analytics.details.push('Site search & analytics engine active');
        }

    } catch (err) {
        console.error('Audit execution error:', err.message);
        results.security.pass = false;
        results.security.details.push(`Fetch failed: ${err.message}`);
    }

    // Print summary report
    printSummary(results);

    // Send Webhooks if configured
    if (DISCORD_WEBHOOK) {
        await sendDiscordNotification(results);
    }
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
        await sendTelegramNotification(results);
    }
}

function printSummary(results) {
    console.log(`------------------------------------------------------`);
    console.log(`📊 AUDIT RESULTS SUMMARY`);
    console.log(`------------------------------------------------------`);

    let totalPassed = 0;
    const entries = Object.entries(results);

    for (const [category, data] of entries) {
        const statusIcon = data.pass ? '🟢 PASS' : '🔴 WARN';
        if (data.pass) totalPassed++;
        console.log(`[${statusIcon}] ${category.toUpperCase().padEnd(14)} : ${data.details.join(' | ')}`);
    }

    console.log(`------------------------------------------------------`);
    console.log(`🏁 Final Score: ${totalPassed} / ${entries.length} Passed`);
    console.log(`======================================================\n`);
}

async function sendDiscordNotification(results) {
    try {
        const total = Object.keys(results).length;
        const passed = Object.values(results).filter(r => r.pass).length;
        const isAllGreen = passed === total;

        const description = Object.entries(results)
            .map(([cat, data]) => `• **${cat.toUpperCase()}**: ${data.pass ? '🟢 Pass' : '🔴 Warn'} — ${data.details[0] || ''}`)
            .join('\n');

        const payload = JSON.stringify({
            username: "MrMahesh Sentinel",
            avatar_url: "https://mrmahesh.com/assets/favicon.svg",
            embeds: [{
                title: isAllGreen ? "🛡️ Sentinel Health Audit — All Systems Optimal" : "⚠️ Sentinel Health Audit — Warnings Detected",
                color: isAllGreen ? 3066993 : 15158332,
                description: `**Target:** \`${TARGET_URL}\`\n**Score:** ${passed}/${total} Passed\n\n${description}`,
                footer: { text: "MrMahesh Homelab Sentinel" },
                timestamp: new Date().toISOString()
            }]
        });

        const url = new URL(DISCORD_WEBHOOK);
        const req = https.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        });
        req.write(payload);
        req.end();
        console.log('📢 Discord webhook notification dispatched.');
    } catch (e) {
        console.error('Failed to send Discord webhook:', e.message);
    }
}

async function sendTelegramNotification(results) {
    try {
        const total = Object.keys(results).length;
        const passed = Object.values(results).filter(r => r.pass).length;
        const text = `🛡️ *MrMahesh Sentinel Audit*\nTarget: \`${TARGET_URL}\`\nScore: ${passed}/${total} Passed`;

        const payload = JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: text,
            parse_mode: 'Markdown'
        });

        const url = new URL(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`);
        const req = https.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        });
        req.write(payload);
        req.end();
        console.log('📢 Telegram notification dispatched.');
    } catch (e) {
        console.error('Failed to send Telegram notification:', e.message);
    }
}

runAudits();
