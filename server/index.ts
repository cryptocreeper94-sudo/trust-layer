import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { createProxyMiddleware } from "http-proxy-middleware";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { startScheduler } from "./marketing-scheduler";
import { seedDocuments, seedCityZones } from "./storage";
import { setupPresence } from "./chat-presence";
import { runMigrations } from "stripe-replit-sync";
import { getStripeSync } from "./stripeClient";

const app = express();

// Firebase Auth reverse proxy - must be before other middleware
// This allows Google Sign-In to work with custom domain by avoiding third-party cookie issues
app.use(["/__/auth", "/__/firebase"], createProxyMiddleware({
  target: "https://darkwave-auth.firebaseapp.com",
  changeOrigin: true,
  secure: true,
  pathRewrite: (_path: string, req: any) => `${req.baseUrl}${req.url}`,
}));

// Redirect dwsc.io to dwtl.io (primary domain)
app.use((req, res, next) => {
  const host = req.headers.host || '';
  if (host === 'dwsc.io' || host === 'www.dwsc.io') {
    const newUrl = `https://dwtl.io${req.originalUrl}`;
    return res.redirect(301, newUrl);
  }
  next();
});

const httpServer = createServer(app);

// Security headers via Helmet - stricter in production
const isProduction = process.env.NODE_ENV === "production";

const cspDirectives = {
  defaultSrc: ["'self'"],
  scriptSrc: isProduction 
    ? ["'self'", "'unsafe-eval'", "https://js.stripe.com", "https://www.googletagmanager.com"]
    : ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
  styleSrc: isProduction
    ? ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"]
    : ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  fontSrc: ["'self'", "https://fonts.gstatic.com"],
  imgSrc: ["'self'", "data:", "blob:", "https:"],
  connectSrc: ["'self'", "wss:", "https:"],
  frameSrc: ["'self'", "https://js.stripe.com"],
  objectSrc: ["'none'"],
  baseUri: ["'self'"],
  formAction: ["'self'"],
  frameAncestors: ["'none'"],
  upgradeInsecureRequests: isProduction ? [] : null,
};

// Remove null values for development
Object.keys(cspDirectives).forEach(key => {
  if (cspDirectives[key as keyof typeof cspDirectives] === null) {
    delete cspDirectives[key as keyof typeof cspDirectives];
  }
});

app.use(helmet({
  contentSecurityPolicy: {
    directives: cspDirectives,
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  hsts: isProduction ? { maxAge: 31536000, includeSubDomains: true, preload: true } : false,
}));

// CORS headers for API access with strict origin allowlist
const ALLOWED_ORIGINS = [
  "https://dwtl.io",
  "https://www.dwtl.io",
  "https://dwsc.io",
  "https://www.dwsc.io",
  "https://darkwavegames.io",
  "https://www.darkwavegames.io",
  "https://darkwavestudios.io",
  "https://www.darkwavestudios.io",
  "https://yourlegacy.io",
  "https://www.yourlegacy.io",
  "https://chronochat.io",
  "https://www.chronochat.io",
];

// Allow localhost in development
if (process.env.NODE_ENV !== "production") {
  ALLOWED_ORIGINS.push("http://localhost:5000", "http://127.0.0.1:5000");
}

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-API-Key, X-API-Secret");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    limit: '50mb',
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Session middleware with PostgreSQL persistence
const pgStore = connectPg(session);
const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week

const sessionStore = new pgStore({
  conString: process.env.DATABASE_URL,
  createTableIfMissing: true,
  ttl: sessionTtl,
  tableName: "user_sessions",
  errorLog: (err: Error) => {
    if (err.message?.includes('already exists')) {
      console.log('[Session] Index already exists, ignoring...');
    } else {
      console.error('[Session] Store error:', err.message);
    }
  },
});

app.set("trust proxy", 1);
app.use(session({
  store: sessionStore,
  secret: process.env.SESSION_SECRET || process.env.OWNER_SECRET || 'darkwave-session-secret-dev',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: sessionTtl,
    sameSite: 'lax',
  },
}));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize Stripe managed webhooks
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    try {
      console.log('[Stripe] Initializing managed webhooks...');
      await runMigrations({ databaseUrl });
      
      const stripeSync = await getStripeSync();
      const domains = process.env.REPLIT_DOMAINS?.split(',') || [];
      if (domains.length > 0) {
        const webhookUrl = `https://${domains[0]}/api/stripe/webhook`;
        const webhook = await stripeSync.findOrCreateManagedWebhook(webhookUrl);
        console.log(`[Stripe] Managed webhook configured: ${webhook.url || webhookUrl}`);
      }
      
      // Sync existing Stripe data in background
      stripeSync.syncBackfill().then(() => {
        console.log('[Stripe] Data sync complete');
      }).catch((err: Error) => {
        console.error('[Stripe] Data sync error:', err.message);
      });
    } catch (err: any) {
      console.warn('[Stripe] Initialization skipped:', err.message);
    }
  }

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    async () => {
      console.log(`[Health] Server started and listening on 0.0.0.0:${port}`);
      console.log(`[Health] Application ready to accept HTTP requests`);
      log(`serving on port ${port}`);
      
      // Setup ChronoChat WebSocket presence
      setupPresence(httpServer);
      
      // Seed core documents if empty
      await seedDocuments();
      
      // Seed city zones for Chronicles Estate
      await seedCityZones();
      
      // Marketing auto-deploy scheduler - DISABLED (rebrand in progress)
      // startScheduler();
    },
  );
})();
