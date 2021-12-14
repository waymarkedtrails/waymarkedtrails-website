#!/bin/bash

MSG_JS=src/i18n/messages.js
HELP_JS=src/i18n/help.js
LANGLIST_JS=src/i18n/languages.js

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

echo '' > /tmp/waymarkedtrails.langlist
for lang in $LANGS; do
  if [ -f "src/i18n/$lang/messages.yaml" ]; then
    LANGNAME=`head -n 1 src/i18n/$lang/messages.yaml | sed 's:.*Translation.* to ::'`
    if [[ "x$LANGNAME" != "x" ]]; then
        echo "$lang: $LANGNAME"
        echo "  ,['$lang', \"$LANGNAME\"]" >> /tmp/waymarkedtrails.langlist
    fi
  fi
done
echo "const langs = [['en', 'English']" > $LANGLIST_JS
sort -k 2 /tmp/waymarkedtrails.langlist >> $LANGLIST_JS
echo ']; export { langs as default };' >> $LANGLIST_JS
