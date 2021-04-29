/* eslint-disable */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  images: {
    domains: ['pbs.twimg.com', 'res.cloudinary.com']
  },
  future: {
    webpack5: true
  }
})
