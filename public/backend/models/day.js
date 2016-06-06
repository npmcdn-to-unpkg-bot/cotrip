module.exports = function (sequelize, Sequelize) {
    return sequelize.define('day', {
        id: {
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        trip_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        date: {
            type: Sequelize.DATEONLY,
            allowNull: false
        }
    }, {
        freezeTableName: true // model tableName will be the same as the model name
    })
};