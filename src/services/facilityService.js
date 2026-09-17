const db = require('../config/db');

async function getAllFacilities(page = 1, limit = 5) {
  const offset = (page - 1) * limit;
  
  const dataQuery = 'SELECT * FROM facilities ORDER BY id ASC LIMIT $1 OFFSET $2';
  const countQuery = 'SELECT COUNT(*) AS total FROM facilities';

  const [dataRes, countRes] = await Promise.all([
    db.query(dataQuery, [limit, offset]),
    db.query(countQuery)
  ]);

  const total = parseInt(countRes.rows[0].total, 10);
  const totalPages = Math.ceil(total / limit);

  return {
    facilities: dataRes.rows,
    pagination: { page, limit, total, totalPages }
  };
}

async function getFacilityById(id) {
  const res = await db.query('SELECT * FROM facilities WHERE id = $1', [id]);
  return res.rows[0] || null;
}

async function createFacility({ name, address, erp_capacity }) {
  const res = await db.query(
    'INSERT INTO facilities (name, address, erp_capacity) VALUES ($1, $2, $3) RETURNING *',
    [name, address, parseInt(erp_capacity, 10)]
  );
  return res.rows[0];
}

async function updateFacility(id, { name, address, erp_capacity }) {
  const res = await db.query(
    'UPDATE facilities SET name = $1, address = $2, erp_capacity = $3 WHERE id = $4 RETURNING *',
    [name, address, parseInt(erp_capacity, 10), id]
  );
  return res.rows[0];
}

async function deleteFacility(id) {
  await db.query('DELETE FROM facilities WHERE id = $1', [id]);
}

module.exports = {
  getAllFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility
};