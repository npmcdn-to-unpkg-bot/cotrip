module.exports = function (sequelize, Sequelize) {
    return sequelize.define('activity', {
        id: {
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        category_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING
        },
        address_id: {
            type: Sequelize.UUID
        }
    }, {
        freezeTableName: true // model tableName will be the same as the model name
    })
};