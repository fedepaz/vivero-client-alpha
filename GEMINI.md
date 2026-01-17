# 📑 GEMINI.md

This document outlines the specialized agents that assist in the development of the vivero-client-alpha application. Each agent has a specific role and expertise.

**Rule:** Before making any changes to the codebase, you **must** first consult the relevant agent profile in the `docs/` directory. The agent profiles are the single source of truth for the project's architecture, patterns, and standards. Do not deviate from the guidelines documented in the agent profiles.

---

### Rule: Workflow for Reviewing Code Changes

When the user asks me to check and summarize changes in the codebase, I will follow this exact procedure:

1.  **Inspect Commits**: Use `github.list_commits` and `github.get_commit` to retrieve the details of the recent changes.

2.  **Summarize for User**: Present a clear summary of the code changes to the user.

3.  **Internal Alignment Check**: After summarizing, I will silently (without asking the user yet) compare the code changes against the agent documentation in the `docs/` directory to check for:
    - Deviations from established patterns.
    - New patterns that need to be documented.
    - Opportunities to update or refine the agent guidelines themselves.

4.  **Propose All Documentation Updates**: Based on the alignment check, I will formulate a single, comprehensive proposal for all necessary documentation changes. This proposal may include updates to:
    - The setup guides in `docs/guides/`.
    - The agent profiles in `docs/`.

5.  **Request User Confirmation**: I will present the complete documentation update proposal to the user and ask for a single confirmation before proceeding to write any files.

---

### Rule: Workflow for Conducting Research

When the user asks a question that requires research (e.g., "how to implement X in Hono," "what is the best library for Y"), I will follow this protocol:

1.  **Prioritize Specialized Documentation**: My first step will always be to seek structured, high-quality information using specialized tools. I will prioritize them in this order:
    - **Library Docs**: Use `get_library_docs` (after resolving the ID with `resolve_library_id`) to find official documentation for specific libraries or frameworks.
    - **Code Search**: Use `github search_code` to find real-world implementation examples and patterns on GitHub.

2.  **Use General Web Search**: Only if the specialized tools do not provide a sufficient answer will I use the `google_web_search` tool to search the broader web.

3.  **Synthesize and Cite**: I will synthesize the information gathered from all sources into a concise and clear answer. I will cite the sources of the information (e.g., URLs from web search, library documentation pages) so you can verify the information if needed.

---

### Rule: Workflow for Committing and Pushing New Work

When the user asks me to **commit, push, or otherwise save new work**, I will execute the following master workflow, which combines our previously established rules:

1.  **Execute "Workflow for Reviewing Code Changes"**:
    - To see the unstaged changes, I must inspect the local files. I will use `git diff HEAD` to get a summary of all the modifications.
    - I will then follow the steps of the "Workflow for Reviewing Code Changes" on the output of that diff, which includes summarizing the changes and performing an internal alignment check against the agent documentation.

2.  **Execute "Workflow for Conducting Research"**:
    - Next, I will automatically perform the "Workflow for Conducting Research" on the patterns and technologies found in the code changes to ensure they align with industry best practices.

3.  **Generate and Internally Validate Commit Message**:
    - I will generate a draft commit message based on the changes.
    - I will then internally validate this message against the project's `commitlint` rules (e.g., by running `cat <file> | npx commitlint`).
    - If there are any errors, I will automatically correct them and re-validate until the message is fully compliant.

4.  **Propose a Comprehensive Plan**:
    - After completing the review, research, and commit message validation, I will present you with a single, comprehensive plan that includes:
      1.  A validated, compliant commit message.
      2.  A summary of the research findings.
      3.  A proposal for any necessary documentation updates (for both `docs/guides/` and the agent profiles).

5.  **Execute Commit and Push**:
    - Only after receiving your final approval on the comprehensive plan will I execute the following commit procedure:
      1.  **Save Commit Message**: Create a `.commits` directory (if it doesn't exist) and save the full, approved commit message to a new file within it with the following format: `<commit_message_title> - <date>.txt`.
      2.  **Stage All Changes**: Run `git add .` to stage all modified files, including the new documentation and the commit message file itself.
      3.  **Create Commit**: Run `git commit -F <path_to_commit_message_file>` to create the commit using the detailed message from the file.
      4.  **Push to Remote**: If you have requested to push, I will run `git push` to send the changes to the remote repository.

### Rule: Pull Request Message Generation Workflow

This workflow outlines the steps to effectively draft a comprehensive Pull Request title and description, leveraging the branch's commit history and adhering to project standards. This guide is intended to assist in preparing the content for a Pull Request, which will then be manually created by the developer.

#### Workflow Steps

1.  **Identify the Target Branch**
    - Determine the `base` branch for your Pull Request (e.g., dev or main). This is crucial for accurately identifying unique commits.

2.  **Review Commits on the Feature Branch**
    - Use `git log <base_branch>..HEAD --oneline` to list all commits unique to your current feature branch. This provides a concise overview of the work accomplished.
    - Analyze these commit messages to understand the full scope of the feature, including:
      - New functionalities (`feat:` commits).
      - Bug fixes (`fix:` commits).
      - Refactorings (`refactor:` commits).
      - Tooling or CI/CD updates (`chore:` commits).
      - Documentation changes (`docs:` commits).

3.  **Draft the Pull Request Title**
    - The title should be concise and reflect the primary purpose or the most significant feature introduced by the branch.
    - Follow the Conventional Commits specification if applicable (e.g., `feat(scope): Summary of main feature`).

4.  **Draft the Pull Request Description**
    - The description should provide a comprehensive summary of the _entire feature_ being merged, not just the last commit.
    - Organize the description into logical sections (e.g., "Key Features", "Architectural Changes", "Testing Setup", "Tooling Updates").
    - Elaborate on the "what" and "why" for each major change.
    - Include any relevant context, such as:
      - How the feature aligns with product goals.
      - Specific implementation details.
      - Resolution of complex issues (e.g., the PostCSS configuration conflict).
      - References to updated documentation.

5.  **Save the Drafted Pull Request Message**
    - Save the generated Pull Request title and description to a file within the `.pull_requests/` directory.
    - **Naming Convention**: The filename should follow the format: `<pr_title_slug> - <date>.md`.
      - `<pr_title_slug>`: A slugified version of the PR title (e.g., `feat-frontend-initial-setup-and-core-features`).
      - `<date>`: The current date in `YYYY-MM-DD` format.
      - Example: `.pull_requests/feat-frontend-initial-setup-and-core-features - 2025-10-14.md`

6.  **Review and Refine**
    - Review the drafted message for clarity, completeness, and accuracy.
    - Ensure it provides sufficient context for reviewers to understand the scope of the changes.

### Rule: General Backend Workflow

#### Workflow Steps

- My standard workflow for creating a new backend feature in the viveroApp project is:
  1. Scaffold with `nest g resource <name>`.
  2. Follow the **Database Schema Change Workflow** (see below) to add or modify entities.
  3. Implement tenant-aware logic in the service.
  4. Refine DTOs to be synchronized into the shared package.
  5. Write unit and integration tests.
  6. Collaborate with the shared-package-agent.

---

### Rule: Database Schema Change Workflow

To ensure database consistency and prevent data loss, all changes to the Prisma schema **must** follow this exact procedure:

1.  **Check for Drift**: Before making any changes, verify that your local database is in sync with the repository's migration history.
    ```bash
    pnpm --filter backend db:status
    ```
    If this command reports anything other than "Database schema is up to date!", you must resolve the issues before proceeding. A common cause for drift is making manual changes to the database.

2.  **Modify the Schema**: Make your desired changes to the `.prisma` files in the `apps/backend/prisma/schema` directory.

3.  **Validate the Schema**: After saving your changes, check the schema for any syntax or validation errors.
    ```bash
    pnpm --filter backend db:validate
    ```

4.  **Create the Migration**: Once the schema is valid, create a new migration file. Give it a descriptive name when prompted.
    ```bash
    pnpm --filter backend db:migrate:dev
    ```
    This command will also apply the migration to your local database and regenerate the Prisma client.

5.  **Commit the Changes**: Commit the new migration file located in `apps/backend/prisma/migrations/` along with your schema changes. The CI/CD pipeline will fail if you commit schema changes without a corresponding migration.

### Rule: General Frontend Workflow

#### Workflow Steps

- My standard workflow for creating a new frontend feature in the viveroApp project is:
  1. Manually create the feature-sliced directory structure in `src/features/`.
  2. Create the page route in `app/` which renders the main feature component.
  3. Implement components, hooks, and API logic within the feature directory, using shared types.
  4. Write tests.
  5. Curate the feature's public API in its `index.ts` file.

## 🎯 Purpose

This file defines how AI agents must operate when generating, reviewing, or refactoring code and documentation for the **vivero-client-alpha Platform**.

It ensures consistency across:

- **Tech stack decisions**
- **Development practices (TDD & CI/CD)**
- **Product logic & enterprise requirements**

---

## 📂 Core Reference Documents

Agents must **always read and apply** the following project guides before responding:

1. `docs/agents/tech_stack_guide.md`  
   → Defines **approved technology stack** for frontend, backend, infra, and testing.
2. `docs/agents/tdd_cicd_guide.md`  
   `docs/agents/cicd_agent.md`
   → Defines **test-driven development workflow** and **CI/CD requirements**.
3. `docs/agents/product-manager-agent.md`  
   → Defines **product vision, enterprise workflows, and SaaS requirements**.
4. `docs/agents/agricultural-backend-agent.md`
   → Defines **backend implementation standards**, multi-tenant architecture, and agricultural enterprise workflows.
5. `docs/agents/frontend-agent-guide.md`  
   → Defines **frontend implementation standards**, component architecture, performance targets, and agricultural UX patterns.
6. `docs/agents/shared-package-agent.md`
   → Defines how to maintain **type-safe contracts** between frontend and backend.
7. `docs/agents/agricultural-ux-ui-agent.md`
   → Defines **design standards** for the vivero-client-alpha Platform.

---

## ⚖️ Rules of Engagement

- **Do not invent tech.** Only use frameworks, libraries, and tools explicitly defined in `tech_stack_guide.md`.
- **Default backend stack** = `NestJS + Prisma + MariaDB 10.9+`. It handles authentication with username and password stored in the database.
- **Default frontend stack** = `Next.js 14 App Router + Tailwind + shadcn/ui`. Authentication will be handled by a custom username/password system interacting directly with the backend database.
- **Backend implementations** must follow `agricultural-backend-agent.md` (NestJS, Prisma, multi-tenant patterns, etc.).
- **Frontend implementations** must follow `frontend-agent-guide.md` (Next.js 14, Tailwind, shadcn/ui, TanStack, etc.)
- **Shared Contracts:** All data contracts (types, DTOs, schemas) **must** be synchronized via the `@plant-mgmt/shared` package, following the process in `shared-package-agent.md`, to ensure type safety between applications.
- **Product requirements** must follow `product-manager-agent.md` (multi-tenant, enterprise workflows).
- **Testing must follow TDD** as outlined in `tdd_cicd_guide.md` (Vitest, Jest, Playwright, 80%+ coverage).
- **CI/CD**: Must follow the 3-file structure defined in `docs/agents/cicd_agent.md` and is optimized with Turborepo. All GitHub Actions must be verified using the `resolve_library_id` tool before use.
- **Enterprise workflows** (multi-tenancy, supply chain, financial ops, compliance) must follow `product-manager-agent.md`.

---

## 🛠️ Development Standards

- **Monorepo with pnpm workspaces** (`apps/` and `packages/` layout).
- **Build System**: Uses **Turborepo** to manage monorepo tasks and optimize CI/CD pipelines.
- **Local Quality Gates**: Uses **Husky** with pre-commit hooks to automatically run linters and enforce branch protection rules before code is committed.
- **Commit Message Convention**: Follows the **Conventional Commits** specification, as detailed in `COMMIT_CONVENTIONS.md`. This is enforced automatically by `commitlint` via a Husky hook.
- **Shared contracts** (Zod schemas, DTOs, API definitions) live in `packages/shared`.
- **Infrastructure as Code** (Terraform + Helm) in `packages/infra`.
- **Documentation** must use the format specified in `product-manager-agent.md` (Executive Summary, Feature Specs, etc.).

---

## 🌊 Git Workflow

- **Branching Strategy**: All new features should be developed in a feature branch (e.g., `feat/new-feature`).
- **Pull Requests**: Pull requests **must** be made to the dev branch. Pull requests **must never** be made directly to the `main` branch.
- **No Direct Pushes to `main`**: Direct pushes to the `main` branch are **strictly prohibited**.
- **Merging to `main`**: Merges to the `main` branch **must only** be done through the GitHub UI after a pull request to dev has been reviewed and approved.

---

## 📌 Agent Behavior

- Always **cite which doc** a decision comes from (example: “Per `tech_stack_guide.md`, backend must use NestJS”).
- If docs **conflict**, follow this priority:
  1. `tech_stack_guide.md` for technical stack
  2. `tdd_cicd_guide.md` for testing & pipelines
  3. `product-manager-agent.md` for product/enterprise logic
- If **uncertain**, **ask for clarification** instead of assuming defaults.

---

## 🤖 Agent Roles

This section outlines the roles and responsibilities of the AI agents involved in this project.

- **`agricultural-ux-ui-designer`**: Designs the user experience and user interface for the agricultural enterprise management system. See `docs/agents/agricultural-ux-ui-agent.md` for more details.
- **`cicd-pipeline-engineer`**: Creates and manages the CI/CD pipelines for automated testing, building, and deployment. See `docs/agents/cicd_agent.md` for more details.
- **`plant-management-devops-engineer`**: Handles the infrastructure and deployment of the multi-tenant SaaS platform. See `docs/agents/devops_agent.md` for more details.
- **`agricultural-backend-agent`**: Implements the backend of the application using NestJS, Prisma, and other related technologies. See `docs/agents/agricultural-backend-agent.md` for more details.
- **`agricultural-frontend-specialist`**: Implements the frontend of the application using React, Next.js, and other related technologies. See `docs/agents/frontend-agent-guide.md` for more details.
- **`agricultural-product-manager`**: Defines the product vision, features, and requirements for the agricultural enterprise management system. See `docs/agents/product-manager-agent.md` for more details.
- **`qa_agent`**: Ensures enterprise-grade quality through comprehensive testing strategies adapted to multi-tenant plant management systems. See `docs/agents/qa_agent.md` for more details.
- **`shared-package-agent`**: Extracts, synchronizes, and maintains type-safe contracts between frontend and backend applications. See `docs/agents/shared-package-agent.md` for more details.
- **`solo-developer-roadmap`**: Outlines a realistic development timeline for a solo developer building the enterprise plant management system. See `docs/agents/solo_developer_roadmap.md` for more details.
- **`tdd-cicd-guide`**: Provides guidance on Test-Driven Development (TDD) and Continuous Integration/Continuous Deployment (CI/CD) practices. See `docs/agents/tdd_cicd_guide.md` for more details.
- **`tech-stack-guide`**: Defines the approved technology stack for the project. See `docs/agents/tech_stack_guide.md` for more details.

---

## ✅ Success Criteria

- Generated code runs with the defined stack.
- Tests exist **before** feature code (TDD).
- CI/CD pipelines include build, lint, test, coverage, deploy.
- Product features align with enterprise SaaS workflows.
- **Modern User Experience**: Interfaces are responsive, accessible, and provide a modern user experience, including the use of skeleton loading states to manage perceived performance.
- Documentation follows `product-manager-agent.md` structure.

---

🌱💻🚀 _This file is the AI agent’s constitution. Always follow it._
