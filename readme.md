# Teacher Agenda

## TODO

(press) ionic event

- check ionSwipe as alternative to the slide-box. Maybe more adapted to an infinite slidebox?

- persist in local storage + env switch to use mocks when useful
- Add students
- handle the case when the price changes from a date for a given student
- For each student, add an amount paid + render in the agenda until which day it was paid
- Enrich with income calculations

- Later: allow to choose multiple dates for an entry (ex: repeat Tuesday + Thursday)

## Business rules

- Student: can add an amount paid in order to add to the amount paid in advance.
    - Can visualize the total amount paid in advance, and the number of lessons covered by the payment.
    - For a given lesson, it is indicated whether the student already paid for it.
- Student detail view: a way to display lessons for this student (could be a link)
- Prices can change from a date. It should not impact the calculation of salaries for previous lessons

## FAQ

### How to change the price of lessons from date xxx?

1) Modify the price of the student,
2) Modify the existing lesson: set an end date to xxx - 1 (last lesson without the price change),
3) Create a new lesson for this student with the new price from date xxx.