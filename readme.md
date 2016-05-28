# Teacher Agenda

## TODO

- StorageDao: modify to cache the values even after the Http has answered. Currently, share() only caches when the request is in progress.
- persist in local storage
- Remove entry
- Navigate between days

- Later: allow to choose multiple dates for an entry (ex: repeat Tuesday + Thursday)

## Business rules

- Student: can add an amount paid in order to add to the amount paid in advance.
    - Can visualize the total amount paid in advance, and the number of lessons covered by the payment.
    - For a given lesson, it is indicated whether the student already paid for it.
- Student detail view: a way to display lessons for this student (could be a link)
- Prices can change from a date. It should not impact the calculation of salaries for previous lessons
