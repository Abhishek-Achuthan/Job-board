// A small job board: a JSON API and one page. Run with `npm start`.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { loadJobs, searchJobs, findJob } from "./lib/jobs.js";
import { loadSavedJobs, removeSavedJob, saveJob } from "./lib/saved-jobs.js";

const PORT = Number(process.env.PORT ?? 3000);

function sendJson(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

async function readJsonBody(req) {
  return new Promise((res, rej) => {

    let body = '';

    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        res(JSON.parse(body));
      } catch (error) {
        rej(new Error('Invalid JSON'))
      }
    });

    req.on('error', rej);
  })
}

export function createApp() {
  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://localhost");

      if (req.method === "GET" && url.pathname === "/api/jobs") {
        const jobs = await loadJobs();
        return sendJson(res, 200, searchJobs(jobs, url.searchParams.get("q")));
      }

      const staticFiles = {
        '/': { file: 'index.html', type: 'text/html' },
        '/app.js': { file: 'app.js', type: 'text/javascript' },
        '/index.css': { file: 'index.css', type: 'text/css' }
      };

      if (req.method === 'GET' && staticFiles[url.pathname]) {
        const { file, type } = staticFiles[url.pathname];

        const body = await readFile(new URL(`./public/${file}`, import.meta.url));

        res.writeHead(200, {
          "content-type": `${type}; charset=utf-8`
        });

        return res.end(body);
      }

      if (req.method === 'GET' && url.pathname === '/api/saved') {

        const savedIds = await loadSavedJobs();

        const jobs = await loadJobs();

        const savedJobs = savedIds.map((id) => findJob(jobs, id));

        return sendJson(res, 200, savedJobs);
      }

      if (req.method === 'POST' && url.pathname === '/api/saved') {
        let body;

        try {
          body = await readJsonBody(req);
        } catch {
          return sendJson(res, 400, { error: 'Invalid JSON body' });
        }

        if (!body ||
          typeof body !== 'object' ||
          Array.isArray(body) ||
          typeof body.jobId !== 'string' ||
          !body.jobId.trim()) {
          return sendJson(res, 400, { error: 'Job id is required' });
        };

        const id = body.jobId;

        const jobs = await loadJobs();

        const job = findJob(jobs, id);

        if (!job) {
          return sendJson(res, 404, { error: 'job not found' });
        };

        await saveJob(id);

        return sendJson(res, 201, { message: 'Job saved successfully', job });
      }

      if (req.method === 'DELETE' && url.pathname.startsWith('/api/saved/')) {
        const id = url.pathname.split('/')[3];

        if (!id) {
          return sendJson(res, 400, { error: 'Missing id' });
        }

        await removeSavedJob(id);

        res.writeHead(204);

        return res.end();
      }

      sendJson(res, 404, { error: "Not found" });
    } catch (err) {

      console.error(err);

      sendJson(res, 500, { error: "Something went wrong" });
    }
  });
}

// Started directly (npm start), not imported by a test.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createApp().listen(PORT, () => console.log(`Job board on http://localhost:${PORT}`));
}
