import { getStackServerApp } from "@stackframe/stack";
import pool from "@/db";

export default async function handler(req, res) {
  const app = getStackServerApp();
  const user = await app.getUser({ jwt: req.headers.authorization?.split(' ')[1] });
  
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get favorites count
    const favoritesResult = await pool.query(
      'SELECT COUNT(*) FROM favorites WHERE user_id = $1',
      [user.id]
    );
    const favoritesCount = parseInt(favoritesResult.rows[0].count, 10);
    
    // Get reviews count (if you have this functionality)
    const reviewsResult = await pool.query(
      'SELECT COUNT(*) FROM reviews WHERE user_id = $1',
      [user.id]
    );
    const reviewsCount = reviewsResult.rows[0] ? parseInt(reviewsResult.rows[0].count, 10) : 0;
    
    return res.status(200).json({
      reviewsCount,
      favoritesCount,
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}