const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
}

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...defaultConfig,
      ...nextConfig,
      images: {
        unoptimized: true,
      },
    }
  }

  return {
    ...nextConfig,
  }
}
