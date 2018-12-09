import urllib.request
import re
import csv

patternTitle = ".+?progress.box.title.+\s+?(\w.+)"
patternVocab = "type=.checkbox.+?class=.text.>(.+?)<.+?class=.text.>(.+?)<"
firstLanguage = "English"
secondLanguage = "Vietnamese"
mainpageGER_ESP = "https://www.memrise.com/course/431174/duolingo-aleman-para-hispanohablantes/"
mainpageENG_GER = "https://www.memrise.com/course/322492/complete-duolingo-german-vocabulary/"
mainpageENG_ESP = "https://www.memrise.com/course/114794/spanish-duolingo/"
mainpageENG_VIET = "https://www.memrise.com/course/1070394/duolingo-vietnamese-vocabulary/"



for i in range(1,85):
    print("############"+str(i))
    #get content of webpage
    webpage = str(mainpageENG_VIET+str(i))
    page = urllib.request.urlopen(webpage)
    html = page.read().decode('utf-8')



    m = re.search(patternTitle, html, re.IGNORECASE)
    title = str(i) + "_"+m.groups()[0]
    print(title)
    #pattern = "type=.checkbox.+?class=.text.>(.+?)<.+?class=.text.>(.+?)<"



    text = firstLanguage + ";" + secondLanguage + "\n"
    for m in re.finditer(patternVocab, html):
        firstLanguageVocab = m.groups()[0]
        secondLanguageVocab = m.groups()[1]
        if(secondLanguageVocab == "</div>"):
            continue

        text += firstLanguageVocab + "; " + secondLanguageVocab + "\n"


    print(text)



    nameOfFile = title.replace(":", " ").replace("/"," ")+".csv"
    text_file = open(nameOfFile, "w", encoding="utf-8")
    text_file.write(text)
    text_file.close()