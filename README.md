# VocabularyApp
This readme is supposed to sketch the idea for a vocabulary app and to think it through.
You can add any ideas you have.

# 1. Goals of app.

Learning vocabularies: App can approximately tell user's knowledge on vocabularies.

# 2. Workflow of app.

## 2.1 User's viewpoint on vocabularies:
The application has three dimensions. Each dimension gives a different view on the to-study-vocabularies.

- First dimension: The chapter dimension.
The chapter dimension lets the student see/learn the vocabularies per book chapter or different categories.
Indication of proficiency level: Circle with different colors: red, yellow, green. Each vocab gets a different color depending on the numbers it has been reviewed by the user. Once each vocabulary has a green level the whole circle appears green and adequately for the other levels.

- Second dimension: The vocabulary box dimension.
Suppose, the vocabulary box has six sections. The number six supposed to denote the number of days in a week [minus Sunday, this is a free day from work and from studying vocabularies. :) ]

- Third dimension: The quick test dimension.
Students can test there knowledge in a short period of time (e.g. while waiting for the bus). 10 (numbers may change) vocabularies are chosen randomly from all selected / learned categories. The student can repeat this dimension multiply times to get an overview how solid his vocabulary knowledge is.

## 2.2 Internal viewpoint on vocabulary:
### 2.2.1. How to track user's proficiency level?
We basically want to introduce a system which can help the user with two tasks. The first task is to give him introduction to how many times to study what vocabulary. The second tasks is to give him an indication of his proficiency level of a word and this level being approximately as close as possible to the reality.

In order to help him with the two tasks the application works with vocabulary box dimension. The vocabulary boxes have been a really adequate tool in real life to study vocabularies. It is a simple concept and this can help the application to track performance the same way the boxes do. As indicted before, we suppose our vocabulary box has 6 levels.
First task: How many times should one vocabulary be studied?
Each level contains a number of vocabularies.

In the vocabulary app indicates the number of times a level needs to be studied can be as follows:

- Level 1: Level needs to studied each day.
- Level 2: Level needs to be studied every 2nd day.
- Level 3: Level needs to be studied every 3rd day.
- Level 4: Level needs to be studied every 4th day.
- Level 5: Level needs to be studied every 5th day.
- Level 6: Level needs to be studied every 6th day.

This above is to obtain the fullest proficiency. Now, the user does not necessarily have to follow the guide with one what day to study what vocabulary. The app on the other hand will count the number he was supposed to learn a vocabulary and will not give the proficiency level until the user has iterated the number the app makes him do so.

## 2.3 Technical viewpoint
### 2.3.1 Content management
##### Server communication
The app should be able to communicate to the related app server. This is necessary to provide up to date content (add new vocabularies / categories and change / fix existing content). Students can chose categories they are interested in, download this content and store it local on the device. [To make things easier at the beginning we can assume all students select all content. So download, store and manage all content.]
##### Local storage
To make the content offline available and save mobile data, chosen content should be saved local on the device. This way students can learn independent of an internet connection. A content version number (for each category ?) should indicate if a downloaded category is still up to date. This number has to be compared with the current number on the server from time to time (or on user request). If necessary the app should download the new content and replace the old one.
### 2.3.2 Authentication / Users
There should be implemented some kind of authentication. This accomplishes two goals:
- It is possible to restrict categories to a special group of students (e.g. only people from school XY can see the categories related to XY).
- It is possible to see / save / analyze the progress and usage of an user.

# 3. Ideas to improve app later.

- Content Management (chose which content should be downloaded).
- Editor. Create, edit and delete your own local vocabulary category.
- Extend usage e.g. for grammar tasks, irregular vocabularies, etc.
