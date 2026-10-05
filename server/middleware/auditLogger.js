// In-memory rolling buffer for real-time Express API activity & audit logging
const MAX_LOGS = 100;
const logBuffer = [];

export const auditLoggerMiddleware = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Intercept res.send / res.json to capture response metrics
  const originalJson = res.json;
  res.json = function (body) {
    const duration = Date.now() - start;
    const logEntry = {
      id: Date.now() + Math.random().toString(36).substr(2, 5),
      timestamp,
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip || req.socket.remoteAddress || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown Client',
      source: 'Express.js Request Pipeline',
    };

    logBuffer.unshift(logEntry);
    if (logBuffer.length > MAX_LOGS) {
      logBuffer.pop();
    }

    return originalJson.call(this, body);
  };

  next();
};

export const getAuditLogs = () => {
  return [...logBuffer];
};

export const clearAuditLogs = () => {
  logBuffer.length = 0;
};
