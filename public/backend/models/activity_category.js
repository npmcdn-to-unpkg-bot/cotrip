module.exports = function (sequelize, Sequelize) {
    return sequelize.define('activity_category', {
        id: {
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true // model tableName will be the same as the model name
    })
};