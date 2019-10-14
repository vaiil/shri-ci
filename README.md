# shri-ci
Simple continuous Integration system

Точно работает на Ubuntu, на windows точно есть проблемы (и с запуском, и с работой) из-за ее cmd.  

## Установка:
```shell script
git clone https://github.com/vaiil/shri-ci.git vail-shri-ci
cd vail-shri-ci
npm --prefix ./agent i
npm --prefix ./server i
```

## Запуск сервера
```shell script
npm --prefix ./server start
```
### Параметры:
* Порт (--port или env.PORT), по умолчанию 3000
* Репозиторий (--repo или env.REPO), по умолчанию текущий (https://github.com/vaiil/shri-ci.git) 


## Запуск агента
```shell script
npm --prefix ./agent start -- --port 3001
```
### Параметры:
* Порт (--port или env.PORT), по умолчанию 3000
* Host агента (--host или env.HOST), по умолчанию 'localhost'
* URL сервера (--server или env.SERVER_URL), по умолчанию текущий (http://localhost:3000) 



### Особенности реализации
...В процессе доработки :)
