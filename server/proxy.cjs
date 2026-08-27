/**
 * AstroAssist AI — Insight Proxy Server
 *
 * Runs alongside the Vite dev server (port 3001).
 * Vite proxies /api/insight → http://localhost:3001/api/insight
 *
 * The HF_TOKEN secret is read from the Node process environment only.
 * It is NEVER sent to the browser or included in the Vite/React bundle.
 *
 * Start with: node --env-file=../.env server/proxy.cjs
 */

'use strict';

const express = require('express');

const app = express();
app.use(express.json());

const PORT = 3001;
const HF_ROUTER = 'https://router.huggingface.co/v1/chat/completions';
const MODEL = 'meta-llama/Llama-3.1-8B-Instruct';

const SYSTEM_PROMPT = `You are a space mission analyst. Produce concise, factual asteroid risk briefings for space operations teams. Rules:
- Use ONLY the data supplied in the user message.
- Do NOT invent asteroid names, dates, distances, diameters, velocities, or orbital details.
- Do NOT fabricate risk probabilities or impact scenarios.
- Distinguish "Potentially Hazardous Asteroid" (PHA — an orbit/size classification by NASA/JPL) from an actual imminent impact threat.
- If the supplied data is insufficient to draw a conclusion, say so explicitly.
- Be proportionate: do not catastrophise routine close approaches.`;

app.post('/api/insight', async (req, res) => {
  const token = process.env.HF_TOKEN;
  if (!token) {
    res.status(500).json({ error: 'HF_TOKEN is not configured on the server.' });
    return;
  }

  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    res.status(400).json({ error: 'Request body must contain a "prompt" string.' });
    return;
  }

  if (prompt.length > 4000) {
    res.status(400).json({ error: 'Prompt exceeds maximum allowed length.' });
    return;
  }

  let hfRes;
  try {
    hfRes = await fetch(HF_ROUTER, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ],
        max_tokens: 220,
        temperature: 0.2,
      }),
    });
  } catch (err) {
    console.error('[proxy] HF router fetch failed:', err.message);
    res.status(502).json({ error: 'Failed to reach Hugging Face Inference API.' });
    return;
  }

  if (!hfRes.ok) {
    const body = await hfRes.text().catch(() => '');
    console.error('[proxy] HF non-OK response:', hfRes.status, body.substring(0, 200));
    res.status(502).json({ error: 'Hugging Face Inference API returned an error (' + hfRes.status + ').' });
    return;
  }

  let data;
  try {
    data = await hfRes.json();
  } catch (err) {
    console.error('[proxy] Failed to parse HF response JSON:', err.message);
    res.status(502).json({ error: 'Invalid response from Hugging Face Inference API.' });
    return;
  }

  const content = data?.choices?.[0]?.message?.content ?? null;
  if (!content) {
    res.status(502).json({ error: 'Hugging Face returned an empty response.' });
    return;
  }

  res.json({ content });
});

// Health check
app.get('/api/insight/health', (_req, res) => {
  res.json({ status: 'ok', model: MODEL });
});

app.listen(PORT, () => {
  console.log('[proxy] AstroAssist insight proxy running on port', PORT);
  console.log('[proxy] Model:', MODEL);
  console.log('[proxy] HF_TOKEN present:', !!process.env.HF_TOKEN);
});
