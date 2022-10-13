const escapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};
const regexp = new RegExp('[' + Object.keys(escapes).join('') + ']', 'g');
export default (s: string) => s.replace(regexp, match => escapes[match]);
