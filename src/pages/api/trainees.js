import pool from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { limit = 15, offset = 0 } = req.query; 

    try {
      const dataQuery = 'SELECT * FROM trainees ORDER BY id ASC LIMIT $1 OFFSET $2;';
      const countQuery = 'SELECT COUNT(*) FROM trainees;'; 

      const [dataResult, countResult] = await Promise.all([
        pool.query(dataQuery, [parseInt(limit), parseInt(offset)]),
        pool.query(countQuery),
      ]);

      const totalRows = parseInt(countResult.rows[0].count);

      res.status(200).json({
        trainees: dataResult.rows,
        totalRows,
      });
    } catch (error) {
      console.error('Error fetching trainees:', error);
      res.status(500).json({ error: 'Failed to fetch trainees' });
    }
  }
  else if (req.method === 'POST') {
    const { name, email, phone, image, gender, skill, batch, url } = req.body;

    if (!name || !email || !phone || !image || !gender || !skill || !batch || !url) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const query = `
        INSERT INTO trainees (name, email, phone, image, gender, skill, batch, url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
      `;
      const values = [name, email, phone, image, gender, skill, batch, url];
      const { rows } = await pool.query(query, values);
      res.status(201).json({ message: 'Trainee added successfully', trainee: rows[0] });
    } catch (error) {
      console.error('Error adding trainee:', error);
      res.status(500).json({ error: 'Failed to add trainee' });
    }
  } else if (req.method === 'PATCH') {
    // Handle PATCH request
    const { id } = req.query; // Expecting the trainee ID as a query parameter
    const { name, email, phone, image, gender, skill, batch, url } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Trainee ID is required' });
    }

    try {
      const query = `
        UPDATE trainees
        SET name = COALESCE($1, name),
            email = COALESCE($2, email),
            phone = COALESCE($3, phone),
            image = COALESCE($4, image),
            gender = COALESCE($5, gender),
            skill = COALESCE($6, skill),
            batch = COALESCE($7, batch),
            url = COALESCE($8, url)
        WHERE id = $9
        RETURNING *;
      `;
      const values = [name, email, phone, image, gender, skill, batch, url, id];
      const { rows } = await pool.query(query, values);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Trainee not found' });
      }

      res.status(200).json({ message: 'Trainee updated successfully', trainee: rows[0] });
    } catch (error) {
      console.error('Error updating trainee:', error);
      res.status(500).json({ error: 'Failed to update trainee' });
    }
  } else if (req.method === 'DELETE') {
    // Handle DELETE request
    const { id } = req.query; // Expecting the trainee ID as a query parameter

    if (!id) {
      return res.status(400).json({ error: 'Trainee ID is required' });
    }

    try {
      const query = 'DELETE FROM trainees WHERE id = $1 RETURNING *;';
      const { rows } = await pool.query(query, [id]);

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Trainee not found' });
      }

      res.status(200).json({ message: 'Trainee deleted successfully', trainee: rows[0] });
    } catch (error) {
      console.error('Error deleting trainee:', error);
      res.status(500).json({ error: 'Failed to delete trainee' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
