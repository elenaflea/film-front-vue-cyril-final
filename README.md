# filmotheque

Ceci est le projet que j'ai codé durant les 3 semaines de cours à l'ENI en février 2024

## Pour installer les dépendance

```sh
npm install
```


## Pour "builder" le projet

```sh
npm run dev
```

## Pour "deployer" le projet

```sh
npm run deploy
```

On utilise pour cela le plugin gh-pages qui permet de publier sur une branche "gh-pages" un dossier spécifique (ici : dist)

npm run deploy marche parce qu'on a mis dans package.json

```js
"scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist"
  },
  ```

Une fois qu'on deployé, l'application front sera disponible à l'url :

```
  <<NOM_USER_GITHUB>>.github.io/<<NOM_REPOSITORY>>
```
Par exemple si mon nom d'utilisateur est : cyril-eni et mon repository : filmotheque2
Il faudra aller à l'url : **cyril-eni.github.io/filmotheque2**


## Si vous avez des soucis/bugs/suggestions

Envoyer un email à l'ENI