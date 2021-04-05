'use strict';
module.exports = function(app) {
    var choreGoblin = require('../controller/appController');
    // choreGoblin Routes
    app.route('/api/v1/houses')
        .post(choreGoblin.create_a_house);
    app.route('/api/v1/houses/:houseCode')
        .post(choreGoblin.read_a_house)
        .put(choreGoblin.update_a_house)
        .delete(choreGoblin.delete_a_house);
    app.route('/api/v1/goblins')
        .post(choreGoblin.create_a_goblin);
    app.route('/api/v1/goblins/:goblinId')
        .get(choreGoblin.read_a_goblin)
        .put(choreGoblin.update_a_goblin)
        .delete(choreGoblin.delete_a_goblin);
    app.route('/api/v1/goblinList/:houseId')
        .get(choreGoblin.read_goblin_list);
    app.route('/api/v1/choreList/:houseId')
        .get(choreGoblin.read_chore_list);
    app.route('/api/v1/chores')
        .post(choreGoblin.create_a_chore);
    app.route('/api/v1/chores/:choreId')
        .get(choreGoblin.read_a_chore)
        .put(choreGoblin.update_a_chore)
        .delete(choreGoblin.delete_a_chore);
    app.route('/api/v1/houses/fight/:houseId')
        .get(choreGoblin.goblin_fight);
    app.route('/api/v1/chores/complete/:choreId')
        .get(choreGoblin.complete_a_chore);
    app.route('/api/v1/history/:houseId')
        .get(choreGoblin.read_week_list);
    app.route('/api/v1/history/chores/:weekId')
        .get(choreGoblin.read_chore_history_list);
    app.route('/api/v1/history/fight/:weekId')
        .get(choreGoblin.goblin_fight_history);
};