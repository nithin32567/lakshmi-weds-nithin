import server from '../dist/server/server.js';

export default async function handler(req, res) {
  const { method, headers, url } = req;
  const body = [];

  for await (const chunk of req) {
    body.push(chunk);
  }

  const request = new Request(url, {
    method,
    headers,
    body: body.length ? Buffer.concat(body) : undefined,
  });

  const response = await server.fetch(request, undefined, undefined);

  res.status(response.status);
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const responseBody = await response.arrayBuffer();
  res.send(Buffer.from(responseBody));
}
