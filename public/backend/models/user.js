module.exports = function (sequelize, Sequelize) {
    return sequelize.define('user', {
        id: {
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        address_id: {
            type: Sequelize.UUID
        },
        role: {
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true // model tableName will be the same as the model name
    })
};