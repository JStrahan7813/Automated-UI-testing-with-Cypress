Feature: Mixed Authentication and Contact List Management

  Background: 
    Given the user navigates to the login page

  # =========================================================================
  # AUTHENTICATION & ELEMENT LOCATOR SCENARIOS
  # =========================================================================

  Scenario: Failed login attempts display an error message
    When the user types "I located the element by id" into the email field
    And clicks the "Submit" button
    Then the system displays the error message "Incorrect username or password"

  Scenario: Locating and interacting with elements by simple text strings
    When the user clicks the "Submit" button without entering details
    Then the form submission should register the action

  Scenario: Successful login and session termination using element classes
    When the user logs in with a valid email and password
    Then the dashboard page loads successfully
    And the user clicks the log out option to end their session

  Scenario: Navigating deep into specific row profiles from the main ledger
    Given the user logs in with a valid email and password
    When the user clicks on the second item inside the fourth list column row
    Then the system loads that explicit profile component context

  # =========================================================================
  # POSITIVE CRUD OPERATION SCENARIOS
  # =========================================================================

  Scenario: Adding multiple contacts sequentially to the ledger
    Given the user logs in with a valid email and password
    When the user clicks the add contact option
    And submits a new contact with first name "John" and last name "Doe"
    And clicks the add contact option a second time
    And submits a new contact with first name "Jane" and last name "Smith"
    Then the master list updates to display both "John Doe" and "Jane Smith"

  Scenario: Deleting a targeted record permanently removes it from the UI
    Given the user logs in with a valid email and password
    When the user opens the profile view for "John Doe"
    And clicks the delete button and accepts the browser prompt
    Then the user is redirected to the main dashboard
    And "John Doe" is no longer visible in the contact grid

  Scenario: Editing and modifying structural properties of a contact card
    Given the user logs in with a valid email and password
    When the user opens the profile view for "Jane Smith"
    And selects the option to edit the contact details
    And cleanly wipes the last name input field using sequential backspaces
    And types the updated value "Doe" and saves changes
    And navigates back to the main registry panel
    Then "Jane Doe" is visible as a single modified record
    And the old name "Jane Smith" no longer exists

  # =========================================================================
  # NEGATIVE BOUNDARY TESTING SCENARIOS
  # =========================================================================

  Scenario: Form validation rejects empty fields during new contact creation
    Given the user logs in with a valid email and password
    When the user clicks the add contact option
    And populates the last name field with "Doe" while leaving the first name empty
    And attempts to save the form
    Then an active error banner appears stating "Contact validation failed: firstName: Path `firstName` is required."
    And the browser remains held on the creation view page
    When the user cancels the operation to check the database list view
    Then the partial record containing just "Doe" is confirmed to not exist

  Scenario: Input validation prevents empty updates from overwriting records
    Given the user logs in with a valid email and password
    When the user opens the profile view for "Jane Doe"
    And selects the option to edit the contact details
    And erases the four characters of the first name with backspaces to leave it blank
    And attempts to save the form
    Then an active error banner appears stating "Validation failed: firstName: Path `firstName` is required."
    And the application restricts focus and holds the browser state on the edit screen