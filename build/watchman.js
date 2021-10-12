#! /usr/bin/env node
import{createInterface}from"readline";import{readFileSync,watch,writeFile}from"fs";import chalk from"chalk";import{config as config$1}from"dotenv";import fetch from"node-fetch";function explainStatusCode(e){let o="";switch(e<200?o+="Informational response\n":e<300?o+="Successful response\n":e<400?o+="Redirects\n":e<500?o+="Client error\n":e<600&&(o+="Server error\n"),e){case 300:o+="Multiple Choice\n",o+="The request has more than one possible response";break;case 400:o+="Bad Request\n",o+="The server could not understand the request due to invalid syntax.";break;case 401:o+="Unauthorized\n",o+="Although the HTTP standard specifies 'unauthorized', semantically this response means 'unauthenticated'. That is, the client must authenticate itself to get the requested response.";break;case 402:o+="Payment Required\n",o+="This response code is reserved for future use. The initial aim for creating this code was using it for digital payment systems, however this status code is used very rarely and no standard convention exists.";break;case 403:o+="Forbidden\n",o+="The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401, the client's identity is known to the server.";break;case 404:o+="Not Found\n",o+="The server can not find the requested resource. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client.";break;case 405:o+="Method Not Allowed\n",o+="The request method is known by the server but is not supported by the target resource. For example, an API may forbid DELETE-ing a resource.";break;case 406:o+="Not Acceptable\n",o+="This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent.";break;case 407:o+="Proxy Authentication Required\n",o+="This is similar to 401 but authentication is needed to be done by a proxy.";break;case 408:o+="Request Timeout\n",o+="This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.";break;case 409:o+="Conflict\n",o+="This response is sent when a request conflicts with the current state of the server.";break;case 410:o+="Gone\n",o+="This response is sent when the requested content has been permanently deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource.";break;case 411:o+="Length Required\n",o+="Server rejected the request because the Content-Length header field is not defined and the server requires it.";break;case 415:o+="Unsupported Media Type\n",o+="The media format of the requested data is not supported by the server, so the server is rejecting the request.";break;case 421:o+="Misdirected Request\n",o+="The request was directed at a server that is not able to produce a response. This can be sent by a server that is not configured to produce responses for the combination of scheme and authority that are included in the request URI.";break;case 423:o+="Locked (WebDAV)\n",o+="The resource that is being accessed is locked.";break;case 426:o+="Upgrade Required\n",o+="The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. The server sends an Upgrade header in a 426 response to indicate the required protocol(s).";break;case 429:o+="Too Many Requests\n",o+="The user has sent too many requests in a given amount of time";break;case 451:o+="Unavailable For Legal Reasons\n",o+="The user-agent requested a resource that cannot legally be provided, such as a web page censored by a government.";break;case 500:o+="Internal Server Error\n",o+="The server has encountered a situation it doesn't know how to handle.";break;case 501:o+="Not Implemented\n",o+="The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.";break;case 502:o+="Bad Gateway\n",o+="This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.";break;case 503:o+="Service Unavailable\n",o+="The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This response should be used for temporary conditions and the Retry-After: HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.";break;case 504:o+="Gateway Timeout\n",o+="This error response is given when the server is acting as a gateway and cannot get a response in time";break;case 505:o+="HTTP Version Not Supported\n",o+="The HTTP version used in the request is not supported by the server.";break;case 506:o+="Variant Also Negotiates\n",o+="The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.";break;case 507:o+="Insufficient Storage (WebDAV)\n",o+="The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.";break;case 508:o+="Loop Detected (WebDAV)\n",o+="The server detected an infinite loop while processing the request.";break;case 511:o+="Network Authentication Required\n",o+="The 511 status code indicates that the client needs to authenticate to gain network access.";break;case 510:o+="Not Extended\n",o+="Further extensions to the request are required for the server to fulfill it."}return o}const{red,green,grey,inverse}=chalk;function write(e,o){writeFile(o,JSON.stringify(e),"utf8",e=>{e&&(console.error("couldn't write to config.json"),console.error(e))})}function loadJson(e){e=readFileSync(new URL(e,import.meta.url));return JSON.parse(e)}async function request(e,o,t,n){log(grey(`fetching ${e}`));var s=(new Date).getTime();let r={...o};delete r.body,["PUT","POST","PATCH"].includes(o.method)&&(r.body=JSON.stringify(o.body));const i=await fetch(e,r).catch(handleFetchErrors.bind({link:e,exitAfter:n}));i&&(i.ok?(log(green(`server responded with status ${inverse(i.status)}`)),(e=await i[t]().catch(handleFetchErrors.bind({link:e})))&&log(e)):(log(red(`server responded with status ${inverse(i.status)}`)),log(o),a=explainStatusCode(i.status),log(a)));var a=(new Date).getTime();if(log(grey(`fetch ended in ${(a-s)/1e3}s`)),n)return process.exit()}function handleFetchErrors(e){log(red(e.name)),log(`type : ${e.type}`),log(e.message),this.exitAfter||"invalid-json"===e.type&&(log(grey("fetching as text instead")),request(this.link,options,"text",this.exitAfter))}function watchPath(e){log(grey(`watching ${e}`));let t=!1;watch(e,(e,o)=>{t||(t=!0,log(grey(`dectected ${e} on ${o}`)),setTimeout(()=>{t=!1,fetchLink("def")},config.delay))})}function generateTags(){let e=["opt","header","load","set","log","https://","http://","clear","rm","config","POST","GET","body","DELETE","PUT","help","exit","quit",config[config.def]];return e=e.concat(Object.keys(config)),e=e.concat(Object.keys(options)),e=e.concat(Object.keys(options.headers)),e=e.concat(Object.keys(options.body)),e}const{red:red$1,green:green$1,grey:grey$1}=chalk;function figureCommand(e){const o=processLine(e);var t=o.shift();switch(t){case"opt":changeOptions(o);break;case"body":changeBody(o);break;case"header":changeHeader(o);break;case"load":loadEnv(o[0],o[1],o[2]);break;case"set":changeConfig(o);break;case"log":log$1(o);break;case"clear":console.clear();break;case"rm":remove(o);break;case"help":help();break;case"exit":process.exit();case"quit":process.exit();default:fetchLink(t)}}function processLine(e){let o=[];return(e=e.trim().split(" ")).forEach(e=>{""!=e&&o.push(e)}),o}function fetchLink(e){if(e.startsWith("http"))return request(e,options,config.type);if("def"==e){if(config.def.startsWith("http"))return request(config.def,options,config.type);if(!config[config.def])return console.log(red$1(`def ${config.def} is not defined!`));e=config.def}if(!config[e]&&e)return console.log(red$1(`${e} not defined!`));null!=e&&request(config[e],options,config.type)}function remove(e){switch(e.shift()){case"opt":e.forEach(e=>null==options[e]?console.log(red$1(`${e} not defined in options`)):(delete options[e],write(options,new URL("options.json",import.meta.url)),void console.log(grey$1(`removed ${e} from options`))));break;case"config":e.forEach(e=>null==config[e]?console.log(red$1(`${e} not defined in config`)):(delete config[e],write(config,new URL("config.json",import.meta.url)),void console.log(grey$1(`removed ${e} from config`))));break;case"header":e.forEach(e=>null==options.headers[e]?console.log(red$1(`${e} not defined in header`)):(delete options.headers[e],write(options,new URL("options.json",import.meta.url)),void console.log(grey$1(`removed ${e} from header`))));break;case"body":e.forEach(e=>null==options.body[e]?console.log(red$1(`${e} not defined in body`)):(delete options.body[e],write(options,new URL("options.json",import.meta.url)),void console.log(grey$1(`removed ${e} from body`))));break;default:console.log(red$1("no such objects"))}}function help(e){var o=readFileSync(new URL("../help.txt",import.meta.url),"utf8");console.log(o),e&&process.exit()}function log$1(e,o){switch(e[0]){case"opt":options[e[1]]?console.log(options[e[1]]):console.log(options);break;case"header":options.headers[e[1]]?console.log(options.headers[e[1]]):console.log(options.headers);break;case"body":options.body[e[1]]?console.log(options.body[e[1]]):console.log(options.body);break;default:config[e[0]]?console.log(config[e[0]]):console.log(config)}o&&process.exit()}function loadEnv(e,o,t){if(config$1(),!process.env[e])return console.log(red$1(`key ${e} is not defined in .env`));switch(console.log(grey$1(`loaded ${e} : ${process.env[e]}`)),o){case"config":changeConfig([t,process.env[e]]);break;case"opt":changeOptions([t,process.env[e]]);break;case"header":changeHeader([t,process.env[e]]);break;case"body":changeBody([t,process.env[e]]);break;default:console.log(red$1(`${o} not defined!`))}}function changeOptions(e){if(!e.length)return log$1(["opt"]);var o=e.shift();if(!e.length)return console.log(options[o]);e=e.join(" ");options[o]=e,write(options,new URL("options.json",import.meta.url)),console.log(green$1(`${o} : ${e} (option)`)),global.completions.push(o)}function changeConfig(e){if(!e.length)return log$1([]);var o=e.shift();if(!e.length)return console.log(config[o]);e=e.join(" ");config[o]=e,write(config,new URL("config.json",import.meta.url)),console.log(green$1(`${o} : ${e} (config)`)),"def"==o?global.completions=generateTags():global.completions.push(o)}function changeHeader(e){if(!e.length)return log$1(["header"]);var o=e.shift();if(!e.length)return console.log(options.headers[o]);e=e.join(" ");options.headers[o]=e,write(options,new URL("options.json",import.meta.url)),console.log(green$1(`${o} : ${e} (header)`)),global.completions.push(o)}function changeBody(e){if(!e.length)return log$1(["body"]);var o=e.shift();if(!e.length)return console.log(options.body[o]);e=e.join(" ");options.body[o]=e,write(options,new URL("options.json",import.meta.url)),console.log(green$1(`${o} : ${e} (body)`)),global.completions.push(o)}global.config=loadJson("../config.json"),global.options=loadJson("../options.json");const rl=createInterface({input:process.stdin,output:process.stdout,completer:completer,terminal:!0});globalThis.log=e=>console.log(e);const args=process.argv.slice(2);let path_to_watch=process.cwd();function checkArgs(e){var o=args.shift();switch(o){case"-h":help(!0),e=!0;break;case"-l":log$1([args.shift()]);break;case"-p":path_to_watch=args.shift(),e=!0,init();break;default:console.log(`invalid arg ${o}\nuse -h for help`)}return args.length?checkArgs(e):e?void 0:process.exit()}function init(){console.log("API-WATCHMAN"),watchPath(path_to_watch),global.completions=generateTags(),fetchLink("def"),read()}function read(){rl.on("line",e=>{e&&figureCommand(e)})}function completer(e){const o=e.split(" ").pop();e=completions.filter(e=>e.startsWith(o));return[e.length?e:completions,o]}args.length?checkArgs(!1):init();
