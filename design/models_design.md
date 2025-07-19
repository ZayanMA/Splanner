Data Model Design:
    User:
    - Each user may have many courses
    - Each user has their own tasks and notes
    - handles auth and login

    Course:
    - Belongs to one user
    - Has a title, a meeting time and a location
    - Each course can have many tasks and notes

    Task:
    - Belongs to a user and can optionally be linked to a course
    - Has title, due date, priority, tags, completed flag

    Note:
    - Belongs to a user and optionally to a course
    - Has title, content and created date