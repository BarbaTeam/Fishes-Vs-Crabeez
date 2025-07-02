# Commit Message Guidelines

<br><br>

## Format

We use the following format for our Git commit messages :
<pre>
<b><a href="#types">&lt;type&gt;</a></b></font>(<b><a href="#scopes">&lt;optional scope&gt;</a></b>): <b><a href="#description">&lt;description&gt;</a></b> (<b><a href="#issues-references">&lt;issues refs&gt;</a></b>)</b>

<b><a href="#body">&lt;optional body&gt;</a></b>

---
<b><a href="#footer">&lt;optional footer&gt;</a></b>
</pre>

And the following format for our Git commit messages introducting breaking changes :
<pre>
<b><a href="#types">&lt;type&gt;</a></b></font>(<b><a href="#scopes">&lt;optional scope&gt;</a></b>)<a href="#breaking-changes-indicator">!</a>: <b><a href="#description">&lt;description&gt;</a></b> (<b><a href="#issues-references">&lt;issues refs&gt;</a></b>)</b>

<b><a href="#body">&lt;optional body&gt;</a></b>

---
<b><a href="#footer">&lt;mandatory footer&gt;</a></b>
</pre>


<br><br>
--------------------------------------------------------------------------------
<br><br>



## Details

### Types

We use an extended subset of the conventional Git commit types.  
Commits types can be divided in three categories :
- **Application commits :** Commits introducing major changes to the application such as new features or fixes.  
Commonly found on the `main` branch.
- **Miscellaneous commits :** Commits that don't affect the application itself but impact other parts of the project. In our case, they mostly concern tests, documentation, and DevOps.  
Commonly found on the `main` branch.
- **Subsidiary commits :** Smaller commits affecting miscellaneous part of the project or the application based on their [scopes](#scopes).  
Commonly found on feature branches or the `develop` branch.

#### Application commits :

- `feat`: Commits adding or removing a new feature
    - `front-feat`: Specific to the frontend
    - `back-feat`: Specific to the backend
- `fix`: Commits fixing an application bug of a preceded `feat` commit
    - `front-fix`: Specific to the frontend
    - `back-fix`: Specific to the backend

#### Miscellaneous commits :

- `test`: Commits, that add missing tests or correcting existing tests
- `ops`: Commits affecting operational components like infrastructure, deployment, backup, recovery, ...
- `docs`: Commits affecting documentation only

#### Subsidiary commits :

- `refactor`: Commits rewriting/restructuring your code, without changing any application behaviour
    - `perf`: Special `refactor` commits dedicated to performance improvement
- `chore`: Small commits that have no more specific types.
- `wip`: Like a `chore` commits but still being worked on.


> [!WARNING]
> **(1)** If a commit message has multiple types possible, it **MUST** be seperated into two distinct commits.  
> **(2)** Use the most specific type for your commit message e.g prefer `front-feat: added home screen` to `feat: added home screen`.  
> **(3)** `wip` commits should **NEVER** be found on the `main` branch.


<br>


### Scopes

The `scope` is an **optional** part of the format, providing additional contextual information.

We use mainly the following scopes in our project :
- `api`: Commits affecting the API (HTTP and/or WS)
    - `http-api`: Specific to the HTTP api
    - `ws-api`: Specific to the WS api
- `game`: Commits affecting the game
- `stats`: Commits affecting the stats
- `ui`: Commits affecting the UI

Some other scopes can be used jointly with miscellaneous commits :
- For `test` commits :
    - `unit`: Commits affecting unit tests
    - `integration`: Commits affecting integration tests
    - `e2e`: Commits affecting E2E tests
- For `ops` commits :
    - `build`: Commits affecting build components like build tool, ci pipeline, dependencies, project version, ...
- For `docs` commits :
    - `dev`: Commits affecting development documentation

*More might be added in the future.*

> [!WARNING]
> Don't use issue identifiers as scopes.


<br>


### Breaking Changes Indicator
Breaking changes indicator is an **optional** part of the format, that should be indicated by an `!` before the `:` in the subject line
e.g `feat(api)!: remove status endpoint`.

> [!WARNING]
> Breaking changes **must** be described in the [commit footer section](#footer) such as :
> ```
> refactor(game)!: superseded http requests with ws communication
>
> The use of http requests for game's updates notification was deemed to change.
>
> ---
> BREAKING CHANGE: http requests aren't used anymore to transfer update message
> ```


<br>


### Description
The `description` is a **mandatory** part of the format, containing a concise description of the change.

> [!WARNING]
> **(1)** Use the past tense e.g "changed" not "change" nor "changes".  
> &emsp; *Think of `This commit has...` or `This commit should have...`*  
> **(2)** Do not capitalize the first letter and do not put a period (`.`) at the end.

> [!NOTE]
> In [Conventional Commit][], the description is in imperative.  
> However, more recent conventions promote using past tense instead because commits are more often used as backlog.  
> Thus, we decided to use past-tense.
>
> *See [this video](https://www.youtube.com/watch?v=SQNb-NxZBPQ) from **the great Philomatics** for the aformentionned "more recent conventions".*


<br>


### Issues References :
The `issues references` is a **mandatory** part of the format, linking the commit to an existing issue ticket
e.g `feat(api): defined client interface (#41)`.

> [!WARNING]
> When there is more than one issues reference, you need to seperate them by a comma followed by a space e.g `feat(api): defined client interface (#41, #42)`..

> [!NOTE]
> **(1)** In [Conventional Commit][], the `issues references` are in the `footer` section.  
> However, we decided to follow more recent variant of the convention to facilitate writing commit message in one line.
>
> **(2)** Even though it's an optional part in Conventional Commit, we made it mandatory as long as there is an issue to reference,
> to better track the evolution of our project.


<br>


### Body
The `body` is an **optional** part of the format, that should include the motivation for the change and contrast this with previous behavior.


<br>


### Footer
The `footer` is a **mandatory** part of the format when the commit introduces a **Breaking Changes** and an **optional** part of the format otherwise.



<br><br>
--------------------------------------------------------------------------------
<br><br>



## Exceptions

Any automattically generated commits by Git or GitHub are exceptions to the guidelines, such as :

#### Merge Commit
<pre>
Merge branch '<b>&lt;branch name&gt;</b>'
</pre>
<sup>Follows default git merge message</sup>

#### Revert Commit :
<pre>
Revert "<b>&lt;reverted commit subject line&gt;</b>"
</pre>
<sup>Follows default git revert message</sup>



<br><br>
--------------------------------------------------------------------------------
<br><br>



## Examples
```
front-feat: added home screen
```
```
feat(api): defined client interface (#41)
```
```
front-fix(game): fixed blinking cursor (#36)

The error occured bcs of angular recomputing the `input` property each frame.
```
```
refactor(game)!: superseded http requests with ws communication

The use of http requests for game's updates notification was deemed to change.

---
BREAKING CHANGE: http requests aren't used anymore to transfer update message
```


<br><br>
--------------------------------------------------------------------------------
<br><br>



## References
[Conventional Commit]: https://www.conventionalcommits.org/en/v1.0.0/#specification
[Git Commit Guidelines]: https://git-scm.com/book/en/v2/Distributed-Git-Contributing-to-a-Project#Commit-Guidelines
[Angular Guidelines]: https://github.com/angular/angular/blob/master/CONTRIBUTING.md

- [Conventional Commit]
- [Git Commit Guidelines]
- [Angular Guidelines]