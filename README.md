

# Nyota :stars:
Nyota is an intelligent communication officer for your computer. She understands
English and will carry out your every command. Well, only those commands you teach
to her.

Nyota is different from Siri and Google Now in that she is build for actionable
commands. She is not a question bot, or a conversation AI (although those might
make nifty plugins), but rather an officer who awaits commands from the captain of
your computer, you, and carries them out. This project is inspired by the prospect
of human-like interaction with computers.


## A Plugin-Based NLP
Nyota is a Natural Language Processor capable of parsing sentences with the
knowledge given to her (the knowledge of specific grammatical feature structures,
or words with context). Once a sentence has been parsed, an action can be composed
using the phrase's components.

Users can configure Nyota by specifying words, their appropriate grammatical
contexts, and their meaning (a verb might represent a function that takes a subject
and a direct object, and performs some action with them).


## Installation
Clone Nyota from github:
```
  git clone https://github.com/patgrasso/nyota.git
```
Or, get Nyota from NPM:
```
  npm install nyota
```


## Testing
Testing Nyota requres jasmine (2.0+). All specs can be found in `spec/`. To run
all tests, simply run `jasmine` in the project's root.


## Contributing
Please see [CONTRIBUTING](CONTRIBUTING) for details about this.


## Concepts
To gain a better understanding of NLP and the magic that makes Nyota work, take a
look at [NLTK](http://www.nltk.org) and perhaps give *Natural Language Processing
with Python* a read. They are great resources for understanding the concepts behind
natural language that Nyota implements.


## License
GPL-3


