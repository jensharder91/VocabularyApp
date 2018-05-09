#!/bin/bash
echo "converting csv from excel export as 'windows csv'"
echo "UPDATE settings SET value = value::int + 1 WHERE key = 'content.version';"
for FILE in ./*.csv; do
 echo "converting ${FILE}"
 $(iconv -f iso-8859-1 -t utf-8 < "${FILE}" > "${FILE}-utf8")

done
