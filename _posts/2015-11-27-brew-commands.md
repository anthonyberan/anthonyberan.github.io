---
layout: post
title:  "Brew commands"
categories: cmd
tags: brew
---

To get around xcode license agreement errors:

`​`` shell
sudo xcodebuild -license
```


If brew starts having permission issues
`​`` shell
sudo chown -R $(whoami):admin /usr/local
```

To update brew
`​`` shell
brew update
```

To upgrade packages managed by brew
`​`` shell
brew upgrade
```
