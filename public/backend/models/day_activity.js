module.exports = function (sequelize, Sequelize) {
    return sequelize.define('day_activity', {
        day_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        activity_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        start_date: {
            type: Sequelize.DATE
        },
        end_date: {
            type: Sequelize.DATE
        }
    }, {
        freezeTableName: true // model tableName will be the same as the model name
    })
};