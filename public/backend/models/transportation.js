module.exports = function (sequelize, Sequelize) {
    return sequelize.define('transportation', {
        id: {
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        day_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        start_date: {
            type: Sequelize.DATEONLY
        },
        end_date: {
            type: Sequelize.DATEONLY
        },
        start_location: {
            type: Sequelize.STRING
        },
        end_location: {
            type: Sequelize.STRING
        },
        cost: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true // model tableName will be the same as the model name
    })
};