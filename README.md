# Coaction

Lots of companies need collaboration tools. Unfortunately, these are usually really complicated, and for non-technical users, they are daunting. We want to build a collaboration tool that helps people track and collaborate on tasks without requiring tons of technical expertise. And we _don't_ want to overwhelm them with lots of bells and whistles.

This collaboration tool will be made of two parts:

* A single-page application in Angular
* A REST API built with Python and Flask

## Normal Mode

Users can:

* Register for a new account
* Login with their account
* Create new tasks
  * Assign the new task to someone (from a list of current users)
* See an overview of all incomplete tasks in the system
* See tasks assigned to them
* See all tasks they've assigned to others
* Identify overdue tasks. These should have a visual identifier everywhere they are present.
* Mark their tasks as started or complete
* Reassign tasks assigned to them to others
* Comment on tasks

Tasks must have:

* a title
* a description
* a status ("new", "started", or "done")
* an assignee

Tasks can have:

* a due date (stored in UTC)
* comments

### Thoughts about UI and UX

* The UI should be responsive (e.g. look good on mobile and desktop).
* The UI should represent new, doing, and done tasks logically
* Think about the persona of the end-user
  * How can you represent a task as simply as possible?
  * What is a users' primary concern?
  * What do they most want to see when logging in?
  * What other personas might there be? Managers? What would their landing page look like?

### Note about authentication

Authentication should be done with cookie-based sessions. The cookies will have to be created through Flask, so there should be an API endpoint that logs in users.

## Hard Mode

For hard mode, you can choose one or more of the following:

* Add the ability to add a list of todos to a task
  * Users can edit/remove todos
  * Users can check off a todo in order to mark it as completed
* Tasks can be assigned to people that don't yet have an account by using their email address. That new person who does not yet have an account will get an email with a link to let them create an account.
* Tasks can have attachments (images, files)
* Updates to tasks are reflected in real time (e.g. When user 1 comments on a task that user 2 is viewing, user 2 immediately sees user 1's comment.)
* Send updates to subscribed tasks through email.
  * Everyone who touches a task -- creates the task, is assigned to the task, reassigns the task -- is subscribed to it and receives updates about it.
  * You should have a dashboard where you can see all tasks you're subscribed to.
  * When you comment on a task, you can choose to be subscribed to it if you're not already.
  * You can unsubscribe from a task if you aren't the original assigner or the current assignee.

---

## Front Enders

You need to run `npm install`

From that point on, you can just run `gulp` to run in development mode.

Run `gulp release` to build a minified, bundled, optimized version of your code.

The `dist` folder is now `coaction/static`.

All of your URLs (including Angular template URLs) should begin with static.
(e.g. 'static/my-directive/my-directive.html')

Live-reload is working, but is a wee smidge different. You'll need this Chrome
extension installed:

https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei?hl=en

---

Quickstart
----------

Run the following commands to bootstrap your environment.


```
cd coaction
pip install -r requirements.txt
python manage.py db init
python manage.py server
```


Deployment
----------

In your production environment, make sure you have an application.cfg
file in your instance directory.


Shell
-----

To open the interactive shell, run:

    python manage.py shell

By default, you will have access to `app` and `db`.


Running Tests
-------------

To run all tests, run:

    python manage.py test


Migrations
----------

Whenever a database migration needs to be made, run the following commmand:

        python manage.py db migrate

This will generate a new migration script. Then run:

        python manage.py db upgrade

to apply the migration.

For a full migration command reference, run `python manage.py db --help`.
