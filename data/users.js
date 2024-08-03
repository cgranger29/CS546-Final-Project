import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import { daycares } from "../config/mongoCollections.js";
import validation from "../validation.js";
import bcryptjs from "bcryptjs";

// First, we want to create a user
const exportMethod = {
  async createUser(firstname, lastname, email, password, town, zipcode) {
    // Checking
    firstname = validation.checkString(firstname, "First name").trim();
    lastname = validation.checkString(lastname, "First name").trim();
    firstname = validation.checkNames(firstname, "First name");
    lastname = validation.checkNames(lastname, "Last name");

    // Checking
    firstname = validation.checkString(firstname, "First name");
    lastname = validation.checkString(lastname, "Last name");
    firstname = validation.checkNames(firstname, "First name");
    lastname = validation.checkNames(lastname, "Last name");

    // Check password and then hash it
    password = validation.checkPassword(password, "Password");
    const hash = await bcryptjs.hash(password, 16);

    // Check email
    email = validation.checkEmail(email, "Email");
    email = email.toLowerCase();

    const userCollection = await users();
    const existingUser = await userCollection.findOne({ email: email });
    if (existingUser) {
      throw "User already exists";
    }

    // Create new user
    const newUser = {
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: hash,
      location: { town: town, zipcode: zipcode },
      kids: [],
      favorites: [],
      reviews: [],
      role: "user",
    };

    // Insert info into db
    const insertInfo = await userCollection.insertOne(newUser);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
      throw "Could not add the product.";
    }

    const newId = insertInfo.insertedId.toString();
    const user = await this.getUserById(newId);

    return user;
  },

  // Delete user
  async deleteuser(id) {
    id = id.toString();
    id = validation.checkId(id);

    const userCollection = await users();
    const deletion = await userCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });

    if (!deletion) {
      throw "Could not delete user with specified ID.";
    }

    return `${deletion.firstName} has been successfully deleted!`;
  },

  // Change user information
  async changeInfo(id, userInfo) {
    id = validation.checkId(id);

    if (userInfo.firstName) {
      userInfo.firstName = validation.checkString(
        userInfo.firstname,
        "First name"
      );
    }

    if (userInfo.lastName) {
      userInfo.lastName = validation.checkString(
        userInfo.lastName,
        "Last name"
      );
    }

    if (userInfo.email) {
      userInfo.email = validation.checkEmail(userInfo.email, "Email");
    }

    if (userInfo.password) {
    }

    // might need to do a deeper search?
    if (userInfo.location.town) {
      userInfo.location.town = validation.checkString(
        userInfo.location.town,
        "Town"
      );
    }

    if (userInfo.location.zipcode) {
      userInfo.location.zipcode = validation.checkZipcode(
        userInfo.location.zipcode,
        "Zipcode"
      );
    }

    const userCollection = await users();
    const updateInfo = await userCollection.findOneAndUpdate({
      _id: new ObjectId(id),
    });
    if (!updateInfo) {
      throw "Error: Update failed, could not find user with specified ID.";
    }

    return updateInfo;
  },

  // Get user by their username
  async getUser(username) {},

  // Get user by their ID
  async getUserById(id) {
    id = validation.checkId(id);

    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      throw "Error: User not found.";
    }

    return user;
  },

  // Delete user
  async deleteuser(id) {
    id = id.toString();
    id = validation.checkId(id);

    const userCollection = await users();
    const deletion = await userCollection.findOneAndDelete({
      _id: new ObjectId(id),
    });

    if (!deletion) {
      throw "Could not delete user with specified ID.";
    }

    return `${deletion.firstName} has been successfully deleted!`;
  },
  // Add favorite daycare
  // When a user clicks on the heart on the daycare page, they will automatically have the daycare's id added to their favorite list
  async addFavDaycare(userId, daycareId) {
    userId = userId.toString();
    daycareId - daycareId.toString();

    // Check IDs
    userId = validation.checkId(userId);
    daycareId = validation.checkId(daycareId);

    const userCollection = await users();
    const daycareCollection = await daycares();

    // First, lets find the user who is doing the search
    const user = await userCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw "User not found.";
    }

    // Now we want to search for the daycare id to see if it even exists
    const daycare = await daycareCollection.findOne({
      _id: new ObjectId(daycareId),
    });
    if (!daycare) {
      throw "Daycare not found.";
    }

    // Now, lets check if this user already has this daycare in their favorites list. If not, it will be added
    const isFavorite = await userCollection.findOne({ favorites: daycare });
    if (isFavorite) {
      throw "Daycare already exists in user's favorites list";
    }

    // If we got to this point, user does not have daycare in their list. Now we can add it
    const addFavorite = userCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $push: { favorites: new ObjectId(daycareId) } }
    );
    if (addFavorite.modifiedCount === 0) {
      throw "Daycare could not be found or removed";
    }

    const newId = daycareId.toString();
    const favDaycare = await this.getFavDayCare(newId);

    return favDaycare;
  },

  // Get user by their username
  async getUser(username) {},

  // Get favorite daycares of user
  async getFavDayCare(id) {
    id = id.toString();

    // Check ID
    id = validation.checkId(id);

    // Find the daycare through given ID
    const usersCollection = await users();
    const favDaycare = await usersCollection.findOne({
      favorites: new ObjectId(id),
    });

    if (!favDaycare) {
      throw "Error: Daycare not found.";
    }

    return favDaycare;
  },

  // Remove daycare
  async removeFavDaycare(userId, daycareId) {
    userId = userId.toString();
    daycareId = daycareId.toString();

    // Check ID
    userId = validation.checkId(userId);
    daycareId = validation.checkId(daycareId);

    // Time to remove
    const usersCollection = await users();
    const delDaycare = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { favorites: new ObjectId(daycareId) } }
    );

    if (delDaycare.modifiedCount === 0) {
      throw "Error: Could not remove daycare from favorites.";
    }

    return "Successfully deleted daycare!!";
  },

  // If they want to add a child
  async addChild(id, firstname, lastname, age) {
    id = id.toString();

    // Check ID
    id = validation.checkId(id);

    const usersCollection = await users();

    const newKidInfo = {
      firstName: firstname,
      lastName: lastname,
      age: age,
    };

    const updateInfo = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $push: { kids: newKidInfo } }
    );
    if (updateInfo.modifiedCount === 0) {
      throw "Could not add child.";
    }

    return newKidInfo;
  },

  // If they want to remove a child
  async removeChild(id, name) {
    const userCollection = await users();
    const byeChild = await userCollection.updateOne(
      { _id: new ObjectId(id) },
      { $pull: { kids: { firstName: name } } }
    );

    if (byeChild.modifiedCount === 0) {
      throw "Child could not be found or removed";
    }

    return `${byeChild.firstName} has been successfully deleted!`;
  },

  // Add favorite daycare
  async addFavDaycare() {},

  async removeFavDaycare() {},

  // Add review
  async addReview() {},

  // Delete review
  async deleteReview() {},
  async loginUser(email, password) {
    if (!email) {
      throw new Error("Must provide an email.");
    }
    if (!password) {
      throw new Error("Must provide a password.");
    }
    if (!validation.validateEmail(email)) {
      throw new Error("Invalid email provided.");
    }

    const formattedEmail = email.trim().toLowerCase();
    const userCollection = await users();
    const resp = await userCollection.findOne({ email: formattedEmail });

    if (!resp) {
      throw new Error("Either the email address or password is invalid");
    } else {
      const dbPassword = resp["password"];

      let passwordCompare = false;

      passwordCompare = await bcryptjs.compare(password, dbPassword);

      if (passwordCompare) {
        const respObj = {};
        respObj["firstName"] = resp["firstName"];
        respObj["lastName"] = resp["lastName"];
        respObj["emailAddress"] = resp["emailAddress"];
        respObj["role"] = resp["role"];
        return respObj;
      } else {
        throw new Error("Either the email address or password is invalid");
      }
    }
  },
};

export default exportMethod;
