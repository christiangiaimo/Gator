# GATOR BLOG AGREGATOR APP

This repository holds the Gator Blog Agregator app.

## Description

The Gator app is a CLI tool that allows users to:

1.  Add RSS feeds from across the internet to be collected.
2.  Store the collected posts in a PostgreSQL database.
3.  Follow and unfollow RSS feeds that other users have added.
4.  View summaries of the aggregated posts in the terminal, with a link to the full post.

## Functionality

### Config

For the Database you need to use the .gatorconfig.json file to put the database url.
In the package.json you will see the scripts for running npm you use mainly:

#### start ...commands: you use this to start a specific command with their inputs.

#### migrate: migrate the database structure.

#### generate: generate the database tables.

#### build: compile the code.

### commands

This CLI tool uses a set of commands like login, register, users, all of this are in the commands folder.
This commands are:

#### handlerLogin: it Logs the current user.

#### registerHandler: registers a new user.

#### resetUsersTable: Resets all the users info.

#### printUsers: Print all the users in the database and wich user is currently logged in.

#### agg: It needs a time in millisecond, seconds, minutes, or hours, this is a loop that fetches feeds and adds them to the database.

#### addfeed: Adds a new feed to the current user logged in.

#### feeds: prints all the current feeds in the database for the curren user.

#### follow: Make the current user follow a specific feed.

#### following: Prints the url of the currently following feeds.

#### unfollow: Makes the current user unfollow a specific feed.

#### browse: Searches for the latest posts of the specific user ordered form latest to older, you have to put a limit of the amount of feeds you wanna see, if you dont pass them its settled to 2.

## Dependencies

For development purposes see the config.ts file.

## Folder instructions.

### folder src

Contains all the main functions.

### folder src/lib/db

Contains the main config of the database, its schema and index.

### folder src/lib/db/queries

Contains all the db queries needed.

### folder src/commands

Contains all the commands needed in the CLI.
