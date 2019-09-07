const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query  {
    launches(
      pageSize: Int
      after: String
    ): LaunchConnection!
    launch(id: ID!): Launch
    me: User
  }

  type LaunchConnection { # add this below the Query type as an additional type.
    cursor: String!
    hasMore: Boolean!
    launches: [Launch]!
  }

  type Mutation {
    # if false, booking trips failed -- check errors
    bookTrips(launchIds: [ID]!): TripUpdateResponse!
    # if false, cancellation failed -- check errors
    cancelTrip(launchId: ID!): TripUpdateResponse!
    login(email: String): String # login token
  }

  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }

  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }

  type Rocket {
    id: ID!
    name: String
    type: String
  }

  type User {
    id: ID!
    email: String
    trips: [Launch]!
  }

  type Mission {
    name: String
    missionPatch(mission: String, size: PatchSize): String
  }

  enum PatchSize {
    SMALL
    LARGE
  }
`;

module.exports = typeDefs;