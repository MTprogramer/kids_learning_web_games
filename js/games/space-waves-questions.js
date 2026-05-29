/* ============================================
   SpaceWaves — Information Technology Questions (4th Grade Level)
   100 questions, difficulty 1-5
   ============================================ */

const SPACE_WAVES_QUESTIONS = [
  // ---- Easy (1) — Computer Parts ----
  { q: 'Which part is used for typing on the computer?', options: ['Mouse', 'Keyboard', 'Speaker', 'Screen'], correctIdx: 1, difficulty: 1 },
  { q: 'Which part of the computer displays the image?', options: ['Keyboard', 'Screen', 'Mouse', 'Case'], correctIdx: 1, difficulty: 1 },
  { q: 'What is the function of the mouse?', options: ['Makes sound', 'Moves the cursor', 'Displays images', 'Writes text'], correctIdx: 1, difficulty: 1 },
  { q: 'Which of the following is needed to hear sound from the computer?', options: ['Speaker', 'Keyboard', 'Mouse', 'Printer'], correctIdx: 0, difficulty: 1 },
  { q: 'Which device prints text or images on paper?', options: ['Scanner', 'Printer', 'Camera', 'Microphone'], correctIdx: 1, difficulty: 1 },
  { q: 'What is used for recording sound?', options: ['Speaker', 'Microphone', 'Camera', 'Screen'], correctIdx: 1, difficulty: 1 },
  { q: 'Which part is called the brain of the computer?', options: ['Screen', 'Keyboard', 'Processor (CPU)', 'Mouse'], correctIdx: 2, difficulty: 2 },
  { q: 'Which part holds memory temporarily?', options: ['RAM', 'Screen', 'Keyboard', 'Speaker'], correctIdx: 0, difficulty: 2 },
  { q: 'Which part stores information permanently?', options: ['RAM', 'Hard Disk (HDD/SSD)', 'Mouse', 'Keyboard'], correctIdx: 1, difficulty: 2 },
  { q: 'What is another name for a portable computer?', options: ['Laptop', 'Tablet', 'Smartwatch', 'Game Console'], correctIdx: 0, difficulty: 1 },

  // ---- Easy-Medium (2) — Software/Hardware ----
  { q: 'What are the physical parts of the computer we can touch called?', options: ['Software', 'Hardware', 'Internet', 'Virtual'], correctIdx: 1, difficulty: 2 },
  { q: 'What are programs and applications called?', options: ['Hardware', 'Software', 'Cable', 'Plug'], correctIdx: 1, difficulty: 2 },
  { q: 'Which of the following is software?', options: ['Keyboard', 'Mouse', 'Web Browser', 'Screen'], correctIdx: 2, difficulty: 2 },
  { q: 'Which of the following is hardware?', options: ['Game', 'Keyboard', 'Website', 'Application'], correctIdx: 1, difficulty: 2 },
  { q: 'What type of thing is an operating system?', options: ['Hardware', 'Software', 'Cable', 'Screen'], correctIdx: 1, difficulty: 3 },
  { q: 'Which of the following is an operating system?', options: ['Windows', 'Word', 'Chrome', 'YouTube'], correctIdx: 0, difficulty: 2 },
  { q: 'Which of the following is the operating system used on phones?', options: ['Android', 'Word', 'Paint', 'Excel'], correctIdx: 0, difficulty: 2 },
  { q: 'What type of program is used to edit photos?', options: ['Text editor', 'Photo/image editor', 'Web browser', 'Calculator'], correctIdx: 1, difficulty: 2 },
  { q: 'Which program is used for writing text?', options: ['Word', 'Paint', 'Chrome', 'VLC'], correctIdx: 0, difficulty: 2 },
  { q: 'Which of the following is used for watching videos?', options: ['Calculator', 'VLC / Video Player', 'Paint', 'Notepad'], correctIdx: 1, difficulty: 2 },

  // ---- Medium (3) — Internet ----
  { q: 'What is used to view websites?', options: ['Web Browser', 'Printer', 'Camera', 'Speaker'], correctIdx: 0, difficulty: 2 },
  { q: 'Which of the following is a web browser?', options: ['Chrome', 'Word', 'Excel', 'Paint'], correctIdx: 0, difficulty: 2 },
  { q: 'What is the address of a web page called?', options: ['URL', 'CPU', 'RAM', 'GPU'], correctIdx: 0, difficulty: 3 },
  { q: 'What does "www" stand for?', options: ['World Wide Web', 'Windows Web Wireless', 'Web World Works', 'Wonderful Web World'], correctIdx: 0, difficulty: 3 },
  { q: 'Which of the following is needed to send an email?', options: ['Internet Connection', 'Printer', 'Scanner', 'Speaker'], correctIdx: 0, difficulty: 2 },
  { q: 'What is the name of the following symbol: @', options: ['At symbol', 'Hashtag', 'Dollar', 'Comma'], correctIdx: 0, difficulty: 3 },
  { q: 'Which of the following can be used to search on the internet?', options: ['Google', 'Word', 'Paint', 'Excel'], correctIdx: 0, difficulty: 1 },
  { q: 'What is Wi-Fi?', options: ['Wireless internet', 'A type of keyboard', 'A game', 'An operating system'], correctIdx: 0, difficulty: 2 },
  { q: 'What is the box that allows connecting to the internet called?', options: ['Modem/Router', 'Printer', 'Screen', 'Mouse'], correctIdx: 0, difficulty: 3 },
  { q: 'What are small programs that download websites called?', options: ['Browser', 'Virus', 'Game', 'Folder'], correctIdx: 0, difficulty: 3 },

  // ---- Medium (3) — Security ----
  { q: 'Should you give your personal information to people you don\'t know on the internet?', options: ['Yes', 'No', 'Sometimes', 'Always'], correctIdx: 1, difficulty: 2 },
  { q: 'How should a password be?', options: ['Easily guessable', 'Known by everyone', 'Strong and secret', 'Just 1 letter'], correctIdx: 2, difficulty: 2 },
  { q: 'What is a program that harms the computer called?', options: ['Game', 'Virus', 'Browser', 'Printer'], correctIdx: 1, difficulty: 2 },
  { q: 'Which program is used to protect against viruses?', options: ['Antivirus', 'Game', 'Paint', 'Word'], correctIdx: 0, difficulty: 3 },
  { q: 'What should we pay attention to when sharing on social media?', options: ['Not sharing personal info', 'Telling everyone everything', 'Giving address', 'Sharing phone number'], correctIdx: 0, difficulty: 3 },
  { q: 'Is it safe to click on unknown links?', options: ['Yes', 'No', 'Always', 'Sometimes'], correctIdx: 1, difficulty: 2 },
  { q: 'Who should you share your password with?', options: ['Only your family can know', 'No one / family if necessary', 'With friends', 'With everyone'], correctIdx: 1, difficulty: 3 },
  { q: 'What should you do if something bad is written on the computer?', options: ['Close it and tell an adult', 'Click it', 'Reply', 'Share it'], correctIdx: 0, difficulty: 2 },
  { q: 'Is all information seen on the internet correct?', options: ['Yes, all of it', 'No, its accuracy should be researched', 'Only pictures are correct', 'Only videos are correct'], correctIdx: 1, difficulty: 3 },
  { q: 'What should a secure password have?', options: ['Letters, numbers, and symbols', 'Just 1', 'Just "1234"', 'Just "abc"'], correctIdx: 0, difficulty: 3 },

  // ---- Medium-Hard (4) — File/Folder ----
  { q: 'What is the structure we use to store files called?', options: ['Folder', 'Screen', 'Cable', 'Mouse'], correctIdx: 0, difficulty: 2 },
  { q: 'What type of file does the ".txt" extension belong to?', options: ['Text', 'Image', 'Video', 'Audio'], correctIdx: 0, difficulty: 3 },
  { q: 'What type of file does the ".jpg" extension belong to?', options: ['Text', 'Image', 'Video', 'Audio'], correctIdx: 1, difficulty: 3 },
  { q: 'What type of file does the ".mp3" extension belong to?', options: ['Image', 'Audio', 'Text', 'Video'], correctIdx: 1, difficulty: 3 },
  { q: 'What type of file does the ".mp4" extension belong to?', options: ['Video', 'Image', 'Audio', 'Text'], correctIdx: 0, difficulty: 3 },
  { q: 'What type of file does the ".pdf" extension belong to?', options: ['Document', 'Game', 'Video', 'Audio'], correctIdx: 0, difficulty: 4 },
  { q: 'Where does a file go when it is deleted?', options: ['Recycle Bin', 'Desktop', 'Documents', 'Internet'], correctIdx: 0, difficulty: 3 },
  { q: 'Which keyboard shortcut is used to copy a file?', options: ['Ctrl + C', 'Ctrl + V', 'Ctrl + X', 'Ctrl + Z'], correctIdx: 0, difficulty: 4 },
  { q: 'Which shortcut is used to paste?', options: ['Ctrl + V', 'Ctrl + C', 'Ctrl + Z', 'Ctrl + S'], correctIdx: 0, difficulty: 4 },
  { q: 'Which shortcut is used to save a file?', options: ['Ctrl + S', 'Ctrl + C', 'Ctrl + V', 'Ctrl + Z'], correctIdx: 0, difficulty: 4 },

  // ---- Medium-Hard (4) — Keyboard/Shortcuts ----
  { q: 'Which shortcut is used to undo?', options: ['Ctrl + Z', 'Ctrl + Y', 'Ctrl + S', 'Ctrl + V'], correctIdx: 0, difficulty: 4 },
  { q: 'Which key is held down to type a capital letter?', options: ['Shift', 'Tab', 'Alt', 'Ctrl'], correctIdx: 0, difficulty: 3 },
  { q: 'Which key is used to type in all caps continuously?', options: ['Caps Lock', 'Shift', 'Alt', 'Ctrl'], correctIdx: 0, difficulty: 3 },
  { q: 'Which key is pressed for space between two words?', options: ['Space', 'Enter', 'Tab', 'Shift'], correctIdx: 0, difficulty: 2 },
  { q: 'Which key is used to move to a new line?', options: ['Enter', 'Shift', 'Alt', 'Space'], correctIdx: 0, difficulty: 2 },
  { q: 'Which key is used to delete a character?', options: ['Backspace', 'Enter', 'Shift', 'Tab'], correctIdx: 0, difficulty: 2 },
  { q: 'Which shortcut is for cutting?', options: ['Ctrl + X', 'Ctrl + C', 'Ctrl + V', 'Ctrl + A'], correctIdx: 0, difficulty: 4 },
  { q: 'Which shortcut is for selecting all?', options: ['Ctrl + A', 'Ctrl + S', 'Ctrl + C', 'Ctrl + V'], correctIdx: 0, difficulty: 4 },
  { q: 'Which shortcut is for printing?', options: ['Ctrl + P', 'Ctrl + C', 'Ctrl + S', 'Ctrl + F'], correctIdx: 0, difficulty: 4 },
  { q: 'Which shortcut is for finding (searching)?', options: ['Ctrl + F', 'Ctrl + S', 'Ctrl + A', 'Ctrl + Z'], correctIdx: 0, difficulty: 4 },

  // ---- Medium (3) — Numbers/Units ----
  { q: 'What is the smallest unit of information on a computer called?', options: ['Bit', 'Byte', 'MB', 'GB'], correctIdx: 0, difficulty: 4 },
  { q: 'How many bits are in 1 Byte?', options: ['8', '4', '10', '16'], correctIdx: 0, difficulty: 5 },
  { q: 'Which one is the largest?', options: ['KB', 'MB', 'GB', 'Byte'], correctIdx: 2, difficulty: 4 },
  { q: 'Which one is the smallest?', options: ['GB', 'MB', 'KB', 'Byte'], correctIdx: 3, difficulty: 4 },
  { q: 'Approximately how many bytes are in 1 KB?', options: ['1000', '100', '10', '1'], correctIdx: 0, difficulty: 5 },
  { q: 'Computers only understand which two numbers?', options: ['0 and 1', '1 and 2', '5 and 10', '8 and 9'], correctIdx: 0, difficulty: 4 },
  { q: 'What is this "0 and 1" number system called?', options: ['Binary', 'Denary', 'Decimal', 'Roman'], correctIdx: 0, difficulty: 5 },
  { q: 'What is the smallest point that forms an image on the screen called?', options: ['Pixel', 'Bit', 'Byte', 'Frame'], correctIdx: 0, difficulty: 4 },

  // ---- Medium-Hard (4) — Programming Fundamentals ----
  { q: 'What is a sequence of commands written to make a computer do a task called?', options: ['Program / Code', 'Game', 'Image', 'Video'], correctIdx: 0, difficulty: 3 },
  { q: 'What is a structure that allows a task to be done repeatedly called?', options: ['Loop', 'Decision', 'Variable', 'Image'], correctIdx: 0, difficulty: 4 },
  { q: 'What is the "if ... then" structure called in programming?', options: ['Decision / Condition', 'Loop', 'Variable', 'Function'], correctIdx: 0, difficulty: 4 },
  { q: 'What is Scratch used for?', options: ['Learning coding', 'Watching movies', 'Taking photos', 'Listening to music'], correctIdx: 0, difficulty: 3 },
  { q: 'What are the boxes used to store information called?', options: ['Variable', 'Loop', 'Condition', 'File'], correctIdx: 0, difficulty: 4 },
  { q: 'What is an algorithm?', options: ['Step-by-step solution to a task', 'A game', 'Hardware', 'A file'], correctIdx: 0, difficulty: 4 },
  { q: 'What is Python?', options: ['A programming language', 'A game', 'A movie', 'A superhero'], correctIdx: 0, difficulty: 4 },
  { q: 'What is HTML used for?', options: ['Making web pages', 'Watching movies', 'Sound recording', 'Playing games'], correctIdx: 0, difficulty: 5 },

  // ---- Easy-Medium — General ----
  { q: 'Which button is pressed to turn on the computer?', options: ['Power', 'Enter', 'Shift', 'Alt'], correctIdx: 0, difficulty: 1 },
  { q: 'What is USB used for?', options: ['Data and power transfer', 'Making sound', 'Giving heat', 'Drawing image'], correctIdx: 0, difficulty: 3 },
  { q: 'What is a flash drive used for?', options: ['Carrying/storing files', 'Cooking food', 'Playing sound', 'Opening screen'], correctIdx: 0, difficulty: 3 },
  { q: 'What is a CD or DVD used for?', options: ['Saving data/movies/music', 'Drinking tea', 'Opening door', 'Finding way'], correctIdx: 0, difficulty: 3 },
  { q: 'What is a touch screen?', options: ['A screen that can be controlled with a finger', 'Keyboard-only screen', 'Broken screen', 'Black screen'], correctIdx: 0, difficulty: 2 },
  { q: 'Where is the keyboard usually on smartphones?', options: ['On the screen (touch)', 'On the back', 'On the side', 'None'], correctIdx: 0, difficulty: 2 },
  { q: 'What is a QR code for?', options: ['Quickly opening info/sites', 'Cooking food', 'Decorating house', 'Measuring oil'], correctIdx: 0, difficulty: 3 },
  { q: 'What is an emoji?', options: ['Small image/icon', 'Virus', 'Folder', 'Printer'], correctIdx: 0, difficulty: 2 },
  { q: 'Which sign must be present in an email address?', options: ['@', '#', '$', '&'], correctIdx: 0, difficulty: 3 },
  { q: 'Which letters does a website link start with?', options: ['http / https', 'abc', 'zzz', 'xyz'], correctIdx: 0, difficulty: 3 },

  // ---- Hard (5) — Advanced ----
  { q: 'What does the "S" in HTTPS stand for?', options: ['Secure', 'Simple', 'Small', 'Super'], correctIdx: 0, difficulty: 5 },
  { q: 'What is cloud storage?', options: ['Storing files over the internet', 'Sky', 'Rain', 'Steam'], correctIdx: 0, difficulty: 4 },
  { q: 'What service does Google Drive provide?', options: ['Cloud storage', 'Food delivery', 'Taxi calling', 'Playing games'], correctIdx: 0, difficulty: 4 },
  { q: 'What is Zoom / Meet used for?', options: ['Video meeting', 'Photo editing', 'Listening to music', 'Playing games'], correctIdx: 0, difficulty: 3 },
  { q: 'What is artificial intelligence (AI)?', options: ['A computer that can learn and think', 'A game', 'A movie', 'Only a robot'], correctIdx: 0, difficulty: 5 },
  { q: 'What is a robot?', options: ['A programmable machine', 'A live animal', 'A plant', 'Food'], correctIdx: 0, difficulty: 3 },
  { q: 'What does social media mean?', options: ['Websites where people share', 'News sites only', 'Games only', 'Shopping only'], correctIdx: 0, difficulty: 3 },
  { q: 'What is spam?', options: ['Unwanted email', 'A food', 'A game type', 'A folder type'], correctIdx: 0, difficulty: 5 },
  { q: 'What is a cookie?', options: ['Small info a website saves to the browser', 'A type of biscuit', 'A game type', 'A file type'], correctIdx: 0, difficulty: 5 },
  { q: 'What does it mean to present someone else\'s writing as your own on the internet?', options: ['Plagiarism', 'Sharing', 'Research', 'Game'], correctIdx: 0, difficulty: 5 },
];

if (typeof window !== 'undefined') {
  window.SPACE_WAVES_QUESTIONS = SPACE_WAVES_QUESTIONS;
}
