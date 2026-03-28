import{u as h,r as l,j as e,L as y,B as d}from"./index-DCbxfo6q.js";import{B as D}from"./page-nav-yXPABsAw.js";import{I as v}from"./input-BEaNHdrw.js";import{G as w}from"./glass-card-CJcyVAup.js";import{S as k}from"./shield-CpQhAjRY.js";import{m as i}from"./proxy-WMaRvxnK.js";import{C as n}from"./code-CGTeO2gL.js";import{S as E}from"./search-I5JjKDLT.js";import{C as m}from"./coins-YRqDkMvq.js";import{T as S}from"./terminal-BrGMNIU3.js";import{I as j}from"./image-StcZfnra.js";import{G as V}from"./globe-C7Ew0rDu.js";import{C}from"./check-DIO4WlsE.js";import{C as T}from"./copy-DaJ-55Dc.js";import"./arrow-left-fm6rkixx.js";import"./lock-BKD9zSpL.js";const I=[{id:"connect-wallet",title:"Connect Wallet",description:"Initialize and connect to Trust Layer wallet",language:"javascript",category:"wallet",code:`import { DarkWaveSDK } from '@darkwave/sdk';

const sdk = new DarkWaveSDK({ network: 'mainnet' });

// Create a new wallet
const wallet = await sdk.createWallet();
console.log('Address:', wallet.address);

// Or connect existing wallet
const connected = await sdk.connect();`},{id:"get-balance",title:"Get Wallet Balance",description:"Fetch balance for any wallet address",language:"javascript",category:"wallet",code:`const balance = await sdk.getBalance(walletAddress);
console.log('Balance:', balance.sig, 'SIG');
console.log('USD Value:', balance.usd);`},{id:"send-transaction",title:"Send Transaction",description:"Transfer SIG to another wallet",language:"javascript",category:"transactions",code:`const tx = await sdk.sendTransaction({
  to: '0xRecipientAddress...',
  amount: '100', // SIG amount
  memo: 'Payment for services'
});

console.log('TX Hash:', tx.hash);
console.log('Status:', tx.status);`},{id:"stake-tokens",title:"Stake SIG Tokens",description:"Stake tokens to earn rewards",language:"javascript",category:"staking",code:`// Stake SIG tokens
const stake = await sdk.staking.stake({
  amount: '1000',
  tier: 'gold', // bronze, silver, gold, platinum
  lockPeriod: 30 // days
});

// Check staking rewards
const rewards = await sdk.staking.getRewards(walletAddress);
console.log('Pending Rewards:', rewards.pending);`},{id:"mint-nft",title:"Mint NFT",description:"Create and mint a new NFT",language:"javascript",category:"nft",code:`const nft = await sdk.nft.mint({
  name: 'My Awesome NFT',
  description: 'A unique digital collectible',
  image: imageFile, // File or URL
  attributes: [
    { trait_type: 'Rarity', value: 'Legendary' },
    { trait_type: 'Power', value: 100 }
  ],
  royalties: 5 // 5% royalties
});

console.log('NFT Token ID:', nft.tokenId);`},{id:"bridge-tokens",title:"Bridge to Ethereum",description:"Bridge SIG to wSIG on Ethereum",language:"javascript",category:"bridge",code:`// Lock SIG and mint wSIG on Ethereum
const bridge = await sdk.bridge.lock({
  amount: '500',
  targetChain: 'ethereum',
  recipientAddress: '0xEthereumAddress...'
});

// Track bridge status
const status = await sdk.bridge.getStatus(bridge.id);
console.log('Bridge Status:', status);`},{id:"api-blocks",title:"Fetch Blocks (REST)",description:"Get recent blocks via REST API",language:"curl",category:"api",code:`curl -X GET "https://api.darkwavechain.io/v1/blocks?limit=10" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`},{id:"api-transactions",title:"Get Transactions (REST)",description:"Fetch transaction history",language:"curl",category:"api",code:`curl -X GET "https://api.darkwavechain.io/v1/transactions" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"address": "DW7a8f9c3b2e...", "limit": 50}'`},{id:"python-sdk",title:"Python SDK Setup",description:"Initialize Trust Layer Python SDK",language:"python",category:"api",code:`from darkwave import DarkWaveSDK

sdk = DarkWaveSDK(
    network="mainnet",
    api_key="your-api-key"
)

# Get wallet balance
balance = sdk.get_balance("DW7a8f9c3b2e...")
print(f"Balance: {balance['sig']} SIG")

# Send transaction
tx = sdk.send_transaction(
    to="DWrecipient...",
    amount="50",
    private_key=private_key
)`},{id:"websocket",title:"WebSocket Subscription",description:"Subscribe to real-time events",language:"javascript",category:"api",code:`const ws = new WebSocket('wss://ws.darkwavechain.io');

ws.onopen = () => {
  // Subscribe to new blocks
  ws.send(JSON.stringify({
    type: 'subscribe',
    channel: 'blocks'
  }));
  
  // Subscribe to specific address
  ws.send(JSON.stringify({
    type: 'subscribe',
    channel: 'account',
    address: 'DW7a8f9c3b2e...'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Event:', data);
};`}],G={javascript:"from-teal-500 to-cyan-500",python:"from-blue-500 to-green-500",curl:"from-gray-500 to-gray-700",solidity:"from-purple-500 to-pink-500"};function X(){const{toast:u}=h(),[s,p]=l.useState(""),[r,N]=l.useState("all"),[b,o]=l.useState(null),g=async(t,a)=>{await navigator.clipboard.writeText(a),o(t),u({title:"Code Copied",description:"Snippet copied to clipboard"}),setTimeout(()=>o(null),2e3)},c=I.filter(t=>{const a=!s||t.title.toLowerCase().includes(s.toLowerCase())||t.description.toLowerCase().includes(s.toLowerCase()),x=r==="all"||t.category===r;return a&&x}),f=[{id:"all",label:"All",icon:n},{id:"wallet",label:"Wallet",icon:m},{id:"transactions",label:"Transactions",icon:S},{id:"staking",label:"Staking",icon:m},{id:"nft",label:"NFTs",icon:j},{id:"api",label:"API",icon:V}];return e.jsxDEV("div",{className:"min-h-screen flex flex-col bg-background",children:[e.jsxDEV("nav",{className:"fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl",children:e.jsxDEV("div",{className:"container mx-auto px-4 h-14 flex items-center justify-between",children:[e.jsxDEV(y,{href:"/",className:"flex items-center gap-2",children:[e.jsxDEV(k,{className:"w-7 h-7 text-cyan-400"},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:234,columnNumber:13},this),e.jsxDEV("span",{className:"font-display font-bold text-lg hidden sm:inline",children:"Trust Layer"},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:235,columnNumber:13},this)]},void 0,!0,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:233,columnNumber:11},this),e.jsxDEV(D,{},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:237,columnNumber:11},this)]},void 0,!0,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:232,columnNumber:9},this)},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:231,columnNumber:7},this),e.jsxDEV("main",{className:"flex-1 pt-20 pb-8 px-4",children:e.jsxDEV("div",{className:"container mx-auto max-w-4xl",children:[e.jsxDEV(i.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"text-center mb-8",children:[e.jsxDEV("div",{className:"flex items-center justify-center gap-3 mb-3",children:[e.jsxDEV(n,{className:"w-8 h-8 text-primary"},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:249,columnNumber:15},this),e.jsxDEV("h1",{className:"text-3xl font-display font-bold","data-testid":"text-title",children:"Code Snippets"},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:250,columnNumber:15},this)]},void 0,!0,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:248,columnNumber:13},this),e.jsxDEV("p",{className:"text-muted-foreground",children:"Copy-paste examples to get started quickly"},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:252,columnNumber:13},this)]},void 0,!0,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:243,columnNumber:11},this),e.jsxDEV(i.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.1},className:"flex flex-col sm:flex-row gap-4 mb-6",children:e.jsxDEV("div",{className:"relative flex-1",children:[e.jsxDEV(E,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:262,columnNumber:15},this),e.jsxDEV(v,{placeholder:"Search snippets...",value:s,onChange:t=>p(t.target.value),className:"pl-10","data-testid":"input-search"},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:263,columnNumber:15},this)]},void 0,!0,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:261,columnNumber:13},this)},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:255,columnNumber:11},this),e.jsxDEV(i.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.15},className:"flex flex-wrap gap-2 mb-6",children:f.map(t=>e.jsxDEV(d,{variant:r===t.id?"default":"outline",size:"sm",onClick:()=>N(t.id),className:"gap-1","data-testid":`button-category-${t.id}`,children:[e.jsxDEV(t.icon,{className:"w-3 h-3"},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:288,columnNumber:17},this),t.label]},t.id,!0,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:280,columnNumber:15},this))},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:273,columnNumber:11},this),e.jsxDEV(i.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.2},className:"space-y-4",children:[c.map((t,a)=>e.jsxDEV(w,{className:"overflow-hidden","data-testid":`snippet-${t.id}`,children:[e.jsxDEV("div",{className:"p-4 border-b border-white/10",children:e.jsxDEV("div",{className:"flex items-start justify-between",children:[e.jsxDEV("div",{children:[e.jsxDEV("div",{className:"flex items-center gap-2 mb-1",children:[e.jsxDEV("h3",{className:"font-semibold",children:t.title},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:306,columnNumber:25},this),e.jsxDEV("span",{className:`text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r ${G[t.language]} text-white`,children:t.language},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:307,columnNumber:25},this)]},void 0,!0,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:305,columnNumber:23},this),e.jsxDEV("p",{className:"text-sm text-muted-foreground",children:t.description},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:311,columnNumber:23},this)]},void 0,!0,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:304,columnNumber:21},this),e.jsxDEV(d,{variant:"ghost",size:"sm",onClick:()=>g(t.id,t.code),"data-testid":`button-copy-${t.id}`,children:b===t.id?e.jsxDEV(C,{className:"w-4 h-4 text-green-400"},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:320,columnNumber:25},this):e.jsxDEV(T,{className:"w-4 h-4"},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:322,columnNumber:25},this)},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:313,columnNumber:21},this)]},void 0,!0,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:303,columnNumber:19},this)},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:302,columnNumber:17},this),e.jsxDEV("pre",{className:"p-4 bg-black/50 overflow-x-auto",children:e.jsxDEV("code",{className:"text-xs text-gray-300",children:t.code},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:328,columnNumber:19},this)},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:327,columnNumber:17},this)]},t.id,!0,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:301,columnNumber:15},this)),c.length===0&&e.jsxDEV("div",{className:"text-center py-12 text-muted-foreground",children:[e.jsxDEV(n,{className:"w-12 h-12 mx-auto mb-3 opacity-30"},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:335,columnNumber:17},this),e.jsxDEV("p",{children:"No snippets found"},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:336,columnNumber:17},this),e.jsxDEV("p",{className:"text-xs mt-1",children:"Try a different search or category"},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:337,columnNumber:17},this)]},void 0,!0,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:334,columnNumber:15},this)]},void 0,!0,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:294,columnNumber:11},this)]},void 0,!0,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:242,columnNumber:9},this)},void 0,!1,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:241,columnNumber:7},this)]},void 0,!0,{fileName:"D:/trust-layer/client/src/pages/code-snippets.tsx",lineNumber:230,columnNumber:5},this)}export{X as default};
