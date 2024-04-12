A powerful tool designed to simplify data fetching in a model-driven way, using ORM techniques to streamline and ease the maintenance of API-dependent code.

## Installation

First have your graphql server prepared then:

```bash
npm install @k1zang/models
```

or

```bash
yarn add @k1zang/models
```

Import and setup

```typescript
import BaseModel, { decorators } from "@k1zang/models";

abstract class AbstractModel extends BaseModel {
  static apiUri = "http://loaclhost:8000/graphql";
}

class CartModel extends AbstractModel {
  id?: number;
}

class UserModel extends AbstractModel {
  name?: string = "";

  @decorators.RelationOneToOne(CartModel)
  cart?: CartModel;
}
```

Designed for professionals who require flexibility.
Simply override the components you need to customize.

## Usage

**With Graphql**
The gql method returns the Apollo client api

```typescript
const user = await User.gql`query { user { cart { id } } }`.query();
```

**Too complicated? use Abstract api**
you can then use the methods provided by the Model class to interact with your User model:

```typescript
// Fetch all users
const users = await User.all();

// Create a new user
const newUser = await User.create({
  name: "John Doe",
});
```

**Relations are automatically resolved**

```typescript
(await User.first()).cart; // CartModel instance
```

Note: refer to the source code and comments for more detailed information about each method and how to use them.

## Contributing

Pull requests are welcome.
For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
