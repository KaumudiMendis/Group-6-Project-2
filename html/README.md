# web-design-challenge
## Monash Data Course - Wk 11 Assignment

For this assignment we needed to create a html website to host a previous assignments visualisations (Wk 6).

The index.html was the first created, and we used boxes inside containers as well as the bootstrap grid to align the elements on the page. Each image in the Visualisations box was given a link attribute, connecting it to its corresponding 'Plot' page.

Each plot page was based off the initial index page, with the visualisation and paragraphs swapped out in place of the corresponding figure. All other code was left the same.

The 'Comparisons' page was created using only one box within a container, with text and a 2x2 grid for the Visualisations present when the webpage was above the 'md' breakpoint, and collapsed down to a 4x1 grid when brought below this point. Each visualisation again linked to it's corresponding 'Plot' page.

For the data table we used a quick Python script and printed the to_html() function on the provided csv, then copy pasted it into the html file, then based most of the surrounding html code off the 'Comparisons' page.
