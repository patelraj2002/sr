/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'srhomes.in',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'www.srhomes.in',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      // Add Google Maps domains
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '*.gstatic.com',
      },
    ],
  },

  // Redirect rules
  async redirects() {
    return [
      // Admin redirects
      {
        source: '/admin',
        destination: '/admin/login',
        permanent: true,
      },
      // Dashboard redirects
      {
        source: '/dashboard/owner',
        destination: '/auth/signin',
        permanent: false,
      },
      {
        source: '/dashboard/owner/:id*',
        has: [
          {
            type: 'cookie',
            key: 'user',
            missing: true,
          },
        ],
        permanent: false,
        destination: '/auth/signin',
      },
      // Protected routes
      {
        source: '/properties/new',
        has: [
          {
            type: 'cookie',
            key: 'user',
            missing: true,
          },
        ],
        permanent: false,
        destination: '/auth/signin',
      },
      {
        source: '/properties/:id/edit',
        has: [
          {
            type: 'cookie',
            key: 'user',
            missing: true,
          },
        ],
        permanent: false,
        destination: '/auth/signin',
      },
    ];
  },

  // Headers configuration
  async headers() {
    return [
      {
        // Cache configuration for uploads
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Security headers for all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "img-src 'self' data: blob: https://*.googleapis.com https://*.gstatic.com https: http:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://*.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "frame-src 'self' https://*.google.com",
              "connect-src 'self' https://*.googleapis.com https://*.gstatic.com https: http:",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // Output configuration
  output: 'standalone',

  // Disable X-Powered-By header
  poweredByHeader: false,

  // Experimental features
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    serverActions: {
      enabled: true
    }
  },

  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      Object.assign(config.optimization, {
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          automaticNameDelimiter: '~',
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      });
    }

    // Add resolver for Google Maps
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },

  // Environment configuration
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },

  // React strict mode
  reactStrictMode: true,

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Build configuration
  distDir: '.next',
  generateEtags: true,
  compress: true,

  // Asset prefix (if serving from a CDN)
  assetPrefix: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_CDN_URL : '',
};

module.exports = nextConfig;