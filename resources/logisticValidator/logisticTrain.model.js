const Sequelize = require('sequelize');
const { logisticTrainPg } = require('../../utils/sequelize');

const Model = {
  ViewSellers: logisticTrainPg.define(
    'v_sellers',
    {
      id: { type: Sequelize.UUID, require: false, primaryKey: true },
      razon_social_seller: { type: Sequelize.STRING, require: false },
      nombre_corto: { type: Sequelize.STRING, require: false },
      rut_seller: { type: Sequelize.INTEGER, require: false },
      dv_seller: { type: Sequelize.STRING, require: false },
      facility_seller: { type: Sequelize.STRING, require: false },
      calle_seller: { type: Sequelize.STRING, require: false },
      numero_seller: { type: Sequelize.INTEGER, require: false },
      departamento_seller: { type: Sequelize.STRING, require: false },
      comuna_seller: { type: Sequelize.STRING, require: false },
      referencia_seller: { type: Sequelize.STRING, require: false },
      horario_inicio_seller: { type: Sequelize.STRING, require: false },
      horario_cierre_seller: { type: Sequelize.STRING, require: false },
      contacto_entrega_seller: { type: Sequelize.STRING, require: false },
      cargo_seller: { type: Sequelize.STRING, require: false },
      telefono_seller: { type: Sequelize.STRING, require: false },
      correo_seller: { type: Sequelize.STRING, require: false },
      identificador: { type: Sequelize.STRING, require: false }
    },
    {
      schema: 'business',
      timestamps: false,
      freezeTableName: true
    }
  )
};

Model.sellerExist = async (rows) => {
  return new Promise(async (resolve, reject) => {
    try {
      let arraySeller = [];
      const promiseArray = [];
      if (rows && rows.length) {
        rows.forEach(async item => {
          promiseArray.push(Model.ViewSellers.findOne({
            where: { rut_seller: item.rutcliente }
          }));
        });
        const results = await Promise.all(promiseArray);
        //let sellerExistRow = results.filter((d)=> d != null);
        let sellerExistArray =  results.filter((o)=> o != null).map(o => o.rut_seller)
        let rowsClon = [];
        for (let index = 0; index < rows.length; index++) {
          const el = rows[index];
          if(!sellerExistArray.includes(el.rutcliente)){
            rowsClon.push(el);
          }
        }
        return resolve(rowsClon);
        //return resolve(arraySeller);
      } else {
        return reject(new Error('Ha ocurrido un error al tratar de obtener los datos.'));
      }
    } catch (error) {
      return reject(error);
    }
  });
};
module.exports = Model;
