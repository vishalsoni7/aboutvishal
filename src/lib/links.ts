// External links open in a new tab; in-page anchors and site files don't.
export const externalProps = (href: string) =>
  /^https?:\/\//.test(href) ? { target: '_blank', rel: 'noreferrer' } : {}
