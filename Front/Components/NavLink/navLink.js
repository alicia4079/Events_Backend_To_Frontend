export function navLink({ href, id, textContent }) {
  const link = document.createElement('a')
  link.href = href
  link.id = id
  link.textContent = textContent
  return link
}
