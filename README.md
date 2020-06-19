# eth_pet_web(不含 node_modules)
# 安裝  
MetaMask && Ganache && Node.js
# 編譯合約
truffle compile
# 部署合約
truffle migrate
# 啟動
npm run dev
# 執行結果
網頁的console.log

# Docker(含 node_modules)
docker pull chaoslaplace/eth:pokemon_shop

docker run -d -p 8085:3000 --name eth_pokemon chaoslaplace/eth:pokemon_shop

docker cp . e3aee8cd3c3b:/usr/src/app/

truffle compile

truffle migrate

再複製回 container

開網頁 http://localhost:8085

網頁沒顯示,進 container 執行 npm run dev
