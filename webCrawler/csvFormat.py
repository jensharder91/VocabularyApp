import csv



def convertFile(nameOfFile):

    with open(nameOfFile) as f:
        reader = csv.reader(f)
        next(reader) # skip header
        data = []
        text = ""
        for r in reader:
            text += "\""+r[0].replace(";", "\",\"")+"\"\n"
            print(text)
            #data.append(r)

        print(text)
        nameOfFile = nameOfFile
        text_file = open(nameOfFile, "w", encoding="utf-8")
        text_file.write(text)
        text_file.close()


for i in range(1,13):
    convertFile("CAI_Vocab_No."+str(i)+".csv")