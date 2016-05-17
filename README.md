

# nyota :stars:
Nyota is an intelligent communications officer for your computer. She
understands English and will carry out your every command. Well, only those
commands you teach to her.

Nyota is different from Siri and Google Now in that she is build for actionable
commands. She is not a question bot, or a conversation AI (although those might
make nifty plugins), but rather an officer who awaits commands from the captain
of your computer, you, and carries them out. This project is inspired by the
aspiration of human-like interaction with computers.


## A Plugin-Based NLP
Nyota is a Natural Language Processor capable of parsing sentences with the
knowledge given to her (the knowledge of specific grammatical feature
structures, or words with context). Once a sentence has been parsed, an action
can be composed using the phrase's components.

Users can configure nyota by specifying words, their appropriate grammatical
contexts, and their meaning (a verb might represent a function that takes a
subject and a direct object, and performs some action with them).


## Installation
Clone nyota from github:
```
  git clone https://github.com/patgrasso/nyota.git
```


## Try It Out
```javascript
const CFG = require('./grammar/cfg');
//const rd  = require('./parsing/shift-reduce');

let cfg = new CFG();

cfg.production('S', { name: 'NP', num: '?n' }, { name: 'VP', num: '?n' });
cfg.production('NP', 'Det', 'NP');
cfg.production('NP', 'Adj', 'NP');
cfg.production({ name: 'NP', num: '?n' }, { name: 'N', num: '?n' });
cfg.production(
  { name: 'VP', num: '?n' },
  { name: 'V' , num: '?n' },
  { name: 'NP', num: '?n' }
);
cfg.production({ name: 'VP', num: '?n' }, { name: 'V' , num: '?n' }, 'AP');
cfg.production('AP', 'Adv', 'Adj');
cfg.production('AP', 'Adj');

cfg.production({ name: 'N', num: 'sg' }, 'Nyota');
cfg.production({ name: 'V', num: 'sg' }, 'is');
cfg.production('Adv', 'very');
cfg.production('Adj', 'intelligent');

cfg.production({ name: 'N', num: 'pl' }, 'bananas');
cfg.production({ name: 'V', num: 'pl' }, 'are');
cfg.production('Adj', 'yellow');

//rd.parse('Nyota is very intelligent');
//rd.parse('bananas are yellow');
```



## Testing
Testing nyota requres jasmine (2.0+). All specs can be found in `spec/`. To run
all tests, simply run `npm test` in the project's root. This will also generate
a code coverage report in `coverage/`


## Contributing
Please see [CONTRIBUTING](CONTRIBUTING) for details about this.


## Concepts
To gain a better understanding of NLP and the magic that makes nyota work, take
a look at [NLTK](http://www.nltk.org) and perhaps give *Natural Language
Processing with Python* a read. They are great resources for understanding the
natural language concepts that nyota implements.


## License
GPL-3


