'use strict';

const {
  db,
  models: { User, Mentee, Focus, Cohort },
} = require('../server/db');

/**
 * seed - this function clears the database, updates tables to
 *      match the models, and populates the database.
 */
async function seed() {
  await db.sync({ force: true }); // clears db and matches models to tables
  console.log('db synced!');

  const users = await Promise.all([
    User.create({
      username: 'testAcc1',
      firstName: 'Orange',
      lastName: 'Apple',
      password: 'test123',
      email: 'testaccount1@gmail.com',
    }),
    User.create({
      username: 'testAcc2',
      firstName: 'Green',
      lastName: 'Banana',
      password: 'test123',
      email: 'testaccount2@gmail.com',
    }),
    User.create({
      username: 'testAcc3',
      firstName: 'Yellow',
      lastName: 'Grapefruit',
      password: 'test123',
      email: 'testaccount3@gmail.com',
    }),
    User.create({
      username: 'testAcc4',
      firstName: 'Red',
      lastName: 'Persimmon',
      password: 'test123',
      email: 'testaccount4@gmail.com',
    }),
  ]);

  const cohorts = await Promise.all([
    Cohort.create({
      cohortId: 'SPRING2023',
      name: 'Spring 2023',
      menteeApplicationFormID: '1TZtuj7JbPp4OGFem9Ha1EmnckFT9g-pAHVsl4mrNfII',
      isCurrent: true,
    }),
    Cohort.create({
      cohortId: 'FALL2022',
      name: 'Fall 2022',
      menteeApplicationFormID: '1TZtuj7JbPp4OGFem9Ha1EmnckFT9g-pAHVsl4mrNfII',
      isCurrent: false,
    }),
    Cohort.create({
      cohortId: 'SPRING2022',
      name: 'Spring 2022',
      menteeApplicationFormID: '1TZtuj7JbPp4OGFem9Ha1EmnckFT9g-pAHVsl4mrNfII',
      isCurrent: false,
    }),
  ]);

  console.log(`Seeded ${users.length} users.`);
  console.log(`Seeded ${cohorts.length} cohorts.`);

  console.log(`seeded successfully`);
  return {
    users,
    cohorts,
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
