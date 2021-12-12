const langs = {
   'de': () => import ('./de/messages.json'),
   'en': () => import ('./qot/messages.json') };
export { langs as default };
