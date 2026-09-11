import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const cwd=fileURLToPath(new URL('../',import.meta.url));
for(const test of ['verify','upgrade-v2','arsenal','open-world','builds']){
 const run=spawnSync(process.execPath,[`tests/${test}.mjs`],{cwd,stdio:'inherit'});
 if(run.error){console.error(run.error.message);process.exit(1);}
 if(run.status!==0)process.exit(run.status||1);
}
