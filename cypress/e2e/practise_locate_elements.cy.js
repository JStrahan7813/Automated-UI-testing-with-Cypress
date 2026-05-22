describe('Mixed Authentication Tests', () => {
  
  // 1. Define the login routine as a reusable function
  const loginRoutine = () => {
    cy.visit('https://thinking-tester-contact-list.herokuapp.com/')
    cy.get('#email').type('testuser@fake.com')
    cy.get('#password').type('mysecurepassword')
    cy.get('#submit').click()
    cy.url().should('include', '/contactList')
  }
  it('can locate an element by id', () => {
    cy.visit('https://thinking-tester-contact-list.herokuapp.com/')
    cy.get('#email').type('I located the element by id')
     cy.contains('Submit').click()
    cy.contains('Incorrect username or password').should('be.visible')
  }) // <-- Fixed: Closed the first it block properly

  it('can locate an element by text', () => {
    cy.visit('https://thinking-tester-contact-list.herokuapp.com/')
    cy.contains('Submit').click()  
  }) // <-- Fixed: Added the missing }) to close the second it block

  it('can locate an element by class', () => {
    cy.visit('https://thinking-tester-contact-list.herokuapp.com/')
    cy.get('#email').type('testuser@fake.com')
    cy.get('#password').type('mysecurepassword')
    cy.contains('Submit').click()
    cy.get('.logout').click()
  }) 
  
  it('can locate an element by class and click on user details', () => {
    loginRoutine()
    cy.get(':nth-child(4) > :nth-child(2)').click()
  }) 
  it('can login, add TWO contacts, and verify they were created', () => {
  // 1. Log in to the application
  loginRoutine()
  
  // ==========================================
  // CREATE CONTACT 1: John Doe
  // ==========================================
  cy.get('#add-contact').click()
  cy.url().should('include', '/addContact') 
  
  cy.get('#firstName').type('John')
  cy.get('#lastName').type('Doe')
  cy.get('#submit').click() 
  
  // Verify we are back on the list page before proceeding
  cy.url().should('include', '/contactList')
  cy.contains('John Doe').should('be.visible')

  // ==========================================
  // CREATE CONTACT 2: Jane Smith
  // ==========================================
  cy.get('#add-contact').click()              // Click add contact a second time
  cy.url().should('include', '/addContact') 
  
  cy.get('#firstName').type('Jane')           // Type the second name
  cy.get('#lastName').type('Smith')
  cy.get('#submit').click() 
  
  // ==========================================
  // FINAL VERIFICATIONS
  // ==========================================
  cy.url().should('include', '/contactList')
  
  // Verify BOTH contacts are visible in the table
  cy.contains('John Doe').should('be.visible')
  cy.contains('Jane Smith').should('be.visible')
})
  
  it('can delete a contact and verify John Doe is not present', () => {
    // 1. Log in to the application
    loginRoutine()

    // 2. Locate 'John Doe' and click to open the contact details view
    cy.contains('John Doe').click()
    cy.url().should('include', '/contactDetails')

    // 3. Click the delete button
    // Note: Cypress automatically accepts the native browser "Are you sure?" confirmation popup
    cy.get('#delete').click() 

    // 4. Wait for the application to redirect back to the main list
    cy.url().should('include', '/contactList')

    // 5. CRITICAL VERIFICATION: Assert that 'John Doe' is completely gone from the UI
    cy.contains('John Doe').should('not.exist')
  })
  it('can update the contact Jane Smith to Jane Doe', () => {
  // 1. Log in to the application
  loginRoutine()
  
  // Ensure we are on the contact list page before trying to find the contact
  cy.url().should('include', '/contactList')

  // 2. Find and click on 'Jane Smith' to open her detailed view
  cy.contains('Jane Smith').click()
  cy.url().should('include', '/contactDetails')

  // 3. Click the Edit Contact button
  cy.get('#edit-contact').click() 
  cy.url().should('include', '/editContact')

  // 4. Update the last name to 'Doe'
  // Remember we use the control/meta press strategy to handle stubborn inputs safely!
  // 4. Update the last name to 'Doe'
  cy.get('#lastName')
    .click() // Click into the input box to put the cursor at the end of "Smith"
  // cy.pause() 
  // Type 5 backspaces to delete S-m-i-t-h, then type Doe
  cy.get('#lastName').type('{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}Doe')
  //cy.pause()

  // 5. Click the Submit button to save the changes
  cy.get('#submit').click()

  // 6. Navigate back/Verify on the main contact list table
  cy.get('#return').click() // Returns to the list view
  cy.url().should('include', '/contactList')

  // 7. Final Assertions
  cy.contains('Jane Doe').should('be.visible')    // The updated name should exist
  cy.contains('Jane Smith').should('not.exist')   // The old name should be gone
})

it('should not create a contact with an invalid/empty first name', () => {
    // 1. Log in to the application
    loginRoutine()

    // 2. Click 'Add a New Contact' 
    cy.get('#add-contact').click()
    cy.url().should('include', '/addContact') 

    // 3. Intentionally leave first name blank (or type invalid characters if the app rules specify)
    // For this app, leaving First Name completely blank triggers a validation error.
    cy.get('#lastName').type('Doe')
    
    // 4. Click Submit
    cy.get('#submit').click()

    // 5. VERIFICATION A: Verify that an error message appears on screen
    // Depending on the app, check the error element class or text content
    cy.get('#error') 
      .should('be.visible')
      .and('contain', 'Contact validation failed: firstName: Path `firstName` is required.') // Adjust error text based on exact app response

    // 6. VERIFICATION B: Ensure we are still stuck on the addContact page
    cy.url().should('include', '/addContact')

    // 7. VERIFICATION C: Navigate back to the list and ensure it was NOT recorded
    cy.get('#cancel').click() // Or cy.visit('https://thinking-tester-contact-list.herokuapp.com/contactList')
    cy.url().should('include', '/contactList')

    // Confirm that a standalone "Doe" or any partial variation was never saved to the table
    cy.contains('Doe').should('not.exist')
  })

it('should not update a contact with an empty first name', () => {
  // 1. Log in to the application
  loginRoutine()

  // Ensure we are on the contact list page
  cy.url().should('include', '/contactList')

  // 2. Find and click on 'Jane Doe' to open her detailed view
  cy.contains('Jane Doe').click()
  cy.url().should('include', '/contactDetails')

  // 3. Click the Edit Contact button
  cy.get('#edit-contact').click() 
  cy.url().should('include', '/editContact')

  // 4. Delete the 4 letters of "Jane" and leave it totally blank
  cy.get('#firstName')
    .click()
    cy.pause()
    cy.get('#firstName').type('{backspace}{backspace}{backspace}{backspace}{backspace}')
  cy.pause()
  // 5. Click Submit to trigger the validation check
  cy.get('#submit').click()

  // 6. VERIFICATION A: Check for the error message IMMEDIATELY while still on the edit screen
  cy.get('#error') 
    .should('be.visible')
    .and('contain', 'Validation failed: firstName: Path `firstName` is required.') 

  // 7. VERIFICATION B: Ensure the browser is still held on the edit page
  cy.url().should('include', '/editContact')

  // 8. Now that everything is validated, cancel out to return to the list view
  //cy.get('#cancel').click() // Note: use your page's cancel or return button ID here
  //cy.contains('Cancel').click()
  //cy.url().should('include', '/contactList')
})


  // <-- // <-- Fixed: Added the missing }) to close the third it block
}) // <-- Fixed: Closed the describe block