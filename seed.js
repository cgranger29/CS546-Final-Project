import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import { userData } from "./data/index.js";
import { dayCareData } from "./data/index.js";

// Use this to populate some users

const db = await dbConnection();
await db.dropDatabase();

try {
  const one = await userData.createUser(
    "Katherine",
    "Rijo",
    "loveGenshin@gmail.com",
    "Ilikecheese1@",
    "queens",
    1111
  );

  const two = await userData.createUser(
    "Ren",
    "Kozaki",
    "loserLuck@yahoo.com",
    "bringMeHome@44449",
    "manhattan",
    10022
  );

  const three = await userData.createUser(
    "Lian",
    "Jenova",
    "mymommyjenova@gmail.com",
    "welcomeTOtheclub44!",
    "gaia",
    45644
  );

  const four = await userData.createUser(
    "Tifa",
    "Lockhart",
    "puncHINGstuff555@aol.com",
    "babaBOOEY@@@1111",
    "thePlanet",
    12345
  );

  const five = await userData.createUser(
    "Hawkeye",
    "Lionheart",
    "hhlookies411@yahoo.com",
    "dffrfvF##221",
    "brooklyn",
    55555
  );

  // Seed data
  const firstDaycare = await dayCareData.addDaycare(
    "Happy Kids", // name
    "HorsePull748*% ", // password
    "A great place for kids.", // introduction
    "123 Happy St", // address
    "Happyville", // town
    "NY", // state
    "12345", // zipcode
    "9am - 5pm", // businessHours
    "contact@happykids.com", // email
    "1-123-456-7890", // phone
    "http://www.happykids.com", // website (optional, can be null or undefined if not provided)
    "5", // yearsInBusiness (string)
    "true", // availability (optional, can be null or undefined if not provided)
    "Vegetarian, Non-Vegetarian", // lunchChoices (string, comma-separated)
    "Full day, Half day", // duration (string, comma-separated)
    "2000-2500" // tuitionRange (optional, can be null or undefined if not provided)
  );

  const secondDaycare = await dayCareData.addDaycare(
    "Bright Future",
    "HorsePull748*%",
    "Focused on early childhood development.",
    "456 Bright Rd",
    "Sunnyvale",
    "CA",
    "67890",
    "8am - 4pm",
    "info@brightfuture.com",
    "1-987-654-3210",
    "http://www.brightfuture.com",
    "10",
    "true",
    "Vegetarian",
    "Full day",
    "2500-3000"
  );

  const thirdDaycare = await dayCareData.addDaycare(
    "Little Learners",
    "SecurePass1!",
    "A safe environment where learning happens through play.",
    "789 Little Lane",
    "Springfield",
    "IL",
    "54321",
    "7am - 6pm",
    "contact@littlelearners.com",
    "1-555-123-4567",
    "http://www.littlelearners.com",
    "8",
    "true",
    "Non-Vegetarian, Gluten-Free",
    "Half day, Full day",
    "2200-2750"
  );

  const fourthDaycare = await dayCareData.addDaycare(
    "Sunshine Academy",
    "BrightDay2@",
    "Where sunshine meets learning!",
    "101 Sunshine Blvd",
    "Greenwich",
    "CT",
    "11223",
    "9am - 5pm",
    "support@sunshineacademy.com",
    "1-444-555-6666",
    "http://www.sunshineacademy.com",
    "7",
    "false",
    "Vegetarian, Non-Vegetarian, Allergy-Free",
    "Full day",
    "3000-3200"
  );

  const fifthDaycare = await dayCareData.addDaycare(
    "Happy Feet",
    "HappyKids3#",
    "Nurturing and fun environment for all kids.",
    "202 Happy St",
    "Lakeside",
    "NV",
    "67890",
    "8am - 5pm",
    "contact@happyfeet.com",
    "1-333-444-5555",
    "http://www.happyfeet.com",
    "6",
    "true",
    "Vegetarian",
    "Full day, Half day",
    "2100-2300"
  );
} catch (e) {
  console.log("Seeding users went wrong. " + e);
}

console.log("Done seeding.");
