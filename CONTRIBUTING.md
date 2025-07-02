# Contributing to "Fishes VS Crabeez"

Thank you for your interest in improving "Fishes VS Crabeez"! Your contributions—whether reporting bugs, proposing features, or joining discussions—help make our project better for everyone.

---

## Table of Contents

1. [Getting Help](#getting-help)

2. [Opening an Issue]()

3. [Branching Strategy](#branching-strategy)
4. [Branch Naming Conventions](#branch-naming-conventions)

5. [Contributing to the Codebase](#contributing-to-the-codebase)
   * [Setting Up Your Environment](#setting-up-your-environment)
   * [Making Changes](#making-changes)
   * [Commit Message Guidelines](#commit-message-guidelines)
   * [Submitting a Pull Request](#submitting-a-pull-request)

6. [Project Guidelines](#project-guidelines)

7. [Other Ways to Contribute](#other-ways-to-contribute)



<br/><br/>
--------------------------------------------------------------------------------
<br/><br/>



## Getting Help

<!-- TODO : Having somewhere to ask question -->
**Questions & Discussions**: Join us on [Slack](https://slack.example.com) to ask questions and discuss ideas.



<br/><br/>
--------------------------------------------------------------------------------
<br/><br/>



## Opening an Issue :

Before opening an issue, search for existing issues to avoid duplicates.
Then open your issue following our [Issues Guideline](./docs/guidelines/issues.guidelines.md).

Note that we track issue status using our project board:

| Status        | Description                                                     |
| ------------- | --------------------------------------------------------------- |
| **TODO**      | Issue created; `help wanted` label applied.                     |
| **WIP**       | Work in progress; assigned and `help wanted` label removed.     |
| **PR**        | Implementation complete; awaiting code review via Pull Request. |
| **DONE**      | Approved and merged into `develop`; issue closed.               |
| **DISCARDED** | Issue deemed unnecessary; closed without merging.               |



<br/><br/>
--------------------------------------------------------------------------------
<br/><br/>



## Contributing to the Codebase

### Setting Up Your Environment

Because the main repo is reserved to the core developper, you will need to fork the project before contributing to it :
1. Fork the repository to your GitHub account.
2. Clone your fork and add upstream remote:
   ```sh
   git clone git@github.com:<you>/Fishes-Vs-Crabeez.git
   cd Fishes-Vs-Crabeez
   git remote add upstream git@github.com:BarbaTeam/Fishes-Vs-Crabeez.git
   ```
3. Ensure dependencies are installed by executing the script `setup.sh` :

### Making Changes

1. Sync with `develop`:
   ```sh
   git fetch upstream
   git checkout develop
   git pull upstream develop
   ```
2. Create a feature branch:
   ```sh
   git checkout -b feat/<short-description>
   ```
3. Implement your changes through commits following our [Commit Messages Guidelines](./docs/guidelines/commit-messages-guidelines.md)
4. Rebase or merge `develop` to keep up to date:
   ```sh
   git fetch upstream
   git rebase upstream/develop
   ```

### Submitting a Pull Request

1. Push your branch to your fork:
   ```sh
   git push origin feat/<short-description>
   ```
2. On GitHub, open a PR against `develop`.
3. In the PR description, link the related issue (e.g., `Closes #123`).
4. Assign reviewers and ensure all checks pass.
5. Address review feedback by pushing additional commits to the same branch.

Once approved and merged into `develop`, your branch will be deleted.



<br/><br/>
--------------------------------------------------------------------------------
<br/><br/>



## Project Guidelines

Please consult our set of detailed guidelines to ensure consistency :

<!----------------------------------------------------------------------------->
<!-- TODO : ... -->
* [Issues Guidelines](./docs/guidelines/issues.guidelines.md)
    * [Feature Request](./docs/guidelines/issues-guidelines.md#feature-request)
    * [Task](./docs/guidelines/issues-guidelines.md#task)
    * [Bug Report](./docs/guidelines/issues-guidelines.md#bug-report)
<!----------------------------------------------------------------------------->
<!-- TODO : ... -->
* [Branching Strategy](./docs/guidelines/branching-strategy.md)
<!----------------------------------------------------------------------------->
<!-- TODO : ... -->
* [Coding Guidelines](./docs/guidelines/coding-guidelines.md)
    * [Naming Convention](./docs/guidelines/coding-guidelines.md#naming-convention)
    * [Do Not Use](./docs/guidelines/coding-guidelines.md#do-not-use)
* [Frontend Coding Guidelines](./docs/guidelines/coding-guidelines.frontend.md)
* [Backend Coding Guidelines](./docs/guidelines/coding-guidelines.backend.md)
<!----------------------------------------------------------------------------->
<!-- DONE -->
* [Commit Messages Guidelines](./docs/guidelines/commit-messages-guidelines.md)
    * [Format](./docs/guidelines/commit-messages-guidelines.md#format)
    * [Details](./docs/guidelines/commit-messages-guidelines.md#details)
    * [Exceptions](./docs/guidelines/commit-messages-guidelines.md#exceptions)
    * [Examples](./docs/guidelines/commit-messages-guidelines.md#examples)
<!----------------------------------------------------------------------------->



<br/><br/>
--------------------------------------------------------------------------------
<br/><br/>



## Other Ways to Contribute

- **Code Reviews**: Provide constructive feedback on open PRs.
- **Documentation**: Improve docs, examples, or tutorials.
- **Design & Art**: Make some sprites, UI mockups, or animations.
- **Community Support**: Help others in Slack or GitHub discussions.
- **Bug Reports**: Reports bugs that you encountered (see our [Bug Report Guidelines](./docs/guidelines/issues-guidelines.md#bug-report))



<br/><br/>
--------------------------------------------------------------------------------
<br/><br/>



Thank you for helping build "Fishes VS Crabeez"! We look forward to your contributions. Feel free to reach out with any questions.
