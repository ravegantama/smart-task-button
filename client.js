// client.js

window.TrelloPowerUp.initialize({
  'card-buttons': function(t, options) {
    return t.card('name', 'idList', 'list').then(function(card) {
      const listName = card.list.name;

      let nextListName = null;
      let buttonText = '';

      if (listName.startsWith('To Do')) {
        nextListName = listName.replace('To Do', 'In Progress');
        buttonText = 'Start Task';
      } else if (listName.startsWith('In Progress')) {
        nextListName = listName.replace('In Progress', 'Review');
        buttonText = 'Finish Task';
      } else {
        return [];
      }

      return [{
        icon: 'https://cdn-icons-png.flaticon.com/512/545/545680.png',
        text: buttonText,
        callback: function(t) {
          return t.board('lists').then(function(board) {
            const targetList = board.lists.find(l => l.name.trim() === nextListName.trim());

            if (targetList) {
              return t.getRestApi().put(`/cards/${card.id}`, { idList: targetList.id }).then(function() {
                return t.closePopup();
              });
            } else {
              alert('No se encontró la lista destino: ' + nextListName);
              return t.closePopup();
            }
          });
        }
      }];
    });
  }
});
