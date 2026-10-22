![Cooks Delight homepage](./img/Thumbnail.png)

# Cooks Delight

Cooks Delight is a responsive recipe website for discovering and exploring recipes across categories such as breakfast, lunch, dinner, dessert, and vegan. Recipe listings and detail pages are powered by local JSON data.

## Features

- Browse recipes and filter them by category
- **JSON-driven content:** Fetches local recipe data and dynamically renders recipe cards and detail pages; recipe IDs are passed in the URL
- Explore featured recipes in a Swiper carousel
- Open individual recipe pages with preparation details, ingredients, and steps
- Responsive layouts with a mobile navigation menu
- Burger Menu

## How the “View Recipe” experience works

- Selecting View Recipe opens the recipe detail page with that recipe’s ID in the URL.
- The detail-page JavaScript loads the recipe data from JSON, finds the matching recipe by ID, and fills the page with its content.
- Cooking steps are generated dynamically, including instruction lists and optional images.
- A recipe selector and similar-recipe cards let users switch to another recipe without reloading the page.
- The selected recipe ID is kept in the URL, and browser Back/Forward navigation restores the corresponding recipe.
  If the URL does not contain a valid recipe ID, the page displays the first recipe in the data.

## Built with

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Sass](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)
![Swiper](https://img.shields.io/badge/Swiper-6332F6?style=for-the-badge&logo=swiper&logoColor=white)

## Development

Install dependencies with `npm install`. Serve the project through a local web server, such as VS Code Live Server, so the browser can load the JSON files. Run `npm run dev` to watch and compile Sass changes.
