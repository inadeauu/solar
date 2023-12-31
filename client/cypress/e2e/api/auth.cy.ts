import { graphQLClient } from "../../../src/utils/graphql"
import {
  authUserTestDoc,
  loginUsernameTestDoc,
  logoutTestDoc,
  registerUsernameTestDoc,
} from "../../utils/graphqlDocs/authGraphQL"
import { getUserTestDoc } from "../../utils/graphqlDocs/userGraphQL"
import { aliasMutation } from "../../utils/graphqlTest"
import { cypressCheckOnFail } from "../../utils/utils"

beforeEach(function () {
  cy.exec("npm --prefix ../server run resetDb")
  cy.exec("npm --prefix ../server run seed")

  cy.intercept("POST", "http://localhost:4000/graphql", (req) => {
    aliasMutation(req, "LogoutTest")
  })
  cy.visit("/")
})

describe("Auth user endpoint", function () {
  it("Check response with no cookie", function () {
    cy.wrap(graphQLClient.request(authUserTestDoc))
      .its("authUser")
      .should((res) => expect(res.code).to.eq(200))
      .should((res) => expect(res.successMsg).to.eq(null))
      .should((res) => expect(res.user).to.eq(null))
  })

  it("Check response with cookie", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86").then(() => {
      cy.wrap(graphQLClient.request(authUserTestDoc))
        .its("authUser")
        .should((res) => expect(res.code).to.eq(200))
        .should((res) => expect(res.user.id).to.eq("8d2efb36-a726-425c-ad12-98f2683c5d86"))
    })
  })
})

describe("Register username endpoint", function () {
  it("Check response when username and password too small", function () {
    cy.wrap(graphQLClient.request(registerUsernameTestDoc, { input: { username: "1", password: "2" } }))
      .its("registerUsername")
      .should((res) => expect(res.code).to.eq(400))
      .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
      .should((res) => expect(res.inputErrors.username).to.eq("Username must be between 5 and 15 characters long"))
      .should((res) => expect(res.inputErrors.password).to.eq("Password must be at least 8 characters long"))
  })

  it("Check response when username already in use", function () {
    cy.wrap(graphQLClient.request(registerUsernameTestDoc, { input: { username: "username1", password: "password" } }))
      .its("registerUsername")
      .should((res) => expect(res.code).to.eq(400))
      .should((res) => expect(res.errorMsg).to.eq("Invalid input"))
      .should((res) => expect(res.inputErrors.username).to.eq("Username already in use"))
      .should((res) => expect(res.inputErrors.password).to.eq(null))
  })

  it("Check user registered correctly", function () {
    cy.then(() => {
      cy.wrap(
        graphQLClient.request(registerUsernameTestDoc, { input: { username: "newUsername", password: "password" } })
      )
        .its("registerUsername")
        .should((res) => expect(res.code).to.eq(200))
        .should((res) => expect(res.successMsg).to.eq("Successfully registered"))
    })

    cy.then(() => {
      cy.wrap(graphQLClient.request(getUserTestDoc, { input: { username: "newUsername" } }))
        .its("user")
        .should((res) => expect(res.username).to.eq("newUsername"))
    })
  })
})

describe("Login endpoint", function () {
  it("Check response with invalid username and/or password", function () {
    cy.wrap(graphQLClient.request(loginUsernameTestDoc, { input: { username: "user", password: "password" } }))
      .its("loginUsername")
      .should((res) => expect(res.code).to.eq(400))
      .should((res) => expect(res.errorMsg).to.eq("Invalid username and/or password"))
  })

  it("Check response with valid credentials", function () {
    cy.wrap(graphQLClient.request(loginUsernameTestDoc, { input: { username: "username1", password: "password" } }))
      .its("loginUsername")
      .should((res) => expect(res.code).to.eq(200))
      .should((res) => expect(res.successMsg).to.eq("Successfully logged in"))
      .should((res) => expect(res.user.id).to.eq("8d2efb36-a726-425c-ad12-98f2683c5d86"))
  })
})

describe("Logout endpoint", function () {
  it("Check response when not signed in", function () {
    cypressCheckOnFail("UNAUTHENTICATED", "Not signed in")

    cy.then(() => {
      cy.wrap(graphQLClient.request(logoutTestDoc))
    })

    cy.wait("@gqlLogoutTestMutation").then(() => {
      throw new Error("No error returned")
    })
  })

  it("Check response when signed in", function () {
    cy.setCookie("test-user", "8d2efb36-a726-425c-ad12-98f2683c5d86").then(() => {
      cy.wrap(graphQLClient.request(logoutTestDoc))
        .its("logout")
        .should((res) => expect(res.code).to.eq(200))
        .should((res) => expect(res.successMsg).to.eq("Successfully logged out"))
    })
  })
})
