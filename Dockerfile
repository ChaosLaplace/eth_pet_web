FROM node:carbon

WORKDIR /usr/src/app
COPY . .
# npm
RUN npm update
RUN npm install
RUN npm install nodemon -g
RUN npm install hashmap && \
    npm install body-parser -g
# apt
RUN apt-get update
RUN apt-get install zip git iputils-ping vim telnet net-tools mlocate mariadb-client tzdata -y
# 確定時區會在 +8
RUN cp /usr/share/zoneinfo/Asia/Taipei /etc/localtime
# 最後在更新一次
RUN npm update
RUN apt-get update
# 映象資訊
LABEL Author="Hank"
LABEL Version="node:carbon"

# 自動重啟
CMD ["npm", "run", "dev"]