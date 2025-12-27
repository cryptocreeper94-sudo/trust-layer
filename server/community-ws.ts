import { WebSocket, WebSocketServer } from "ws";
import type { Server } from "http";
import { communityHubService } from "./community-hub-service";

interface ChannelClient {
  ws: WebSocket;
  userId: string;
  username: string;
  channelId: string;
  communityId: string;
}

const channelClients = new Map<string, Set<ChannelClient>>();

export function setupCommunityWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: "/ws/community" });

  wss.on("connection", (ws: WebSocket) => {
    let client: ChannelClient | null = null;

    ws.on("message", async (data: string) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case "join": {
            const { channelId, communityId, userId, username } = message;
            if (!channelId || !userId || !username) return;

            client = { ws, userId, username, channelId, communityId };

            if (!channelClients.has(channelId)) {
              channelClients.set(channelId, new Set());
            }
            channelClients.get(channelId)!.add(client);

            if (communityId) {
              await communityHubService.updateMemberOnline(communityId, userId, true);
            }

            broadcastToChannel(channelId, {
              type: "user_joined",
              userId,
              username,
              timestamp: new Date().toISOString(),
            });

            const onlineUsers = getOnlineUsers(channelId);
            ws.send(JSON.stringify({ type: "presence", users: onlineUsers }));
            break;
          }

          case "message": {
            if (!client) return;
            const { content, replyToId, attachment } = message;
            if (!content?.trim() && !attachment) return;

            const savedMessage = await communityHubService.sendMessage({
              channelId: client.channelId,
              userId: client.userId,
              username: client.username,
              content: content?.trim() || "",
              replyToId: replyToId || null,
              attachment: attachment || null,
            });

            let replyTo = null;
            if (replyToId) {
              replyTo = await communityHubService.getMessageById(replyToId);
            }

            broadcastToChannel(client.channelId, {
              type: "new_message",
              message: {
                ...savedMessage,
                replyTo,
                reactions: [],
              },
            });
            break;
          }

          case "reaction": {
            if (!client) return;
            const { messageId, emoji, action } = message;
            if (!messageId || !emoji) return;

            if (action === "add") {
              await communityHubService.addReaction(messageId, client.userId, client.username, emoji);
            } else if (action === "remove") {
              await communityHubService.removeReaction(messageId, client.userId, emoji);
            }

            const reactions = await communityHubService.getReactions(messageId);
            broadcastToChannel(client.channelId, {
              type: "reaction_update",
              messageId,
              reactions,
            });
            break;
          }

          case "typing": {
            if (!client) return;
            broadcastToChannel(client.channelId, {
              type: "typing",
              userId: client.userId,
              username: client.username,
            }, client.userId);
            break;
          }

          case "edit_message": {
            if (!client) return;
            const { messageId, content } = message;
            if (!messageId || !content?.trim()) return;

            const updated = await communityHubService.editMessage(messageId, client.userId, content.trim());
            if (updated) {
              broadcastToChannel(client.channelId, {
                type: "message_edited",
                message: updated,
              });
            }
            break;
          }

          case "delete_message": {
            if (!client) return;
            const { messageId } = message;
            if (!messageId) return;

            const deleted = await communityHubService.deleteMessage(messageId, client.userId);
            if (deleted) {
              broadcastToChannel(client.channelId, {
                type: "message_deleted",
                messageId,
              });
            }
            break;
          }
        }
      } catch (err) {
        console.error("Community WS error:", err);
      }
    });

    ws.on("close", async () => {
      if (client) {
        const clients = channelClients.get(client.channelId);
        if (clients) {
          clients.delete(client);
          if (clients.size === 0) {
            channelClients.delete(client.channelId);
          }
        }

        if (client.communityId) {
          await communityHubService.updateMemberOnline(client.communityId, client.userId, false);
        }

        broadcastToChannel(client.channelId, {
          type: "user_left",
          userId: client.userId,
          username: client.username,
          timestamp: new Date().toISOString(),
        });
      }
    });

    ws.on("error", (err) => {
      console.error("Community WS client error:", err);
    });
  });

  return wss;
}

function broadcastToChannel(channelId: string, message: any, excludeUserId?: string) {
  const clients = channelClients.get(channelId);
  if (!clients) return;

  const data = JSON.stringify(message);
  clients.forEach((client) => {
    if (excludeUserId && client.userId === excludeUserId) return;
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(data);
    }
  });
}

function getOnlineUsers(channelId: string): { userId: string; username: string }[] {
  const clients = channelClients.get(channelId);
  if (!clients) return [];

  const seen = new Set<string>();
  const users: { userId: string; username: string }[] = [];

  clients.forEach((client) => {
    if (!seen.has(client.userId)) {
      seen.add(client.userId);
      users.push({ userId: client.userId, username: client.username });
    }
  });

  return users;
}

export function broadcastToChannelExternal(channelId: string, message: any) {
  broadcastToChannel(channelId, message);
}
