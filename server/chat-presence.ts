import { Server as HttpServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import url from 'url';

type PresenceEntry = {
  userId: string;
  communityId: string;
  ws: WebSocket;
  lastSeen: number;
  typing?: boolean;
  status?: 'online' | 'idle' | 'dnd' | 'offline';
};

const PRESENCE_TTL = 60_000;

export function setupPresence(server: HttpServer) {
  const wss = new WebSocketServer({ noServer: true });
  const presences = new Map<string, Set<PresenceEntry>>();

  server.on('upgrade', (req, socket, head) => {
    const pathname = url.parse(req.url || '').pathname || '';
    if (pathname === '/chat') {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    } else {
      socket.destroy();
    }
  });

  function broadcastToCommunity(communityId: string, payload: any) {
    const set = presences.get(communityId);
    if (!set) return;
    for (const p of set) {
      if (p.ws.readyState === WebSocket.OPEN) {
        p.ws.send(JSON.stringify(payload));
      }
    }
  }

  wss.on('connection', (ws: WebSocket, req) => {
    const query = url.parse(req.url || '', true).query;
    const communityId = (query.community as string) || 'general';
    const userId = (query.user as string) || `anon-${Date.now()}`;

    const entry: PresenceEntry = { userId, communityId, ws, lastSeen: Date.now(), status: 'online' };
    if (!presences.has(communityId)) presences.set(communityId, new Set());
    presences.get(communityId)!.add(entry);

    broadcastToCommunity(communityId, { type: 'PRESENCE_UPDATE', payload: { userId, status: 'online' } });

    ws.on('message', (raw) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === 'TYPING_START') {
          entry.typing = true;
          broadcastToCommunity(communityId, { type: 'TYPING_START', payload: { userId } });
        } else if (msg.type === 'TYPING_STOP') {
          entry.typing = false;
          broadcastToCommunity(communityId, { type: 'TYPING_STOP', payload: { userId } });
        } else if (msg.type === 'HEARTBEAT') {
          entry.lastSeen = Date.now();
        }
      } catch (e) {
        // ignore
      }
    });

    ws.on('close', () => {
      presences.get(communityId)?.delete(entry);
      broadcastToCommunity(communityId, { type: 'PRESENCE_UPDATE', payload: { userId, status: 'offline' } });
    });

    const interval = setInterval(() => {
      const now = Date.now();
      for (const [cid, set] of presences.entries()) {
        for (const e of Array.from(set)) {
          if (now - e.lastSeen > PRESENCE_TTL * 3) {
            try { e.ws.terminate(); } catch {}
            set.delete(e);
            broadcastToCommunity(cid, { type: 'PRESENCE_UPDATE', payload: { userId: e.userId, status: 'offline' } });
          }
        }
      }
    }, PRESENCE_TTL);

    ws.on('close', () => clearInterval(interval));
  });

  console.log('Chat presence handlers mounted at /chat (presence + typing)');
}
