# Branching Startegy

We follow a simplified Git Flow:

- **main**: Always reflects production-ready code.
- **develop**: Integration branch for completed features and fixes.
- **Feature branches**: Offshoots from `develop` for individual items.


<br/><br/>
--------------------------------------------------------------------------------
<br/><br/>


## Format

We use the following format for branches' names :

<pre>
<b><a href="#types">&lt;type&gt;</a></b></font>/<b><a href="#scopes">&lt;optional scope&gt;</a></b>/<b><a href="#description">&lt;description&gt;</a>
</pre>

> [!NOTE]
> The format for branch is inspired by the format of commits message (see our [Commit Messages Format](./commit-messages-guidelines.md#format)).



<br/><br/>
--------------------------------------------------------------------------------
<br/><br/>



## Details

### Types

Branch is based on the nature of what is being done inside of it :
- `feat`: For branch in which a feature is being worked on
    - `front-feat`: Specific to the frontend
    - `back-feat`: Specific to the backend
- `fix`: For branch in which a fix is being worked on
    - `front-fix`: Specific to the frontend
    - `back-fix`: Specific to the backend
- `test`: For branch in which tests are being worked on
- `ops`: For branch in which operational components are being worked on
- `docs`: For branch in which documentation is being worked on


<br>


### Scopes

The `scope` is an **optional** part of the format, providing additional contextual information.

For `feat` and for `fix` branches :
- `api`: Branch in which the API (HTTP and/or WS) is being worked on
    - `http-api`: Specific to the HTTP api
    - `ws-api`: Specific to the WS api
- `game`: Branch in which the game is being worked on
- `stats`: Branch in which the stats is being worked on
- `ui`: Branch in which the UI is being worked on

For `test` branches :
- `unit`: Branch in which unit tests are being added or corrected
- `integration`: Branch in which integration tests are being added or corrected
- `e2e`: Branch in which E2E tests are being added or corrected

For `ops` branches :
- `build`: Branch in which build components are being worked on

For `docs` branches :
- `dev`: Branch in which development documentation is being worked on

*More might be added in the future.*

> [!WARNING]
> Don't use issue identifiers as scopes.


<br>


### Description
The `description` is a **mandatory** part of the format, containing a concise description of the change.

> [!WARNING]
> **(1)** Use the present continuous e.g "changing" not "changed" nor "change" nor "changes" or simply the name of the feature.  
> &emsp; *Think of `This commit is...` or `This commit should be...`*  
> **(2)** Consider the description as a filename, therefore :  
> &emsp;\- Do not put any strange character such as a period (`.`)  
> &emsp;\- Put hyphens (`-`) between each word of the description instead of spaces  
> **(3)** Do not capitalize the first letter



<br/><br/>
--------------------------------------------------------------------------------
<br/><br/>



## Examples

* `feat/game/boss`

* `back-fix/fixing-api`
