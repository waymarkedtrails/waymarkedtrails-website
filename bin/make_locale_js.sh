#!/bin/bash

MSG_JS=src/i18n/messages.js
HELP_JS=src/i18n/help.js

LANGS=`find src/i18n -mindepth 1 -type d ! -name 'qot' ! -name 'qqq' -printf '%f '`

echo 'const langs = {' > $MSG_JS
for lang in $LANGS; do
  if [ -f "src/i18n/$lang/messages.yaml" ]; then
    echo "   '$lang': () => import ('./$lang/messages.yaml')," >> $MSG_JS
  fi
done
echo "   'en': () => import ('./qot/messages.yaml') };" >> $MSG_JS

echo 'export { langs as default };' >> $MSG_JS


echo 'const langs = {' > $HELP_JS
for lang in $LANGS; do
  if [ -f "src/i18n/$lang/helppages.yaml" ]; then
    echo "   '$lang': () => import ('./$lang/helppages.yaml')," >> $HELP_JS
  fi
done
echo "   'en': () => import ('./qot/helppages.yaml') };" >> $HELP_JS
echo 'export { langs as default };' >> $HELP_JS
