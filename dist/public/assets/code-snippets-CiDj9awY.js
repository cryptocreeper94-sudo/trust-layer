import{u as f,r as n,j as e,L as w,B as d}from"./index-DKfPRCvR.js";import{B as k}from"./page-nav-q9MXRP5z.js";import{I as S}from"./input-DFjrCMGx.js";import{G as j}from"./glass-card-CcMx083L.js";import{S as v}from"./shield-Dbo0Tzqv.js";import{m as i}from"./proxy-CIF2cl_1.js";import{C as r}from"./code-CXyivODS.js";import{S as N}from"./search-Bo2YimK4.js";import{C as m}from"./coins-CIuYyP1s.js";import{T as C}from"./terminal-JUg659B5.js";import{I as T}from"./image-xzhJr__Z.js";import{G as I}from"./globe-B4YEmPBW.js";import{C as G}from"./check-uvLHy9tJ.js";import{C as A}from"./copy-B0tPXYFZ.js";import"./arrow-left-DAbUySJG.js";import"./lock-CVJn6pjW.js";const D=[{id:"connect-wallet",title:"Connect Wallet",description:"Initialize and connect to Trust Layer wallet",language:"javascript",category:"wallet",code:`import { DarkWaveSDK } from '@darkwave/sdk';

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
};`}],E={javascript:"from-teal-500 to-cyan-500",python:"from-blue-500 to-green-500",curl:"from-gray-500 to-gray-700",solidity:"from-purple-500 to-pink-500"};function q(){const{toast:p}=f(),[a,g]=n.useState(""),[o,u]=n.useState("all"),[x,l]=n.useState(null),h=async(t,s)=>{await navigator.clipboard.writeText(s),l(t),p({title:"Code Copied",description:"Snippet copied to clipboard"}),setTimeout(()=>l(null),2e3)},c=D.filter(t=>{const s=!a||t.title.toLowerCase().includes(a.toLowerCase())||t.description.toLowerCase().includes(a.toLowerCase()),b=o==="all"||t.category===o;return s&&b}),y=[{id:"all",label:"All",icon:r},{id:"wallet",label:"Wallet",icon:m},{id:"transactions",label:"Transactions",icon:C},{id:"staking",label:"Staking",icon:m},{id:"nft",label:"NFTs",icon:T},{id:"api",label:"API",icon:I}];return e.jsxs("div",{className:"min-h-screen flex flex-col bg-background",children:[e.jsx("nav",{className:"fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/90 backdrop-blur-xl",children:e.jsxs("div",{className:"container mx-auto px-4 h-14 flex items-center justify-between",children:[e.jsxs(w,{href:"/",className:"flex items-center gap-2",children:[e.jsx(v,{className:"w-7 h-7 text-cyan-400"}),e.jsx("span",{className:"font-display font-bold text-lg hidden sm:inline",children:"Trust Layer"})]}),e.jsx(k,{})]})}),e.jsx("main",{className:"flex-1 pt-20 pb-8 px-4",children:e.jsxs("div",{className:"container mx-auto max-w-4xl",children:[e.jsxs(i.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"text-center mb-8",children:[e.jsxs("div",{className:"flex items-center justify-center gap-3 mb-3",children:[e.jsx(r,{className:"w-8 h-8 text-primary"}),e.jsx("h1",{className:"text-3xl font-display font-bold","data-testid":"text-title",children:"Code Snippets"})]}),e.jsx("p",{className:"text-muted-foreground",children:"Copy-paste examples to get started quickly"})]}),e.jsx(i.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.1},className:"flex flex-col sm:flex-row gap-4 mb-6",children:e.jsxs("div",{className:"relative flex-1",children:[e.jsx(N,{className:"absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"}),e.jsx(S,{placeholder:"Search snippets...",value:a,onChange:t=>g(t.target.value),className:"pl-10","data-testid":"input-search"})]})}),e.jsx(i.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.15},className:"flex flex-wrap gap-2 mb-6",children:y.map(t=>e.jsxs(d,{variant:o===t.id?"default":"outline",size:"sm",onClick:()=>u(t.id),className:"gap-1","data-testid":`button-category-${t.id}`,children:[e.jsx(t.icon,{className:"w-3 h-3"}),t.label]},t.id))}),e.jsxs(i.div,{initial:{opacity:0},animate:{opacity:1},transition:{delay:.2},className:"space-y-4",children:[c.map((t,s)=>e.jsxs(j,{className:"overflow-hidden","data-testid":`snippet-${t.id}`,children:[e.jsx("div",{className:"p-4 border-b border-white/10",children:e.jsxs("div",{className:"flex items-start justify-between",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[e.jsx("h3",{className:"font-semibold",children:t.title}),e.jsx("span",{className:`text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r ${E[t.language]} text-white`,children:t.language})]}),e.jsx("p",{className:"text-sm text-muted-foreground",children:t.description})]}),e.jsx(d,{variant:"ghost",size:"sm",onClick:()=>h(t.id,t.code),"data-testid":`button-copy-${t.id}`,children:x===t.id?e.jsx(G,{className:"w-4 h-4 text-green-400"}):e.jsx(A,{className:"w-4 h-4"})})]})}),e.jsx("pre",{className:"p-4 bg-black/50 overflow-x-auto",children:e.jsx("code",{className:"text-xs text-gray-300",children:t.code})})]},t.id)),c.length===0&&e.jsxs("div",{className:"text-center py-12 text-muted-foreground",children:[e.jsx(r,{className:"w-12 h-12 mx-auto mb-3 opacity-30"}),e.jsx("p",{children:"No snippets found"}),e.jsx("p",{className:"text-xs mt-1",children:"Try a different search or category"})]})]})]})})]})}export{q as default};
