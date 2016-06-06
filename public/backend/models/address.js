module.exports = function (sequelize, Sequelize) {
    return sequelize.define('address', {
        id: {
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        street: {
            type: Sequelize.STRING
        },
        number: {
            type: Sequelize.STRING
        },
        city: {
            type: Sequelize.STRING
        },
        zip: {
            type: Sequelize.INTEGER
        },
        state: {
            type: Sequelize.STRING(2)
        },
        country: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true // model tableName will be the same as the model name
    })
};