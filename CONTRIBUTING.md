# Contributing to Rating App Dashboard

Thank you for your interest in contributing! We welcome all contributions to improve this project.

## Getting Started

1. **Fork the repository** and clone it to your local machine.
2. **Install dependencies** using your preferred package manager:
   ```sh
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```
3. **Start the development server**:
   ```sh
   npm run dev
   ```

## Branch Naming Convention

- Use descriptive branch names based on the type of work:
  - `feature/<short-description>` for new features
  - `fix/<short-description>` for bug fixes
  - `chore/<short-description>` for maintenance tasks
  - `docs/<short-description>` for documentation changes

**Examples:**
- `feature/add-user-auth`
- `fix/navbar-overlap`
- `chore/update-deps`
- `docs/update-readme`

## Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/) for clear commit history:

```
<type>(scope): <short description>

[optional body]

[optional footer(s)]
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
- `feat(auth): add login page`
- `fix(navbar): resolve mobile menu bug`
- `docs(readme): update getting started section`

## Pull Request Process

1. Ensure your branch is up to date with `main`.
2. Open a pull request (PR) against the `main` branch.
3. Provide a clear description of your changes and reference any related issues.
4. Ensure your code passes linting and builds successfully:
   ```sh
   npm run lint
   npm run build
   ```
5. If applicable, add or update tests.
6. Wait for a maintainer to review your PR. Respond to feedback as needed.

## Code Style

- Follow the existing code style and formatting.
- Use [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) (if configured).
- Write clear, concise, and self-explanatory code.

## Additional Notes

- For major changes, please open an issue first to discuss what you would like to change.
- Be respectful and considerate in all interactions.

Thank you for helping make this project better!