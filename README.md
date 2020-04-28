# SnailyCAD

# Free CAD for your community

# Update 3.3.0

- Improvements to name police name search
- Citizen profile picture
- Entire new Details Citizens page
- Medical Records
- A ton of bug fixes
- EMS/FD Dashboard
  - Notepad
  - able to search for medical records

## How To setup?

With version 3.3.0 you will need to run this in your MySQL database to update the database to the newest version(Only run this if you already have the database setup)

`ALTER TABLE `citizens`ADD`citizen_picture`TEXT NOT NULL AFTER`posts`;`

`CREATE TABLE `medical_records`(`id`int(11) NOT NULL,`type`varchar(255) NOT NULL,`short_info`varchar(255) NOT NULL,`name`varchar(255) NOT NULL ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`

`ALTER TABLE `medical_records`ADD PRIMARY KEY (`id`);`

**Requirements**

- NodeJS
- Xampp MySQL

**Installation**

1. Clone this repo to your PC, Run `git clone https://github.com/Dev-CasperTheGhost/SnailyCAD.git`
2. Go into the folder using: `cd snaily-cad`
3. Run `npm install` to install all required dependencies
4. Install XAMPP MySQL server to connect to the database. link: https://www.apachefriends.org/download.html
5. Make a database called "snaily-cad"
6. Import the `snaily-cad.sql` file into that database
7. Rename `creds-template.json` to `creds.json` and configure if needed.
8. Run `npm start` to start the CAD

## Found bugs & Suggestions

**Bugs**

Open an issue [here](https://github.com/Dev-CasperTheGhost/snaily-cad/issues/new) and I'll fix it asap.

**Suggestions**

Open an issue [here](https://github.com/Dev-CasperTheGhost/snaily-cad/issues/new) and I'll see what I can do!

# FAQ

- How Do I change the Icon?

  - goto `public/icons/` and there will be a file called `icon.png` replace this file with yours, It might take a little before the changes have been saved

- Am I allowed to translate this CAD?
  - Yes, you are allowed to translate this CAD. (Only for your community)
