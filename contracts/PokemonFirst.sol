pragma solidity ^0.5.0;

contract PokemonFirst 
{
    address private owner;
    // 全部帳號
    uint public players = 0;
    // 建構子
    constructor() public
    {
        owner = msg.sender;
    }
    // 定義
    modifier OnlyOwner
    {
        require(owner != address(0) && msg.sender == owner);
        _;
    }
    // 結構 寶可夢
    struct Pokemon
    {
        uint id;
        uint hp;
        uint defense;
        uint attack;
    }
    // 結構 玩家
    struct Pokemon_Master
    {
        // 玩家暱稱
        string name;
        // 寶可夢數量
        uint monsters;
        // 寶可夢列表
        mapping(uint => Pokemon) pokemons;
    }
    // 玩家列表
    mapping(address => Pokemon_Master) pokemon_masters;
    // 玩家建立帳號 會給玩家挑一隻
    event log_create_Pokemon_Master(string name, uint pokemon);
    function create_Pokemon_Master(string memory _name) public
    {
        pokemon_masters[owner] = Pokemon_Master(_name, 1);
        
        ++players;
        
        emit log_create_Pokemon_Master(_name, players);
    }
    // 得到寶可夢
    event log_get_Pokemon(address owner, uint nowArray);
    function get_Pokemon(uint _id) public OnlyOwner
    {
        Pokemon_Master storage player = pokemon_masters[owner];
        
        require(player.monsters >= 1);
        {
            uint nowArray = player.monsters - 1;
            ++player.monsters;

            if(_id % 2 == 0)
            {
                player.pokemons[nowArray] = Pokemon({
                    id: _id,
                    hp: 2,
                    defense: 2,
                    attack: 2
                });
            }
            else
            {
                player.pokemons[nowArray] = Pokemon({
                    id: _id,
                    hp: 1,
                    defense: 1,
                    attack: 1
                });
            }
        
            emit log_get_Pokemon(owner, nowArray);
        }
    }
    // 查詢玩家目前有的寶可夢
    event test(address owner, string name, uint id, uint hp, uint defense, uint attack);
    function select_pokemon() public OnlyOwner
    {
        Pokemon_Master storage player = pokemon_masters[owner];
        require(player.monsters >= 1);
        {
            // 對照名稱
            string[3] memory names = ["Fire", "Water", "Grass"];
            
            uint max = player.monsters - 1;
            
            for(uint i = 0; i < max; ++i)
            {
                emit test(owner, names[player.pokemons[i].id], player.pokemons[i].id, player.pokemons[i].hp, player.pokemons[i].defense, player.pokemons[i].attack);
            }
        }
    }
}