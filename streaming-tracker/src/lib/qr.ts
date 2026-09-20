import QRCode from 'qrcode'

/**
 * Builds the public, shareable URL for a show. In this local build it
 * resolves relative to wherever the app is being served (so it works over
 * LAN when you open the dev server from your phone). In production this
 * would be the app's real web domain, e.g. https://reel.app/s/severance
 */
export function publicShowUrl(slug: string) {
  return `${window.location.origin}/s/${slug}`
}

export async function makeQrDataUrl(text: string) {
  return QRCode.toDataURL(text, {
    margin: 1,
    width: 480,
    color: {
      dark: '#0b0d12ff',
      light: '#ffffffff',
    },
  })
}
