import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import compression from "compression"; // Added for performance
import helmet from "helmet";           // Added for security

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// 1. Security & Performance Middlewares
// Find your app.use(helmet()) line and replace it with this:
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "img-src": ["'self'", "data:", "*.supabase.co", "images.unsplash.com"],
      },
    },
  })
);      // Sets various HTTP headers for security
app.use(compression()); // Compresses response bodies for better speed

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// 2. Logging Middleware (Kept your logic, but made it cleaner)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: any = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      // In production, you might want to skip logging full JSON bodies to avoid 
      // logging sensitive user data, but keeping it per your request:
      if (capturedJsonResponse && process.env.NODE_ENV !== "production") {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  // Register your API routes
  await registerRoutes(httpServer, app);

  // 3. Centralized Error Handling
  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Always log the full error to your server console/logs
    console.error(`[Error] ${status}:`, err);

    if (res.headersSent) {
      return next(err);
    }

    // Don't send stack traces to the client in production
    res.status(status).json({ 
      message,
      ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
    });
  });

  // 4. Environment-Specific Static Serving
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5001", 10);
  
  // Use a more standard listen for production
  httpServer.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port} (mode: ${process.env.NODE_ENV})`);
  });
})();