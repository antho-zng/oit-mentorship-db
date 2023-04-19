'use strict';

const {
  db,
  models: { User, Mentee, Focus },
} = require('../server/db');

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log('db synced!');

  /**
   *
   * CREATING USERS
   *
   */
  const users = await Promise.all([
    User.create({ username: 'cody', password: '123' }),
    User.create({ username: 'murphy', password: '123' }),
  ]);

  /**
   *
   * CREATING MENTEES
   *
   */
  const mentees = await Promise.all([
    Mentee.create({
      firstName: 'Anthony',
      lastName: 'Zhang',
      email: 'zhang.anthony97@gmail.com',
      candidateID: 'mentee-f23-2940',
    }),
    Mentee.create({
      firstName: 'OIT',
      lastName: 'Mentee',
      email: 'oit-mentee@gmail.com',
      candidateID: 'mentee-f23-3932',
    }),
    Mentee.create({
      firstName: 'Other',
      lastName: 'Mentee',
      email: 'other-mentee@gmail.com',
      candidateID: 'mentee-f23-4567',
    }),
  ]);

  /**
   *
   * CREATING FOCUSES
   *
   */

  const focuses = await Promise.all([
    Focus.create({
      name: 'Frontend Engineering',
      priority: 'Primary',
    }),
    Focus.create({
      name: 'Backend Engineering',
      priority: 'Secondary',
    }),
    Focus.create({
      name: 'Product Management',
      priority: 'Primary',
    }),
    Focus.create({
      name: 'Frontend Engineering',
      priority: 'Secondary',
    }),
    Focus.create({
      name: 'Marketing',
      priority: 'Primary',
    }),
    Focus.create({
      name: 'UI/UX',
      priority: 'Secondary',
    }),
  ]);

  console.log(`seeded ${users.length} users`);
  console.log(`seeded ${mentees.length} mentees`);
  console.log(`seeded successfully`);
  return {
    users: {
      cody: users[0],
      murphy: users[1],
    },
    mentees: {
      Anthony: mentees[0],
      oitMentee: mentees[1],
    },
  };
}

/*
 We've separated the `seed` function from the `runSeed` function.
 This way we can isolate the error handling and exit trapping.
 The `seed` function is concerned only with modifying the database.
*/
async function runSeed() {
  console.log('seeding...');
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log('closing db connection');
    await db.close();
    console.log('db connection closed');
  }
}

/*
  Execute the `seed` function, IF we ran this module directly (`node seed`).
  `Async` functions always return a promise, so we can use `catch` to handle
  any errors that might occur inside of `seed`.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
module.exports = seed;
