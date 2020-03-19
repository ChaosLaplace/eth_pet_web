App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for(i = 0; i < data.length; ++i) {
        petTemplate.find('.creat').attr('data-id', data[i].id);
        petTemplate.find('.get').attr('data-id', data[i].id);
        petTemplate.find('.delete').attr('data-id', data[i].id);

        petTemplate.find('.name').text(data[i].name);
        petTemplate.find('.hp').text(data[i].hp);
        petTemplate.find('.defense').text(data[i].defense);
        petTemplate.find('.attack').text(data[i].attack);
        petTemplate.find('img').attr('src', data[i].src);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
    if(window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch(error) {
        // User denied account access...
        console.error("User denied account access");
      }
    }
    // Legacy dapp browsers...
    else if(window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://eos.cloudlab.mywire.org:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data;
      App.contracts.Adoption = TruffleContract(AdoptionArtifact);
      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider);
      // Use our contract to retrieve and mark the adopted pets
      return App.markPokemon();
    });

    return App.bindEvents();
  },
  // 註冊事件
  bindEvents: function() {
    $(document).on('click', '#btn-echo_players', App.echo_players);
    $(document).on('click', '#btn-echo_pokemon_owner', App.echo_pokemon_owner);

    $(document).on('click', '.creat', App.creat_master);
    $(document).on('click', '.get', App.get_pokemon);
    $(document).on('click', '.delete', App.delete_pokemon);
  },
  // 玩家資訊
  echo_players: function(event) {
    event.preventDefault();

    web3.eth.getAccounts(function(error, accounts) {
      if(error) {
        console.log(error);
      }

      var account = accounts[0];
      console.log('account -> ' + account);

      App.contracts.Adoption.deployed().then(function(instance) {
        // Execute adopt as a transaction by sending account
        return instance.echo_players.call();
      }).then(function(result) {
        console.log(result);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  // 玩家持有的 Pokemons
  echo_pokemon_owner: function(event) {
    event.preventDefault();

    App.contracts.Adoption.deployed().then(function(instance) {
      // Execute adopt as a transaction by sending account
      return instance.echo_pokemon_owner.call();
    }).then(function(result) {
      console.log(result);
    }).catch(function(err) {
      console.log(err.message);
    });
  },
  // 無法重複獲得
  markPokemon: function(result, account) {
    web3.eth.getAccounts(function(error, accounts) {
      if(error) {
        console.log(error);
      }

      var account = accounts[0];
      console.log('account -> ' + account);

      App.contracts.Adoption.deployed().then(function(instance) {
        return instance.echo_pokemon_owner.call();
      }).then(function(result) {
        console.log(result);

        for(i = 0; i < result.length; ++i) {
          if(result[i] !== '0x0000000000000000000000000000000000000000') {
            $('.panel-pet').eq(i).find('button.creat').text('Created').attr('disabled', true);
            $('.panel-pet').eq(i).find('button.get').text('Got').attr('disabled', true);
            
            if(result[i] === account)
            {
              $('.panel-pet').eq(i).find('button.delete').text('Deleted').removeAttr('disabled');
            }
            else
            {
              $('.panel-pet').eq(i).find('button.delete').text('Deleted').attr('disabled', true);
            }
          }
          else
          {
            $('.panel-pet').eq(i).find('button.creat').text('Create').removeAttr('disabled');
            $('.panel-pet').eq(i).find('button.get').text('Get').removeAttr('disabled');
            $('.panel-pet').eq(i).find('button.delete').text('Deleted').attr('disabled', true);
          }
        }
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  // 玩家建立帳號 會給玩家挑一隻 Pokemon
  creat_master: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
    console.log('creat id -> ' + petId);

    web3.eth.getAccounts(function(error, accounts) {
      if(error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        // Execute adopt as a transaction by sending account
        return instance.creat_pokemon_master(account, petId);
      }).then(function(result) {
        console.log(result);
        return App.markPokemon();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  // 得到 Pokemon
  get_pokemon: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
    console.log('get id -> ' + petId);

    web3.eth.getAccounts(function(error, accounts) {
      if(error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        // Execute adopt as a transaction by sending account
        return instance.get_pokemon(petId);
      }).then(function(result) {
        console.log(result);
        return App.markPokemon();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },
  // 刪除訓練師資料
  delete_pokemon: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));
    console.log('delete id -> ' + petId);

    web3.eth.getAccounts(function(error, accounts) {
      if(error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Adoption.deployed().then(function(instance) {
        // Execute adopt as a transaction by sending account
        return instance.delete_pokemon(account, petId);
      }).then(function(result) {
        console.log(result);
        return App.markPokemon();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});