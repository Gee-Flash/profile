import pool from '../../lib/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { limit = 15, offset = 0 } = req.query;
  
    const trainees = [
      {
        id: 1,
        name: "John Doe",
        skill: "Frontend Development",
        batch: "2024",
        url: "https://portfolio-johndoe.vercel.app",
        gender: "Male",
        image: "/images/profile1.jpg"
      },
      {
        id: 2,
        name: "Jane Smith",
        skill: "Full Stack Development",
        batch: "2024",
        url: "https://portfolio-janesmith.vercel.app",
        gender: "Female",
        image: "/images/profile2.jpg"
      },
      {
        id: 3,
        name: "Alex Johnson",
        skill: "Backend Development",
        batch: "2024",
        url: "https://portfolio-alexj.vercel.app",
        gender: "Male",
        image: "/images/profile3.jpg"
      },
      {
        id: 4,
        name: "Sarah Williams",
        skill: "UI/UX Design",
        batch: "2024",
        url: "https://portfolio-sarahw.vercel.app",
        gender: "Female",
        image: "/images/profile4.jpg"
      },
      {
        id: 5,
        name: "Michael Brown",
        skill: "DevOps",
        batch: "2024",
        url: "https://portfolio-michaelb.vercel.app",
        gender: "Male",
        image: "/images/profile5.jpg"
      },
      {
        id: 6,
        name: "Emily Davis",
        skill: "Mobile Development",
        batch: "2024",
        url: "https://portfolio-emilyd.vercel.app",
        gender: "Female",
        image: "/images/profile6.jpg"
      }
    ];

    const startIndex = Number(offset);
    const endIndex = startIndex + Number(limit);
    const paginatedTrainees = trainees.slice(startIndex, endIndex);

    res.status(200).json({
      trainees: paginatedTrainees,
      totalRows: trainees.length
    });
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