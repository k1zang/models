A powerful tool designed to simplify data fetching in a model-driven way, using ORM techniques to streamline and ease the maintenance of API-dependent code.

## Installation

```bash
npm install @k1zang/models
# or
yarn add @k1zang/models
```

Import and setup

```typescript
import Model from "@k1zang/models";

class User extends Model {
  static apiUri = "http://loaclhost:8000/graphql";
  static mode = "graphql"; // or 'rest', 'local'
}
```

This tool is designed for professionals who require flexibility. Simply override the components you need to customize.

## Usage

You can then use the methods provided by the Model class to interact with your User model:

```typescript
// Fetch the first user
const user = await User.first();

// Fetch all users
const users = await User.all();

// Create a new user
const newUser = await User.create({
  name: "John Doe",
  email: "john.doe@example.com",
});

// Graphql queries
const user = await User.gql(`query { user { id name } }`).query();
// gql method returns the Apollo client api
```

Note: refer to the source code and comments for more detailed information about each method and how to use them.
