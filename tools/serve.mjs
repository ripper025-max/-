import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,relative,extname,isAbsolute} from 'node:path';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const arg=process.argv.indexOf('--port');
const port=Number(arg>=0?process.argv[arg+1]:process.env.PORT||4173);
if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Port must be between 1 and 65535.');
const mime={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.txt':'text/plain; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
 try{
  const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const file=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  const rel=relative(root,file);
  if(rel.startsWith('..')||isAbsolute(rel)||rel.split(/[\\/]/).some(p=>p.startsWith('.'))){res.writeHead(403);res.end('Forbidden');return;}
  const body=await readFile(file);
  res.writeHead(200,{'Content-Type':mime[extname(file)]||'application/octet-stream','Content-Length':body.length,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(req.method==='HEAD'?undefined:body);
 }catch(error){res.writeHead(error instanceof URIError?400:404);res.end('Not found');}
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is busy. Try: npm start -- --port 4174`:error.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>console.log(`EMBERFALL: http://127.0.0.1:${port}\nEdit dist/ files, save, then refresh your browser. Ctrl+C stops the server.`));
