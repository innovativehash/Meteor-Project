# Contributing to CollectiveUniversity

## Working on GitLab Issues, Features
**Start each new item worked on by doing a git pull from master**

If working on an ISSUE, use the gitlab button located on the issue's page, 
*[NEW BRANCH]* to create a new branch based on it, for this example, the issue 
would be titled, "34-course-builder-test-incorrect-validation-message-is-shown"

After clicking that button, go into your repo and do a 
```bash
git pull
```
Youll see in the pull some text to the affect:
```
remote: Counting objects: 1, done.
remote: Total 1 (delta 0), reused 0 (delta 0)
Unpacking objects: 100% (1/1), done.
From gitlab.com:nsardo/collective-university-master
   8e1d4c5..fa9b05c  master     -> origin/master
 * [new branch]      34-course-builder-test-incorrect-validation-message-is-shown
 ...
```

**NOTE** the * [new branch]. 
Now, on your command line, you would enter:

```
git checkout 34-course-builder-test-incorrect-validation-message-is-shown
```
This places you in the new branch, ready to do your work.

**After** completing your work, enter
```
git push
```

## Working on a Bug or Feature **not** in the Issue Tracker
If you are working on something for which there is **not** a GitLab issue:
```bash
git pull
git checkout -b <descriptive branch name>
```
where <descriptive branch name> is a **descriptive** name for what you are doing.

## **ALWAYS**
**Start with**:
```
git pull
```

Create a **separate branch** for **each** *feature/bugfix* worked on:

Make good, understandable commit messages.

When finished, submit a pull-request:
(from the branch you're working on)
```bash
git push
```
