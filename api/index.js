import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import server from '../dist/server/server.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_ASSETS_DIR = path.join(__dirname, '..', 'dist', 'client', 'assets');
const PUBLIC_FILES = new Set(['/favicon.ico', '/robots.txt']);

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function getMimeType(filePath) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

export default async function handler(req, res) {
  try {
    let rawUrl = req.url || '/';
    if (rawUrl.startsWith('/api/index')) {
      rawUrl = rawUrl.replace(/^\/api\/index/, '') || '/';
    }
    if (!rawUrl.startsWith('/')) {
      rawUrl = '/' + rawUrl;
    }

    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers.host || 'localhost';
    const requestUrl = new URL(rawUrl, `${protocol}://${host}`);
    const pathname = requestUrl.pathname;

    if (PUBLIC_FILES.has(pathname) || pathname.startsWith('/assets/')) {
      const filePath = pathname === '/favicon.ico' || pathname === '/robots.txt'
        ? path.join(__dirname, '..', pathname)
        : path.join(CLIENT_ASSETS_DIR, pathname.slice('/assets/'.length));

      try {
        const file = await fs.readFile(filePath);
        res.status(200);
        res.setHeader('content-type', getMimeType(filePath));
        return res.send(file);
      } catch (error) {
        return res.status(404).send('Not found');
      }
    }

    const bodyChunks = [];
    for await (const chunk of req) {
      bodyChunks.push(chunk);
    }

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined && key !== 'connection' && key !== 'transfer-encoding') {
        if (Array.isArray(value)) {
          for (const v of value) headers.append(key, v);
        } else {
          headers.set(key, value);
        }
      }
    }

    const isGetOrHead = req.method === 'GET' || req.method === 'HEAD';
    const request = new Request(requestUrl.toString(), {
      method: req.method,
      headers: headers,
      body: (!isGetOrHead && bodyChunks.length > 0) ? Buffer.concat(bodyChunks) : undefined,
    });

    const response = await server.fetch(request, undefined, undefined);

    res.status(response.status);
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'transfer-encoding') return;
      res.setHeader(key, value);
    });

    const responseBody = await response.arrayBuffer();
    return res.send(Buffer.from(responseBody));
  } catch (err) {
    console.error('Vercel Handler Error:', err);
    res.status(500);
    res.setHeader('content-type', 'text/html; charset=utf-8');
    return res.send(`<h1>Server Error</h1><pre>${err?.stack || err?.message || err}</pre>`);
  }
}
