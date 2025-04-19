//TEST FILE GET RID OF LATER
//TO TEST FOR DB DO npm install mysql2
 //npm install dotenv
//node seed.js

const db = require('./db');   

async function main() {
  try {
    
    const [deliRes] = await db.execute(
      `INSERT INTO Deli (name, address, phone, place_id)
       VALUES (?, ?, ?, ?)`,
      ['Bob’s Deli', '123 Main St, New York, NY', '555‑1234', 'place_abc123']
    );
    const deliId = deliRes.insertId;

    
    const [sandRes] = await db.execute(
      `INSERT INTO Sandwich (name, description)
       VALUES (?, ?)`,
      ['Bacon Egg & Cheese', 'Classic NYC BEC on a kaiser roll']
    );
    const sandwichId = sandRes.insertId;

   
    await db.execute(
      `INSERT INTO Price_listing
       (deli_id, sandwich_id, submitted_by, price, listing_type, is_approved)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [deliId, sandwichId, null, 5.75, 'business', true]
    );

    console.log(' Seed data inserted successfully!');
  } catch (err) {
    console.error('❌ Error seeding DB:', err);
  } finally {
    db.end(); 
  }
}

main();
