export const appConfig = {
  port: process.env.PORT || 3000,
  mode: process.env.NODE_ENV || 'development',
};

export const helmetConfig = {
  dev: {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    frameguard: { action: 'sameorigin' },
    hidePoweredBy: false,
    hsts: false,
    referrerPolicy: { policy: 'no-referrer' },
    xssFilter: true,
  },
  test: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
      },
    },
    crossOriginEmbedderPolicy: { policy: 'require-corp' },
    frameguard: { action: 'sameorigin' },
    hidePoweredBy: true,
    hsts: { maxAge: 3600, includeSubDomains: true, preload: true },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  },
  production: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://trusted-cdn.com'],
        styleSrc: ["'self'", 'https://trusted-styles.com'],
        imgSrc: ["'self'", 'https://trusted-images.com'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'", 'https://trusted-fonts.com'],
      },
    },
    crossOriginEmbedderPolicy: { policy: 'require-corp' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
    dnsPrefetchControl: { allow: false },
    expectCt: { maxAge: 86400, enforce: true },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
    ieNoOpen: true,
    noSniff: true,
    originAgentCluster: true,
    referrerPolicy: { policy: 'no-referrer' },
    xssFilter: true,
  },
};
