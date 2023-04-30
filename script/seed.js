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
    User.create({ username: 'cody', password: '123' }),
    User.create({ username: 'murphy', password: '123' }),
  ]);

  const cohorts = await Promise.all([
    Cohort.create({
      name: 'Spring 2023',
      menteeApplicationFormID: '1TZtuj7JbPp4OGFem9Ha1EmnckFT9g-pAHVsl4mrNfII',
      isCurrent: true,
    }),
  ]);

  /**
   *
   * CREATING MENTEES
   *
   */
  // const mentees = await Promise.all(
  //   [
  //     Mentee.create({
  //       firstName: 'Anthony',
  //       lastName: 'Zhang',
  //       email: 'zhang.anthony97@gmail.com',
  //       pronouns: 'he/him',
  //       phoneNum: '(294)203-2934',
  //       location: 'Brooklyn, NY',
  //       gendersAndSexualities: 'PoC, male, immigrant',
  //       raceEthnicity: "I'd rather not say",
  //       dateOfBirth: '06/01/1923',
  //     }),
  //     // Mentee.create({
  //     //   firstName: 'Anthony',
  //     //   lastName: 'Zhang',
  //     //   email: 'zhang.anthony97@gmail.com',
  //     //   pronouns: 'he/him',
  //     //   phoneNum: '(294)203-2934',
  //     //   location: 'Brooklyn, NY',
  //     //   genSexID: 'PoC, male, immigrant',
  //     //   raceEthnicity: "I'd rather not say",
  //     //   dateOfBirth: '06/01/1923',
  //     // }),
  //     Mentee.create({
  //       firstName: 'OIT',
  //       lastName: 'Mentee',
  //       email: 'oit-mentee@gmail.com',
  //       pronouns: 'she/her',
  //       phoneNum: '(123)203-4444',
  //       location: 'Rochester, NY',
  //       gendersAndSexualities: 'n/a',
  //       raceEthnicity: "I'd rather not say",
  //       dateOfBirth: '05/21/1972',
  //     }),
  //     Mentee.create({
  //       firstName: 'Other',
  //       lastName: 'Mentee',
  //       email: 'other-mentee@gmail.com',
  //       pronouns: 'they/them',
  //       phoneNum: '(456)232-8888',
  //       location: 'Maspeth, NY',
  //       gendersAndSexualities: 'test',
  //       raceEthnicity: "I'd rather not say",
  //       dateOfBirth: '10/11/2022',
  //     }),
  //   ],
  //   { ignoreDuplicates: true }
  // );

  console.log(`seeded ${users.length} users`);
  console.log(`seeded successfully`);
  return {
    users: {
      cody: users[0],
      murphy: users[1],
    },
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
