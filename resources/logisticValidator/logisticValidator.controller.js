/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const Excel = require('exceljs');
const moment = require('moment');
/* eslint-disable no-await-in-loop */
const {
  save,
  saveSeller,
  saveRoute,
  ViewSellers,
  ViewWithdrawal,
  WithdrawalResume,
  findAllAndPaginate,
  preparFilters
} = require('./logisticTrain.model');
const { getSellers: listarMaestro } = require('../../services/siebel');

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array);
  }
}

const Controller = {
  saveWithdrawal: (args) =>
    new Promise(async (resolve, reject) => {
      try {
        const result = await save(args);
        return resolve(result);
      } catch (error) {
        return reject(error);
      }
    }),
  loadSellers: () =>
    new Promise(async (resolve, reject) => {
      try {
        const resultSellers = await listarMaestro();
        await asyncForEach(resultSellers, async (element) => {
          await saveSeller(element);
        });
        return resolve(resultSellers);
      } catch (error) {
        return reject(error);
      }
    }),
  loadRoute: (dataReq) =>
    new Promise(async (resolve, reject) => {
      try {
        let rsp = null;
        await asyncForEach(dataReq, async (element) => {
          rsp = await saveRoute(element);
        });
        return resolve(rsp);
      } catch (error) {
        return reject(error);
      }
    }),
  getSellers: (params) =>
    new Promise(async (resolve, reject) => {
      try {
        let result = await ViewSellers.findAll({
          where: { rut_seller: params.rut }
        });
        result = result.reduce((pv, cv) => {
          const tmp = pv;
          if (tmp.length === 0) {
            tmp.push({
              id: cv.id,
              razon_social_seller: cv.razon_social_seller,
              nombre_corto: cv.nombre_corto,
              rut_seller: cv.rut_seller,
              dv_seller: cv.dv_seller,
              facility_seller: cv.facility_seller,
              calle_seller: cv.calle_seller,
              numero_seller: cv.numero_seller,
              departamento_seller: cv.departamento_seller,
              comuna_seller: cv.comuna_seller,
              referencia_seller: cv.referencia_seller,
              horario_inicio_seller: cv.horario_inicio_seller,
              horario_cierre_seller: cv.horario_cierre_seller,
              contacto_entrega_seller: cv.contacto_entrega_seller,
              telefono_seller: cv.telefono_seller ? [cv.telefono_seller] : [],
              correo_seller: cv.correo_seller ? [cv.correo_seller] : []
            });
          }
          const idx = tmp.findIndex((element) => element.id === cv.id);
          if (idx > -1) {
            if (cv.telefono_seller && !tmp[idx].telefono_seller.includes(cv.telefono_seller)) {
              tmp[idx].telefono_seller.push(cv.telefono_seller);
            }
            if (cv.correo_seller && !tmp[idx].correo_seller.includes(cv.correo_seller)) {
              tmp[idx].correo_seller.push(cv.correo_seller);
            }
          } else {
            tmp.push({
              id: cv.id,
              razon_social_seller: cv.razon_social_seller,
              nombre_corto: cv.nombre_corto,
              rut_seller: cv.rut_seller,
              dv_seller: cv.dv_seller,
              facility_seller: cv.facility_seller,
              calle_seller: cv.calle_seller,
              numero_seller: cv.numero_seller,
              departamento_seller: cv.departamento_seller,
              comuna_seller: cv.comuna_seller,
              referencia_seller: cv.referencia_seller,
              horario_inicio_seller: cv.horario_inicio_seller,
              horario_cierre_seller: cv.horario_cierre_seller,
              contacto_entrega_seller: cv.contacto_entrega_seller,
              telefono_seller: cv.telefono_seller ? [cv.telefono_seller] : [],
              correo_seller: cv.correo_seller ? [cv.correo_seller] : []
            });
          }
          return tmp;
        }, []);
        return resolve(result);
      } catch (error) {
        return reject(error);
      }
    }),
  getWithdrawal: (params) =>
    new Promise(async (resolve, reject) => {
      try {
        const filters = preparFilters(params);
        const result = await findAllAndPaginate(filters, ViewWithdrawal);
        // let result = await ViewWithdrawal.findAll(filters);
        const response = {
          values: result[1],
          total: result[0],
          success: true
        };
        return resolve(response);
        // return resolve(result);
      } catch (error) {
        return reject(error);
      }
    }),
  getWithdrawalResume: (params) =>
    new Promise(async (resolve, reject) => {
      try {
        const filters = preparFilters(params);
        const result = await findAllAndPaginate(filters, WithdrawalResume);
        const response = {
          values: result[1],
          total: result[0],
          success: true
        };
        return resolve(response);
      } catch (error) {
        return reject(error);
      }
    }),
  downloadAction: (req, res) => {
    return new Promise((resolve, reject) => {
      const workbook = new Excel.Workbook();
      workbook.creator = 'Reportería MAT';
      workbook.lastModifiedBy = 'Reportería MAT';
      workbook.created = new Date();
      workbook.modified = new Date();
      workbook.lastPrinted = new Date();
      let page = 1;
      let row = 1;
      let item = null;
      let rowData = null;
      let now = moment().format('YYYYMMDDHHmmss');

      // eslint-disable-next-line no-underscore-dangle
      const _columns = [
        { header: 'Fecha', key: 'fecha' },
        { header: 'Ruta', key: 'ruta' },
        { header: 'Hora', key: 'hora' },
        { header: 'Transporte', key: 'compania' },
        { header: 'Patente', key: 'patente' },
        { header: 'Rut Proveedor', key: 'rut_proveedor' },
        { header: 'DV Proveedor', key: 'dv_proveedor' },
        { header: 'Proveedor', key: 'razon_social' },
        { header: 'Cantidad Soc', key: 'cantidad_soc' },
        { header: 'Comuna', key: 'comuna' },
        { header: 'Ventana', key: 'ventana' },
        { header: 'ETA', key: 'eta' },
        { header: 'Flujo', key: 'flujo' },
        { header: 'Estado', key: 'estado_retiro' },
        { header: 'Responsable', key: 'responsable' },
        { header: 'Motivo', key: 'motivo' },
        { header: 'Comentario', key: 'comentario' }
      ];

      findAllAndPaginate(preparFilters(req.query), ViewWithdrawal).then((results) => {
        let sheet = workbook.addWorksheet(`Rutas ${page}`);
        sheet.columns = _columns;
        sheet.autoFilter = 'A1:N1';

        // eslint-disable-next-line no-restricted-syntax
        for (item of results[1]) {
          if (row === 0) {
            // eslint-disable-next-line no-plusplus
            page++;
            sheet.commit();
            sheet = workbook.addWorksheet(`Rutas-${page}`);
            sheet.columns = _columns;
            sheet.autoFilter = 'A1:N1';
          }

          rowData = {
            fecha: moment(item.fecha).format('YYYY-MM-DD'),
            ruta: item.ruta,
            hora: item.hora,
            compania: item.compania,
            patente: item.patente,
            rut_proveedor: item.rut_proveedor,
            dv_proveedor: item.digito_verificador_proveedor,
            razon_social: item.razon_social,
            cantidad_soc: item.cantidad_soc,
            comuna: item.comuna,
            ventana: item.ventana,
            eta: item.eta,
            flujo: item.flujo,
            proposito_viaje: item.proposito_viaje,
            estado_retiro: item.estado_del_retiro,
            responsable: item.responsable,
            motivo: item.motivo,
            comentario: item.comentario
          };

          sheet.addRow(rowData).commit();
          row = row >= 60000 ? 0 : row + 1;
        }
        now = moment().format('YYYYMMDDHHmmss');
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', `${'attachment; filename=rutas_'}${now}.xlsx`);
        resolve(workbook.xlsx.write(res));
        /*s2return workbook.xlsx
          .write(res)
          .then(resolve)
          .catch(reject);*/
      });
    });
  }
};

module.exports = Controller;
