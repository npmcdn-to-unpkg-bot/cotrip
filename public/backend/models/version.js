module.exports = function (sequelize, Sequelize) {
    return sequelize.define('version', {
        id: {
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        trip_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        version: {
            type: Sequelize.STRING,
            defaultValue: "0.0.1",
            allowNull: false
        },
        user_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        commit_m: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true // model tableName will be the same as the model name
    })
};