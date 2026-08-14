# QR Restaurant Ordering SaaS — UI/UX Design Prompt

Design a modern, production-ready **multi-tenant QR restaurant ordering SaaS web application**.

The platform allows restaurants, cafés, bars, and hotels to create digital menus and receive customer orders directly from QR codes placed on tables or other ordering locations.

The application has three main experiences:

1. **Customer QR Ordering Experience**
2. **Restaurant/Admin Dashboard**
3. **Super Admin Platform Dashboard**

The UI should look like a real production SaaS product, not a generic template.

---

# 1. Design Direction

Create a clean, modern, premium SaaS interface.

### Visual style

* Modern
* Minimal
* Professional
* Friendly
* Fast and easy to understand
* Mobile-first for customers
* Desktop/tablet optimized for restaurant staff
* Spacious layouts
* Rounded cards
* Subtle shadows
* Clear hierarchy
* High-quality food imagery
* Smooth interactions
* Accessible contrast

### Primary brand color

Use:

**Blue: #2563EB**

Use blue primarily for:

* Primary buttons
* Active navigation
* Links
* Important actions
* Selected states
* Progress indicators

Use neutral colors for the rest of the interface.

Avoid excessive gradients, excessive glassmorphism, or overly decorative effects.

---

# 2. Customer QR Ordering Experience

The customer does NOT need to create an account or download an application.

The customer scans a QR code at a restaurant table.

Example:

`/v/cafe-bella/table/12`

The system already knows:

* Restaurant/venue
* Table number
* Customer ordering session

The customer should be able to browse and order with minimum input.

---

# Customer Page 1 — Landing / Welcome

Create a mobile-first landing page.

Display:

* Restaurant logo
* Restaurant name
* Welcome message
* Table number
* Short description
* "View Menu" primary button

Example:

**Welcome to Cafe Bella**

**Table 12**

Enjoy our freshly prepared meals and drinks.

[ View Menu ]

Include a subtle restaurant hero image.

The page should feel welcoming but should not delay the customer from reaching the menu.

---

# Customer Page 2 — Menu

Create the main digital menu page.

Top section:

* Restaurant logo/name
* Table number
* Search icon
* Cart icon
* Optional language selector

Below:

Horizontal scrollable category navigation:

* All
* Starters
* Main Course
* Burgers
* Pizza
* Drinks
* Desserts

Menu item cards should contain:

* Food image
* Item name
* Short description
* Price
* Availability
* Add button

Example:

**Chicken Burger**

Grilled chicken, lettuce, tomato and house sauce.

**KES 850**

[ + Add ]

Show unavailable items clearly but do not remove them completely.

Include:

* Search
* Category filtering
* Popular items
* Recommended items
* Empty states

The customer should be able to add an item directly from the menu.

---

# Customer Page 3 — Item Details / Customization

Create a detailed item customization screen.

Display:

* Large food image
* Item name
* Description
* Base price
* Quantity selector

Customization sections should come from customization groups configured by the restaurant.

Example:

### Size

○ Regular

○ Large + KES 150

### Add-ons

☐ Extra Cheese + KES 100

☐ Extra Chicken + KES 200

☐ Avocado + KES 150

### Preferences

○ Mild

○ Medium

○ Spicy

### Special Notes

Text area:

"Any special instructions?"

At the bottom show:

* Quantity
* Total price

[ Add to Cart ]

The price should update dynamically when options are selected.

---

# Customer Page 4 — Cart

Create a clean mobile shopping cart.

Header:

**Your Order**

**Table 12**

Cart items should show:

* Image
* Item name
* Selected customization options
* Quantity controls
* Price
* Remove button

Example:

Chicken Burger

Extra cheese

Qty 2

KES 1,900

Show:

Subtotal

Tax

Total

Primary CTA:

[ Continue to Order ]

Secondary action:

[ Continue Browsing ]

If the cart is empty, show:

**Your cart is empty.**

Browse the menu and add something delicious.

[ View Menu ]

---

# Customer Page 5 — Order Confirmation

Create a simple confirmation page.

Large success indicator.

Display:

**Order Placed!**

Order #1048

Table 12

Estimated preparation time:

15–20 minutes

Show ordered items.

Primary button:

[ Track Order ]

Secondary:

[ Order More ]

---

# Customer Page 6 — Order Tracking

Create a real-time order tracking screen.

Display:

Order #1048

Table 12

Use a progress tracker:

✓ Order Received

✓ Accepted

● Preparing

○ Ready

○ Served

Show estimated preparation time.

Display order items and total.

Include:

[ Order More ]

[ Request Waiter ]

[ Request Bill ]

The status should visually update.

---

# Customer Page 7 — Call Waiter / Requests

Create a simple request interface.

Options:

* Call Waiter
* Request Bill
* Request Water
* Request Cutlery
* Request Assistance

Each option should be represented as a clear card/button.

After selecting:

**Request sent successfully.**

Staff will assist you shortly.

---

# 3. Restaurant Admin Dashboard

Create a professional desktop/tablet dashboard for restaurant owners and staff.

The admin application should have:

* Sidebar navigation
* Top header
* Restaurant selector
* User profile
* Notifications

Sidebar:

* Dashboard
* Orders
* Menu
* Categories
* Customizations
* Tables & QR Codes
* Reports
* Settings

---

# Admin Page 1 — Dashboard

Create a dashboard showing restaurant performance.

Top statistics:

* Today's Orders
* Today's Revenue
* Pending Orders
* Average Order Value

Example:

Today's Orders
128

Revenue
KES 142,500

Pending
12

Average Order
KES 1,113

Below:

### Live Orders

Show order cards with:

* Order #
* Table
* Time
* Items
* Total
* Status

Below:

### Popular Items

Display top-selling menu items.

Below:

### Sales Overview

Create a clean sales chart.

Include date filter:

* Today
* 7 Days
* 30 Days

---

# Admin Page 2 — Live Orders

This is one of the most important pages.

Create a Kanban-style order management interface.

Columns:

**NEW**

**ACCEPTED**

**PREPARING**

**READY**

**COMPLETED**

Each order card displays:

Order #1048

Table 12

2 minutes ago

1x Chicken Burger

1x Fries

2x Coke

Note:

No onions

Total: KES 2,100

Actions should change depending on the order status:

* Accept
* Reject
* Start Preparing
* Mark Ready
* Complete

Make new orders visually prominent.

Include notification/sound indicator.

---

# Admin Page 3 — Order Details

Create a detailed order view.

Show:

* Order number
* Table
* Customer information if available
* Order time
* Payment status
* Order status

Items:

Chicken Burger × 2

Extra cheese

Fries × 1

Coke × 2

Show:

Subtotal

Tax

Total

Special instructions.

Order timeline:

Order received

Accepted

Preparing

Ready

Completed

Include action buttons based on the current status.

---

# Admin Page 4 — Menu Management

Create a menu management interface.

Top:

**Menu Management**

[ + Add Item ]

Search items.

Filters:

* Category
* Availability
* Menu

Display menu items in a table/grid.

Columns:

* Image
* Item
* Category
* Price
* Availability
* Status
* Actions

Actions:

* Edit
* Duplicate
* Delete
* Toggle availability

Include an obvious quick availability toggle.

Example:

Chicken Burger

KES 850

Available ●

Beef Burger

KES 950

Unavailable ○

---

# Admin Page 5 — Add/Edit Menu Item

Create a professional menu item form.

Fields:

* Item Name
* Description
* Category
* Price
* Preparation Time
* Image Upload
* Availability

Tags:

* Popular
* Spicy
* Vegetarian
* New

### Customization Groups

Do NOT create customization options directly inside this form.

Instead, allow the restaurant to attach existing customization groups.

Example:

**Customization Groups**

☑ Size

☑ Add-ons

☐ Preferences

[ + Attach Customization Group ]

Display the selected groups and their options in a read-only preview.

Example:

**Size**

Regular

Large + KES 150

**Add-ons**

Extra Cheese + KES 100

Extra Chicken + KES 200

Avocado + KES 150

Provide:

[ Manage Customizations ]

The menu item form should only control **which existing customization groups are attached to the item**.

---

# 4. Customization Management

Create a dedicated **Customizations** section in the restaurant admin dashboard.

The customization system must be separated from menu item creation.

The structure is:

**Customization Group**

→ contains multiple

**Customization Options**

→ groups can be attached to multiple menu items.

Examples of groups:

* Size
* Add-ons
* Preferences
* Cooking Style
* Sauces

Examples of options:

Size:

* Regular
* Large + KES 150

Add-ons:

* Extra Cheese + KES 100
* Extra Chicken + KES 200
* Avocado + KES 150

Preferences:

* Mild
* Medium
* Spicy

---

# Admin Page 6 — Customization Groups

Create a page called:

**Customization Groups**

Display existing groups as cards or a table.

Example:

| Group       | Options | Selection | Required | Status | Actions |
| ----------- | ------- | --------- | -------- | ------ | ------- |
| Size        | 2       | Single    | Yes      | Active | Edit    |
| Add-ons     | 3       | Multiple  | No       | Active | Edit    |
| Preferences | 3       | Single    | No       | Active | Edit    |

Primary action:

[ + Create Customization Group ]

Each group should have:

* Group name
* Description
* Number of options
* Selection type
* Required status
* Active/inactive status
* Actions

Actions:

* View
* Edit
* Manage Options
* Duplicate
* Activate/Deactivate
* Delete

---

# Admin Page 7 — Create Customization Group

Create a dedicated form for creating a customization group.

Title:

**Create Customization Group**

Fields:

### Group Name

[ Size ]

### Description

[ Choose your preferred size ]

### Selection Type

[ Single Select ▼ ]

Options:

* Single Select
* Multiple Select

Explain the difference clearly.

Single Select means the customer can choose only one option.

Multiple Select means the customer can choose multiple options.

### Required

○ Yes

○ No

### Minimum Selections

[ 1 ]

### Maximum Selections

[ 1 ]

For a Single Select group, automatically keep minimum/maximum appropriate.

For Multiple Select groups, allow the admin to configure minimum and maximum selections.

Example:

**Add-ons**

Required: No

Minimum: 0

Maximum: 3

Buttons:

[ Cancel ]

[ Create Group ]

After creating the group, the admin should be able to manage its options.

---

# Admin Page 8 — Customization Group Details / Manage Options

Create a dedicated management page for one customization group.

Example:

**Size**

Description:

Choose your preferred size.

Group settings:

Selection Type: Single Select

Required: Yes

Minimum: 1

Maximum: 1

Then display:

### Options

| Option  | Additional Price | Order | Status | Actions |
| ------- | ---------------- | ----- | ------ | ------- |
| Regular | KES 0            | 1     | Active | Edit    |
| Large   | +KES 150         | 2     | Active | Edit    |

Primary button:

[ + Add Option ]

Allow drag-and-drop ordering.

---

# Admin Page 9 — Create Customization Option

Create a separate form for adding an option to an existing customization group.

Title:

**Add Customization Option**

Fields:

### Customization Group

[ Size ▼ ]

The group should already be selected if the form was opened from a group.

### Option Name

[ Regular ]

### Additional Price

[ KES 0 ]

This represents the additional amount added to the menu item's base price.

Examples:

Regular → KES 0

Large → +KES 150

Extra Cheese → +KES 100

### Display Order

[ 1 ]

### Available

[ ✓ ]

Buttons:

[ Cancel ]

[ Add Option ]

---

# Admin Page 10 — Edit Customization Option

Create an edit form with:

* Customization Group
* Option Name
* Additional Price
* Display Order
* Availability

Example:

Customization Group:

[ Add-ons ▼ ]

Option:

Extra Cheese

Additional Price:

KES 100

Available:

✓

Buttons:

[ Cancel ]

[ Save Changes ]

---

# Customization UX Rules

The UI should clearly distinguish between:

### Group

The category/type of customization.

Examples:

* Size
* Add-ons
* Preferences

### Option

An individual choice inside the group.

Examples:

**Size**

* Regular
* Large

**Add-ons**

* Extra Cheese
* Extra Chicken
* Avocado

**Preferences**

* Mild
* Medium
* Spicy

Do not mix groups and options into one confusing form.

The admin workflow should be:

**Create Group**

→ **Add Options**

→ **Attach Group to Menu Items**

→ **Customer selects options when ordering**

---

# 5. Admin Page — Categories

Create category management.

Example:

Starters

12 items

Main Course

25 items

Drinks

18 items

Desserts

10 items

Actions:

* Edit
* Delete
* Reorder

Primary action:

[ + Add Category ]

Allow drag-and-drop ordering.

---

# 6. Admin Page — Tables & QR Codes

Create a table management page.

Display:

Table 1

Table 2

Table 3

Table 4

Table 5

Table 6

Each table card should show:

* Table number
* Status
* QR code preview
* Orders today

Actions:

* View QR
* Download QR
* Print QR
* Regenerate QR
* Deactivate

Primary button:

[ + Add Table ]

Include:

[ Download All QR Codes ]

QR codes should identify both the restaurant/tenant and the specific table.

---

# 7. Admin Page — Reports

Create a reporting dashboard.

Metrics:

* Total Orders
* Revenue
* Average Order Value
* Top Selling Item
* Busiest Hour

Charts:

* Revenue over time
* Orders over time
* Top menu items
* Orders by category

Filters:

* Today
* 7 Days
* 30 Days
* Custom Range

---

# 8. Admin Page — Settings

Create settings sections:

* Restaurant Profile
* Business Information
* Branding
* Currency
* Tax
* Ordering Settings
* Notifications
* Staff & Roles

Restaurant profile:

Restaurant Name

Logo

Address

Phone

Email

Branding:

Logo

Primary Color

Cover Image

---

# 9. Authentication Pages

Create:

* Login
* Register
* Forgot Password
* Reset Password

Keep authentication clean and simple.

Login:

Email

Password

Remember me

[ Login ]

Forgot password?

Register:

Restaurant Name

Owner Name

Email

Phone

Password

Confirm Password

[ Create Account ]

---

# 10. Super Admin Dashboard

Create a platform-level SaaS administration interface.

Sidebar:

* Dashboard
* Tenants
* Users
* Subscriptions
* Plans
* Orders
* Reports
* Settings
* Audit Logs

Dashboard metrics:

* Total Restaurants
* Active Restaurants
* Total Orders
* Monthly Revenue
* Active Subscriptions

Include:

* Tenant growth chart
* Revenue chart
* Recent restaurants
* Recent subscriptions

---

# Super Admin — Tenants

Display all restaurants/venues.

Columns:

* Restaurant
* Owner
* Plan
* Status
* Orders
* Created
* Actions

Statuses:

* Active
* Trial
* Suspended

Actions:

* View
* Edit
* Suspend
* Activate

---

# Super Admin — Subscription Plans

Create SaaS subscription management.

Example plans:

### Starter

KES 2,500/month

### Professional

KES 5,000/month

### Business

KES 10,000/month

Show:

* Price
* Number of tables
* Number of staff
* Features
* Status

Actions:

* Edit
* Activate
* Deactivate

---

# 11. Responsive Design

The customer interface MUST be designed mobile-first.

Customer:

* Mobile bottom navigation where appropriate
* Large touch targets
* Sticky cart button
* Mobile-friendly cards
* Bottom sheets for customization
* Easy scrolling

Admin:

* Desktop-first
* Responsive
* Tablet optimized

Tablet support is very important because restaurants may use tablets for kitchen and order management.

---

# 12. Navigation

Customer navigation should be minimal.

Recommended:

* Menu
* Cart
* Orders

Admin navigation:

* Dashboard
* Orders
* Menu
* Categories
* Customizations
* Tables
* Reports
* Settings

Super Admin navigation:

* Dashboard
* Tenants
* Users
* Subscriptions
* Plans
* Reports
* Settings
* Audit Logs

---

# 13. UI Components

Create a consistent design system containing:

* Buttons
* Inputs
* Selects
* Checkbox
* Radio buttons
* Switches
* Tables
* Cards
* Badges
* Dropdowns
* Modals
* Drawers
* Bottom sheets
* Tabs
* Pagination
* Toast notifications
* Alerts
* Skeleton loaders
* Empty states
* Confirmation dialogs

Use consistent spacing, border radius, typography, and interaction states.

---

# 14. Important UX Requirements

Prioritize speed.

A customer scanning a QR code should reach the menu quickly.

The customer should NOT have to:

* Register
* Login
* Download an app
* Manually enter the table number

The QR code already identifies the venue and table.

The ordering flow should be:

**Scan QR**

→ **Welcome**

→ **Menu**

→ **Item**

→ **Customize**

→ **Cart**

→ **Place Order**

→ **Track Order**

Keep this flow extremely simple.

---

# 15. Restaurant Order Workflow

The most important admin workflow is:

Customer places order

→ New order appears immediately

→ Staff accepts

→ Kitchen prepares

→ Staff marks ready

→ Order served

→ Customer sees updated status

The UI should make this workflow visually obvious.

---

# 16. Empty, Loading and Error States

Design states for:

* Empty cart
* Empty menu
* No orders
* No tables
* No categories
* No customization groups
* No customization options
* No search results
* Loading menu
* Loading orders
* Network error
* Order failed
* Item unavailable
* Restaurant closed

Do not leave blank screens.

---

# 17. Design Consistency

Use the same design language throughout the entire application.

Primary color:

**#2563EB**

Use:

* White/neutral backgrounds
* Dark text
* Blue primary actions
* Subtle borders
* Moderate rounded corners
* Clear status badges
* Clean typography

Do not make every page visually different.

The customer experience should feel like a polished food-ordering application.

The admin experience should feel like a professional SaaS dashboard.

The super admin experience should feel like a modern SaaS control panel.

---

# 18. Deliverables

Generate the complete UI design for the major screens described above.

Prioritize these screens:

### Customer

1. Customer Landing
2. Customer Menu
3. Item Details
4. Cart
5. Order Confirmation
6. Order Tracking
7. Customer Requests

### Restaurant Admin

8. Admin Dashboard
9. Live Orders
10. Order Details
11. Menu Management
12. Add/Edit Menu Item
13. Categories
14. Customization Groups
15. Create Customization Group
16. Customization Group Details
17. Create Customization Option
18. Edit Customization Option
19. Tables & QR Codes
20. Reports
21. Settings

### Authentication

22. Login
23. Register
24. Forgot Password
25. Reset Password

### Super Admin

26. Super Admin Dashboard
27. Tenants
28. Subscription Plans

Use realistic restaurant data and realistic food imagery.

Create reusable components and maintain consistent spacing, typography, colors, buttons, cards, tables, forms, navigation, and interaction states.

The final design should look like a real production SaaS product that could be implemented using:

**React + Vite + Tailwind CSS + React Router**

with separate:

* Customer experience
* Restaurant/Admin experience
* Super Admin experience

The customization architecture must remain clear:

**Customization Group → Customization Options → Attached to Menu Item → Selected by Customer during ordering.**
