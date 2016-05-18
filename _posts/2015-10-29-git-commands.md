---
layout: post
title:  "Git commands"
categories: cmd
tags: git
---

How to remove existing files from git if they should be ignored by .gitignore

`​`` shell
git rm -r --cached .
git add .
git commit -m "Removed all ignored folders and files"
git push origin master
```
