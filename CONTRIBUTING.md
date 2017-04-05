Start each new item worked on by doing a git pull

If working on an ISSUE, use the gitlab button to [CREATE A BRANCH] based on it

In your repo, use:
```bash
git pull
git checkout -b <branch name>
```
where <branch name> is the name of the branch created by clicking the button in gitlab.

Otherwise, create a *separate branch* for *each* feature/bugfix worked on:
```bash
git pull
git checkout -b <descriptive branch name>
```

Make good, understandable commit messages.

Submit a pull-request.
