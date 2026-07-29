import server from '../dist/server/server.js';

export default async function handler(req, res) {
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host || 'localhost';
  const requestUrl = new URL(req.url || '/', `${protocol}://${host}`);

  const bodyChunks = [];
  for await (const chunk of req) {
    bodyChunks.push(chunk);
  }

  const request = new Request(requestUrl.toString(), {
    method: req.method,
    headers: req.headers,
    body: bodyChunks.length ? Buffer.concat(bodyChunks) : undefined,
  });

  const response = await server.fetch(request, undefined, undefined);

  res.status(response.status);
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === 'transfer-encoding') return;
    res.setHeader(key, value);
  });

  const responseBody = await response.arrayBuffer();
  res.send(Buffer.from(responseBody));
}
