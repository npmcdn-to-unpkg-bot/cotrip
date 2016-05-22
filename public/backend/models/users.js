module.exports = function (sequelize, Sequelize) {
    return sequelize.define('users', {
        id: {
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            field: 'id'
        },
        first_name: {
            type: Sequelize.STRING,
            field: 'first_name'
        },
        last_name: {
            type: Sequelize.STRING,
            field: 'last_name'
        },
        username: {
            type: Sequelize.STRING,
            field: 'username'
        },
        password: {
            type: Sequelize.STRING,
            field: 'password'
        }
    }, {
        freezeTableName: true // model tableName will be the same as the model name
    })
};