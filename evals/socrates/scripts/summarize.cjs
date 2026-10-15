const fs=require("fs"),os=require("os"),path=require("path");
// Anonymize before printing: sandbox (dir holding runs/) → <sandbox>, $HOME → ~, user/host → user/host, URL passwords → ****.
const sb=path.dirname(path.dirname(path.resolve(process.argv[2]))),esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
const subs=[...new Set([fs.realpathSync(sb),sb])].map(p=>[new RegExp(esc(p),"g"),"<sandbox>"]).concat([...new Set([fs.realpathSync(os.homedir()),os.homedir()])].map(p=>[new RegExp(esc(p),"g"),"~"]),
  [[new RegExp("\\b"+esc(os.userInfo().username)+"\\b","g"),"user"],[new RegExp(esc(os.hostname().split(".")[0]),"gi"),"host"],[/(:\/\/[^:\/\s@]+:)[^@\s]+@/g,"$1****@"]]);
const S=s=>subs.reduce((s,[r,t])=>s.replace(r,t),String(s)),log=(...a)=>console.log(S(a.join(" ")));
for(const l of fs.readFileSync(process.argv[2],"utf8").split("\n").filter(Boolean)){const m=JSON.parse(l);
if(m.type==="assistant")for(const c of m.message.content){if(c.type==="tool_use")log("TOOL",c.name,S(JSON.stringify(c.input)).slice(0,200));if(c.type==="text")log("TEXT:",c.text)}
if(m.type==="user")for(const c of (m.message.content||[]))if(c.type==="tool_result"){const t=typeof c.content==="string"?c.content:JSON.stringify(c.content);log("RESULT",(c.is_error?"ERR ":""),S(t).slice(0,150))}
if(m.type==="result")log("RESULT_FINAL",m.subtype,m.num_turns,m.total_cost_usd)}
