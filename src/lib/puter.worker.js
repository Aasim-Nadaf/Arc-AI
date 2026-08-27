/**
 * Puter Serverless Worker Reference for Perspective.ai
 * Handles project persistence in cloud KV
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // GET /api/projects
    if (url.pathname === '/api/projects' && method === 'GET') {
      const keys = await puter.kv.list('proj_');
      const projects = [];
      for (const key of keys || []) {
        const item = await puter.kv.get(key);
        if (item) projects.push(JSON.parse(item));
      }
      return new Response(JSON.stringify(projects), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET /api/projects/:id
    if (url.pathname.startsWith('/api/projects/') && method === 'GET') {
      const id = url.pathname.split('/').pop();
      const item = await puter.kv.get(`proj_${id}`);
      if (!item) {
        return new Response(JSON.stringify({ error: 'Project not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(item, {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST /api/projects
    if (url.pathname === '/api/projects' && method === 'POST') {
      const body = await request.json();
      const id = body.id || `proj_${Date.now()}`;
      const project = { ...body, id, timestamp: Date.now() };
      await puter.kv.set(`proj_${id}`, JSON.stringify(project));
      return new Response(JSON.stringify(project), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ status: 'Perspective.ai Worker running' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  },
};
