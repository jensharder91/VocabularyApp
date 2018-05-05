import urllib.request
import re

patternTitle = ".+?progress.box.title.+\s+?(\w.+)"
patternVocab = "type=.checkbox.+?class=.text.>(.+?)<.+?class=.text.>(.+?)<"
firstLanguage = "Spanish"
secondLanguage = "German"

for i in range(33, 84):
    print("############"+str(i))
    #get content of webpage
    webpage = str("https://www.memrise.com/course/114794/spanish-duolingo/"+str(i))
    page = urllib.request.urlopen(webpage)
    html = page.read().decode('utf-8')


    m = re.search(patternTitle, html, re.IGNORECASE)
    title = m.groups()[0]
    m = re.search(".+?(type=.checkbox.+)", html)
    trimmedHTML = m.groups()[0]

    #pattern = "type=.checkbox.+?class=.text.>(.+?)<.+?class=.text.>(.+?)<"

    text = firstLanguage +","+secondLanguage+"\n"
    for m in re.finditer(patternVocab, trimmedHTML):
        firstLanguage = m.groups()[0]
        secondLanguage = m.groups()[1]
        if(secondLanguage == "</div>"):
            continue

        text += firstLanguage+","+secondLanguage+"\n"
        #print(firstLanguage)
        #print(secondLanguage)


    nameOfFile = title.replace(":", " ").replace("/"," ")+".txt"
    text_file = open(nameOfFile, "w")
    text_file.write(text)
    text_file.close()