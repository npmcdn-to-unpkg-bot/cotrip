module.exports = function (sequelize, Sequelize) {
    return sequelize.define('trip', {
        id: {
            primaryKey: true,
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4
        },
        user_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        is_public: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        name: {
            type: Sequelize.STRING
        },
        participants: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        description: {
            type:Sequelize.STRING
        },
        start_date: {
            type: Sequelize.DATEONLY
        },
        end_date: {
            type: Sequelize.DATEONLY
        }
    }, {
        freezeTableName: true // model tableName will be the same as the model name
    })
};