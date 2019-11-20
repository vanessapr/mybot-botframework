# my-bot

## Running on local

```sh
npm run dev // or
yarn dev
```

## Azure
```sh
az login

az bot publish --name my-bot --proj-file-path "./dist/index.js" --resource-group my-bot --code-dir . --verbose --version v4

az webapp log tail --name my-bot --resource-group my-bot
```

## QnA Maker
```sh
node_modules/.bin/qnamaker create kb --in resources/generated/faq-qna.json
node_modules/.bin/qnamaker replace kb --in resources/generated/faq-qna.json
```
### Alterations
```sh
 node_modules/.bin/qnamaker list alterations
 node_modules/.bin/qnamaker replace alterations --in resources/generated/faq-qna_Alterations.json
```

## Luis
```sh
npm run ludown-luis
node_modules/.bin/luis list applications
node_modules/.bin/luis import application --in resources/generated/mybot-luis.json --appName mybot-luis --region westus
node_modules/.bin/luis train version --appId 1a2f7b42-4645-499a-b526-08cf3b44ae02 --versionId 0.1 --wait
node_modules/.bin/luis publish version --appId 1a2f7b42-4645-499a-b526-08cf3b44ae02 --versionId 0.1 --publishRegion westus --staging
node_modules/.bin/luis import version --in resources/generated/mybot-luis.json --appId 1a2f7b42-4645-499a-b526-08cf3b44ae02 --versionId 0.2
```

## Generate transcripts
```sh
npm run chat-cases -- resources/chats/case1.chat
```


## Tools
* [Chatdown](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/Chatdown)
* [LUDown](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/Ludown)
* [QnAMaker](https://github.com/Microsoft/botbuilder-tools/tree/master/packages/QnAMaker)

### Naming Conventions
https://github.com/unional/typescript-guidelines/blob/master/pages/default/draft/naming-conventions.md
https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines
https://adidas.github.io/contributing/typescript-coding-guidelines/
