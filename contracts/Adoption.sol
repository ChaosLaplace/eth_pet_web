pragma solidity ^0.5.0;

contract Adoption {
    // 創世神
    address private owner;
    // 玩家持有的 Pokemons
    address[16] private pokemon_owner;
    // 全部玩家數量
    uint private players = 0;
    // 建構子
    constructor() public {
        owner = msg.sender;
    }
    // 定義創世神才能執行
    modifier OnlyOwner {
        require(owner != address(0) && msg.sender == owner);
        _;
    }
    // 結構 玩家
    struct Pokemon_Master {
        // 玩家暱稱
        string nickname;
        // 寶可夢數量
        uint monsters;
    }
    // 玩家列表
    mapping(address => Pokemon_Master) private pokemon_masters;
    // 玩家持有的 Pokemons
    function echo_players() public view returns(uint) {
        return players;
    }
    // 玩家持有的 Pokemons
    function echo_pokemon_owner() public view returns(address[16] memory) {
        return pokemon_owner;
    }
    // 玩家建立帳號 會給玩家挑一隻 Pokemon
    event log_creat_pokemon_master(string msg, address sender, string nickname, uint pokemon_id);
    function creat_pokemon_master(string memory _name, uint _id) public {
        require(pokemon_masters[msg.sender].monsters == 0);
        {
            pokemon_masters[msg.sender] = Pokemon_Master({
                nickname: _name,
                monsters: 1
            });
            ++players;
            
            pokemon_owner[_id] = msg.sender;
            
            emit log_creat_pokemon_master("creat_pokemon_master", msg.sender, _name, _id);
        }
    }
    // 得到 Pokemon
    event log_get_pokemon(string msg, uint pokemon_id);
    function get_pokemon(uint _id) public {
        require(pokemon_masters[msg.sender].monsters > 0 && pokemon_owner[_id] == address(0));
        {
            pokemon_owner[_id] = msg.sender;
            ++pokemon_masters[msg.sender].monsters;
            
            emit log_get_pokemon("get_pokemon", _id);
        }
    }
    // 放生 Pokemon
    event log_delete_pokemon(string msg, address player, uint pokemon_id);
    function delete_pokemon(address _player, uint _id) public {
        require(pokemon_owner[_id] == _player);
        {
            delete pokemon_owner[_id];
            
            uint max = pokemon_owner.length;
            bool gg = true;
            for(uint8 i = 0; i < max; ++i)
            {
                if(pokemon_owner[i] != address(0) && pokemon_owner[i] == _player)
                {
                    gg = false;
                    break;
                }
            }

            if(gg)
            {
                delete pokemon_masters[_player];
                --players;
            }

            emit log_delete_pokemon("delete_pokemon", _player, _id);
        }
    }
}