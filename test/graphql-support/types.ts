export default `#graphql
  type AModel {
    id: Int
    prop: String
    bModels: [BModel]
  }

  type BModel {
    id: Int
    attr: String
  }

  type Query {
    ping: String
    aModel(id: Int): AModel
    aModels: [AModel]
    bModel(id: Int): BModel
    bModels: [BModel]
  }
`;
